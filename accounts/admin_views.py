"""
Vues pour l'administration
"""
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from django.contrib.auth import get_user_model
from django.db.models import Q, Count
from django.shortcuts import get_object_or_404

from .models import User, CandidateProfile
from .admin_serializers import (
    AdminUserSerializer, AdminCandidateProfileSerializer,
    CreateUserSerializer, UpdateUserSerializer,
    CreateCandidateProfileSerializer, UpdateCandidateProfileSerializer
)
from candidates.models import Candidature
from candidates.admin_serializers import AdminCandidatureSerializer

User = get_user_model()


class AdminUserPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class AdminUsersView(APIView):
    """Vue pour lister et créer des utilisateurs (admin)"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        # Vérifier que l'utilisateur est admin
        if not self.request.user.is_authenticated or not self.request.user.is_admin():
            return [permissions.IsAdminUser()]
        return super().get_permissions()
    
    def get(self, request):
        """Lister tous les utilisateurs avec filtres"""
        users = User.objects.all().select_related('candidate_profile').prefetch_related('candidatures')
        
        # Filtres
        user_type = request.query_params.get('user_type')
        if user_type:
            users = users.filter(user_type=user_type)
        
        search = request.query_params.get('search')
        if search:
            users = users.filter(
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search) |
                Q(email__icontains=search) |
                Q(username__icontains=search)
            )
        
        is_verified = request.query_params.get('is_verified')
        if is_verified is not None:
            users = users.filter(is_verified=is_verified.lower() == 'true')
        
        is_active = request.query_params.get('is_active')
        if is_active is not None:
            users = users.filter(is_active=is_active.lower() == 'true')
        
        # Pagination
        paginator = AdminUserPagination()
        page = paginator.paginate_queryset(users, request)
        
        if page is not None:
            serializer = AdminUserSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        
        serializer = AdminUserSerializer(users, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        """Créer un nouvel utilisateur"""
        serializer = CreateUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                AdminUserSerializer(user).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminUserDetailView(APIView):
    """Vue pour gérer un utilisateur spécifique (admin)"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        if not self.request.user.is_authenticated or not self.request.user.is_admin():
            return [permissions.IsAdminUser()]
        return super().get_permissions()
    
    def get(self, request, user_id):
        """Récupérer un utilisateur"""
        user = get_object_or_404(User, id=user_id)
        serializer = AdminUserSerializer(user)
        return Response(serializer.data)
    
    def put(self, request, user_id):
        """Mettre à jour un utilisateur"""
        user = get_object_or_404(User, id=user_id)
        serializer = UpdateUserSerializer(user, data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(AdminUserSerializer(user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, user_id):
        """Supprimer un utilisateur"""
        user = get_object_or_404(User, id=user_id)
        
        # Empêcher la suppression de l'utilisateur connecté
        if user == request.user:
            return Response(
                {"error": "Vous ne pouvez pas supprimer votre propre compte"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminCandidateProfilesView(APIView):
    """Vue pour lister et créer des profils candidats (admin)"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        if not self.request.user.is_authenticated or not self.request.user.is_admin():
            return [permissions.IsAdminUser()]
        return super().get_permissions()
    
    def get(self, request):
        """Lister tous les profils candidats"""
        profiles = CandidateProfile.objects.select_related('user').all()
        
        # Filtres
        search = request.query_params.get('search')
        if search:
            profiles = profiles.filter(
                Q(user__first_name__icontains=search) |
                Q(user__last_name__icontains=search) |
                Q(user__email__icontains=search) |
                Q(bio__icontains=search)
            )
        
        # Pagination
        paginator = AdminUserPagination()
        page = paginator.paginate_queryset(profiles, request)
        
        if page is not None:
            serializer = AdminCandidateProfileSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        
        serializer = AdminCandidateProfileSerializer(profiles, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        """Créer un profil candidat"""
        serializer = CreateCandidateProfileSerializer(data=request.data)
        if serializer.is_valid():
            profile = serializer.save()
            return Response(
                AdminCandidateProfileSerializer(profile).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminUserCandidateProfileView(APIView):
    """Vue pour créer un profil candidat pour un utilisateur (admin)"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        if not self.request.user.is_authenticated or not self.request.user.is_admin():
            return [permissions.IsAdminUser()]
        return super().get_permissions()
    
    def post(self, request, pk):
        """Créer un profil candidat pour un utilisateur"""
        user = get_object_or_404(User, pk=pk)
        
        if not user.is_candidate:
            return Response(
                {"error": "Cet utilisateur n'est pas un candidat"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Vérifier si le profil existe déjà
        if hasattr(user, 'candidate_profile'):
            return Response(
                {"error": "Ce candidat a déjà un profil"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        from candidates.models import CandidateProfile
        from candidates.serializers import CandidateProfileSerializer
        
        profile_data = request.data.copy()
        profile_data['user'] = user.id
        
        serializer = CandidateProfileSerializer(data=profile_data)
        if serializer.is_valid():
            profile = serializer.save()
            return Response(
                CandidateProfileSerializer(profile).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminCandidateProfileDetailView(APIView):
    """Vue pour gérer un profil candidat spécifique (admin)"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        if not self.request.user.is_authenticated or not self.request.user.is_admin():
            return [permissions.IsAdminUser()]
        return super().get_permissions()
    
    def get(self, request, profile_id):
        """Récupérer un profil candidat"""
        profile = get_object_or_404(CandidateProfile, id=profile_id)
        serializer = AdminCandidateProfileSerializer(profile)
        return Response(serializer.data)
    
    def put(self, request, profile_id):
        """Mettre à jour un profil candidat"""
        profile = get_object_or_404(CandidateProfile, id=profile_id)
        serializer = UpdateCandidateProfileSerializer(profile, data=request.data)
        if serializer.is_valid():
            profile = serializer.save()
            return Response(AdminCandidateProfileSerializer(profile).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, profile_id):
        """Supprimer un profil candidat"""
        profile = get_object_or_404(CandidateProfile, id=profile_id)
        profile.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AdminUserCandidaturesView(APIView):
    """Vue pour lister les candidatures d'un utilisateur (admin)"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        if not self.request.user.is_authenticated or not self.request.user.is_admin():
            return [permissions.IsAdminUser()]
        return super().get_permissions()
    
    def get(self, request, user_id):
        """Lister les candidatures d'un utilisateur"""
        user = get_object_or_404(User, id=user_id)
        
        if user.user_type != 'candidate':
            return Response(
                {"error": "Cet utilisateur n'est pas un candidat"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        candidatures = user.candidatures.select_related('category').prefetch_related('files').all()
        serializer = AdminCandidatureSerializer(candidatures, many=True)
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def admin_dashboard_stats(request):
    """Statistiques pour le dashboard admin"""
    if not request.user.is_admin():
        return Response(
            {"error": "Accès non autorisé"},
            status=status.HTTP_403_FORBIDDEN
        )
    
    stats = {
        'users': {
            'total': User.objects.count(),
            'candidates': User.objects.filter(user_type='candidate').count(),
            'admins': User.objects.filter(user_type='admin').count(),
            'verified': User.objects.filter(is_verified=True).count(),
            'active': User.objects.filter(is_active=True).count(),
        },
        'candidatures': {
            'total': Candidature.objects.count(),
            'pending': Candidature.objects.filter(status='pending').count(),
            'approved': Candidature.objects.filter(status='approved').count(),
            'rejected': Candidature.objects.filter(status='rejected').count(),
        },
        'profiles': {
            'total': CandidateProfile.objects.count(),
            'with_social': CandidateProfile.objects.exclude(
                Q(facebook_url='') & Q(instagram_url='') & Q(youtube_url='') & Q(website_url='')
            ).count(),
        }
    }
    
    return Response(stats)
