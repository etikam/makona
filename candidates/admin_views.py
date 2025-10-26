"""
Vues admin pour l'app candidates
"""
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q, Count
from django.shortcuts import get_object_or_404
from django.utils import timezone

from .models import Candidature, CandidatureFile
from .admin_serializers import (
    AdminCandidatureSerializer, AdminCandidatureUpdateSerializer,
    AdminCandidatureFileSerializer, AdminCandidatureFileCreateSerializer,
    AdminCandidatureFileUpdateSerializer
)
from accounts.models import User
from categories.models import Category


class AdminCandidaturePagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class AdminCandidaturesView(APIView):
    """Vue pour lister et créer des candidatures (admin)"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        if not self.request.user.is_authenticated or not self.request.user.is_admin():
            return [permissions.IsAdminUser()]
        return super().get_permissions()
    
    def get(self, request):
        """Lister toutes les candidatures avec filtres"""
        candidatures = Candidature.objects.select_related(
            'candidate', 'category', 'reviewed_by'
        ).prefetch_related('files').all()
        
        # Filtres
        status_filter = request.query_params.get('status')
        if status_filter:
            candidatures = candidatures.filter(status=status_filter)
        
        category_id = request.query_params.get('category')
        if category_id:
            candidatures = candidatures.filter(category_id=category_id)
        
        candidate_id = request.query_params.get('candidate')
        if candidate_id:
            candidatures = candidatures.filter(candidate_id=candidate_id)
        
        search = request.query_params.get('search')
        if search:
            candidatures = candidatures.filter(
                Q(candidate__first_name__icontains=search) |
                Q(candidate__last_name__icontains=search) |
                Q(candidate__email__icontains=search) |
                Q(category__name__icontains=search)
            )
        
        # Tri
        sort_by = request.query_params.get('sort_by', '-submitted_at')
        candidatures = candidatures.order_by(sort_by)
        
        # Pagination
        paginator = AdminCandidaturePagination()
        page = paginator.paginate_queryset(candidatures, request)
        
        if page is not None:
            serializer = AdminCandidatureSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        
        serializer = AdminCandidatureSerializer(candidatures, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        """Créer une nouvelle candidature"""
        from .admin_serializers import AdminCandidatureCreateSerializer
        
        serializer = AdminCandidatureCreateSerializer(data=request.data)
        if serializer.is_valid():
            candidature = serializer.save()
            return Response(
                AdminCandidatureSerializer(candidature).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminCandidatureDetailView(APIView):
    """Vue pour gérer une candidature spécifique (admin)"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        if not self.request.user.is_authenticated or not self.request.user.is_admin():
            return [permissions.IsAdminUser()]
        return super().get_permissions()
    
    def get(self, request, candidature_id):
        """Récupérer une candidature"""
        candidature = get_object_or_404(
            Candidature.objects.select_related('candidate', 'category', 'reviewed_by')
            .prefetch_related('files'),
            id=candidature_id
        )
        serializer = AdminCandidatureSerializer(candidature)
        return Response(serializer.data)
    
    def put(self, request, candidature_id):
        """Mettre à jour une candidature"""
        candidature = get_object_or_404(Candidature, id=candidature_id)
        serializer = AdminCandidatureUpdateSerializer(candidature, data=request.data)
        
        if serializer.is_valid():
            # Mettre à jour les champs de révision
            if 'status' in serializer.validated_data:
                candidature.reviewed_at = timezone.now()
                candidature.reviewed_by = request.user
            
            candidature = serializer.save()
            return Response(AdminCandidatureSerializer(candidature).data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, candidature_id):
        """Supprimer une candidature"""
        candidature = get_object_or_404(Candidature, id=candidature_id)
        candidature.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminCandidatureApproveView(APIView):
    """Vue pour approuver une candidature (admin)"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        if not self.request.user.is_authenticated or not self.request.user.is_admin():
            return [permissions.IsAdminUser()]
        return super().get_permissions()
    
    def post(self, request, candidature_id):
        """Approuver une candidature"""
        candidature = get_object_or_404(Candidature, id=candidature_id)
        
        if candidature.status != 'pending':
            return Response(
                {"error": "Seules les candidatures en attente peuvent être approuvées"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        candidature.approve(request.user)
        serializer = AdminCandidatureSerializer(candidature)
        return Response(serializer.data)


class AdminCandidatureRejectView(APIView):
    """Vue pour rejeter une candidature (admin)"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        if not self.request.user.is_authenticated or not self.request.user.is_admin():
            return [permissions.IsAdminUser()]
        return super().get_permissions()
    
    def post(self, request, candidature_id):
        """Rejeter une candidature"""
        candidature = get_object_or_404(Candidature, id=candidature_id)
        
        if candidature.status != 'pending':
            return Response(
                {"error": "Seules les candidatures en attente peuvent être rejetées"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        rejection_reason = request.data.get('rejection_reason', '')
        if not rejection_reason:
            return Response(
                {"error": "Une raison de rejet est requise"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        candidature.reject(request.user, rejection_reason)
        serializer = AdminCandidatureSerializer(candidature)
        return Response(serializer.data)


class AdminCandidatureFilesView(APIView):
    """Vue pour gérer les fichiers d'une candidature (admin)"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        if not self.request.user.is_authenticated or not self.request.user.is_admin():
            return [permissions.IsAdminUser()]
        return super().get_permissions()
    
    def get(self, request, candidature_id):
        """Lister les fichiers d'une candidature"""
        candidature = get_object_or_404(Candidature, id=candidature_id)
        files = candidature.files.all().order_by('order', 'uploaded_at')
        serializer = AdminCandidatureFileSerializer(files, many=True)
        return Response(serializer.data)
    
    def post(self, request, candidature_id):
        """Ajouter un fichier à une candidature"""
        candidature = get_object_or_404(Candidature, id=candidature_id)
        
        data = request.data.copy()
        data['candidature'] = candidature.id
        
        serializer = AdminCandidatureFileCreateSerializer(data=data)
        if serializer.is_valid():
            file_obj = serializer.save()
            return Response(
                AdminCandidatureFileSerializer(file_obj).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminCandidatureFileDetailView(APIView):
    """Vue pour gérer un fichier de candidature spécifique (admin)"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        if not self.request.user.is_authenticated or not self.request.user.is_admin():
            return [permissions.IsAdminUser()]
        return super().get_permissions()
    
    def get(self, request, candidature_id, file_id):
        """Récupérer un fichier de candidature"""
        file_obj = get_object_or_404(
            CandidatureFile.objects.select_related('candidature'),
            id=file_id,
            candidature_id=candidature_id
        )
        serializer = AdminCandidatureFileSerializer(file_obj)
        return Response(serializer.data)
    
    def put(self, request, candidature_id, file_id):
        """Mettre à jour un fichier de candidature"""
        file_obj = get_object_or_404(
            CandidatureFile,
            id=file_id,
            candidature_id=candidature_id
        )
        serializer = AdminCandidatureFileUpdateSerializer(file_obj, data=request.data)
        if serializer.is_valid():
            file_obj = serializer.save()
            return Response(AdminCandidatureFileSerializer(file_obj).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, candidature_id, file_id):
        """Supprimer un fichier de candidature"""
        file_obj = get_object_or_404(
            CandidatureFile,
            id=file_id,
            candidature_id=candidature_id
        )
        file_obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def admin_candidature_stats(request):
    """Statistiques des candidatures pour le dashboard admin"""
    if not request.user.is_admin():
        return Response(
            {"error": "Accès non autorisé"},
            status=status.HTTP_403_FORBIDDEN
        )
    
    stats = {
        'total': Candidature.objects.count(),
        'pending': Candidature.objects.filter(status='pending').count(),
        'approved': Candidature.objects.filter(status='approved').count(),
        'rejected': Candidature.objects.filter(status='rejected').count(),
        'by_category': list(
            Candidature.objects.values('category__name')
            .annotate(count=Count('id'))
            .order_by('-count')
        ),
        'by_status': list(
            Candidature.objects.values('status')
            .annotate(count=Count('id'))
        ),
        'recent_submissions': Candidature.objects.filter(
            submitted_at__gte=timezone.now() - timezone.timedelta(days=7)
        ).count(),
    }
    
    return Response(stats)
