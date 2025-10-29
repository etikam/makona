"""
Vues pour l'app candidates
"""
from rest_framework import generics, status, permissions, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from django.db import models
from django.utils import timezone

from .models import Candidature, CandidatureFile, Vote
from .serializers import (
    CandidatureSerializer, CandidatureCreateSerializer, CandidatureUpdateSerializer,
    CandidatureListSerializer, CandidatureAdminSerializer, CandidatureAdminCreateSerializer, CandidatureFileSerializer
)
from accounts.permissions import IsAdminUser, IsCandidateUser, IsOwnerOrAdmin
from categories.models import Category


class CandidatureListView(generics.ListAPIView):
    """
    Vue pour lister les candidatures approuvées (publique)
    """
    queryset = Candidature.objects.filter(status='approved').select_related(
        'candidate', 'category'
    ).prefetch_related('files')
    serializer_class = CandidatureListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category']
    search_fields = ['candidate__first_name', 'candidate__last_name', 'category__name']
    ordering_fields = ['submitted_at']
    ordering = ['-submitted_at']


class CandidatureDetailView(generics.RetrieveAPIView):
    """
    Vue pour récupérer les détails d'une candidature approuvée
    """
    queryset = Candidature.objects.filter(status='approved').select_related(
        'candidate', 'category'
    ).prefetch_related('files')
    serializer_class = CandidatureSerializer
    permission_classes = [permissions.AllowAny]


class CandidatureByCategoryView(generics.ListAPIView):
    """
    Vue pour lister les candidatures d'une catégorie spécifique
    """
    serializer_class = CandidatureListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['candidate__first_name', 'candidate__last_name']
    ordering_fields = ['submitted_at']
    ordering = ['-submitted_at']
    
    def get_queryset(self):
        category_slug = self.kwargs['category_slug']
        category = get_object_or_404(Category, slug=category_slug, is_active=True)
        return Candidature.objects.filter(
            category=category,
            status='approved'
        ).select_related('candidate', 'category').prefetch_related('files')


class MyCandidaturesView(generics.ListCreateAPIView):
    """
    Vue pour gérer les candidatures de l'utilisateur connecté
    """
    permission_classes = [permissions.IsAuthenticated, IsCandidateUser]
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return CandidatureListSerializer
        return CandidatureCreateSerializer
    
    def get_queryset(self):
        return Candidature.objects.filter(
            candidate=self.request.user
        ).select_related('category').prefetch_related('files')
    
    def perform_create(self, serializer):
        serializer.save(candidate=self.request.user)


class MyCandidatureDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vue pour gérer une candidature spécifique de l'utilisateur
    """
    permission_classes = [permissions.IsAuthenticated, IsCandidateUser, IsOwnerOrAdmin]
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return CandidatureSerializer
        return CandidatureUpdateSerializer
    
    def get_queryset(self):
        return Candidature.objects.filter(candidate=self.request.user)
    
    def perform_destroy(self, instance):
        # Ne permettre la suppression que si la candidature est en attente
        if instance.status != 'pending':
            from django.core.exceptions import ValidationError
            raise ValidationError("Seules les candidatures en attente peuvent être supprimées.")
        instance.delete()


class MyCandidatureUpdateView(generics.UpdateAPIView):
    """
    Vue spécialisée pour la mise à jour des candidatures avec fichiers
    """
    permission_classes = [permissions.IsAuthenticated, IsCandidateUser]
    serializer_class = CandidatureSerializer
    
    def get_queryset(self):
        return Candidature.objects.filter(candidate=self.request.user)
    
    def put(self, request, *args, **kwargs):
        """Mettre à jour une candidature avec gestion des fichiers"""
        candidature = self.get_object()
        
        # Vérifier que la candidature peut être modifiée
        if not candidature.can_be_modified():
            return Response(
                {"detail": "Cette candidature ne peut plus être modifiée"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Mettre à jour la description si fournie
        if 'description' in request.data:
            candidature.description = request.data['description']
            candidature.save()
        
        # Traiter les nouveaux fichiers
        file_types = ['photo', 'video', 'audio', 'portfolio', 'documents']
        for file_type in file_types:
            files_key = f'{file_type}_files'
            if files_key in request.FILES:
                files = request.FILES.getlist(files_key)
                for file in files:
                    CandidatureFile.objects.create(
                        candidature=candidature,
                        file=file,
                        file_type=file_type
                    )
        
        # Retourner la candidature mise à jour
        serializer = self.get_serializer(candidature)
        return Response(serializer.data)


class CandidatureAdminListView(generics.ListAPIView):
    """
    Vue admin pour lister toutes les candidatures
    """
    queryset = Candidature.objects.all().select_related(
        'candidate', 'category', 'reviewed_by'
    ).prefetch_related('files')
    serializer_class = CandidatureAdminSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'category', 'candidate__country']
    search_fields = ['candidate__first_name', 'candidate__last_name', 'candidate__email']
    ordering_fields = ['submitted_at', 'reviewed_at']
    ordering = ['-submitted_at']


class CandidatureAdminDetailView(generics.RetrieveAPIView):
    """
    Vue admin pour récupérer les détails d'une candidature
    """
    queryset = Candidature.objects.all().select_related(
        'candidate', 'category', 'reviewed_by'
    ).prefetch_related('files')
    serializer_class = CandidatureAdminSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated, IsAdminUser])
def approve_candidature_view(request, candidature_id):
    """
    Vue pour approuver une candidature
    """
    candidature = get_object_or_404(Candidature, id=candidature_id)
    
    if candidature.status != 'pending':
        return Response({
            'error': 'Cette candidature a déjà été traitée.'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    candidature.approve(request.user)
    
    return Response({
        'message': 'Candidature approuvée avec succès',
        'status': candidature.status
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated, IsAdminUser])
def reject_candidature_view(request, candidature_id):
    """
    Vue pour rejeter une candidature
    """
    candidature = get_object_or_404(Candidature, id=candidature_id)
    
    if candidature.status != 'pending':
        return Response({
            'error': 'Cette candidature a déjà été traitée.'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    reason = request.data.get('reason', '')
    candidature.reject(request.user, reason)
    
    return Response({
        'message': 'Candidature rejetée',
        'status': candidature.status,
        'reason': reason
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated, IsAdminUser])
def candidature_stats_view(request):
    """
    Vue pour récupérer les statistiques des candidatures
    """
    stats = {
        'total': Candidature.objects.count(),
        'pending': Candidature.objects.filter(status='pending').count(),
        'approved': Candidature.objects.filter(status='approved').count(),
        'rejected': Candidature.objects.filter(status='rejected').count(),
        'by_category': {},
        'by_country': {}
    }
    
    # Statistiques par catégorie
    from django.db.models import Count
    category_stats = Candidature.objects.values('category__name').annotate(
        total=Count('id'),
        pending=Count('id', filter=models.Q(status='pending')),
        approved=Count('id', filter=models.Q(status='approved')),
        rejected=Count('id', filter=models.Q(status='rejected'))
    )
    
    for stat in category_stats:
        stats['by_category'][stat['category__name']] = {
            'total': stat['total'],
            'pending': stat['pending'],
            'approved': stat['approved'],
            'rejected': stat['rejected']
        }
    
    # Statistiques par pays
    country_stats = Candidature.objects.values('candidate__country').annotate(
        total=Count('id')
    )
    
    for stat in country_stats:
        country_name = dict(Candidature._meta.get_field('candidate').related_model.COUNTRY_CHOICES).get(
            stat['candidate__country'], stat['candidate__country']
        )
        stats['by_country'][country_name] = stat['total']
    
    return Response(stats, status=status.HTTP_200_OK)


# ===== VUES ADMIN POUR LA GESTION DES CANDIDATURES =====

class AdminCandidatureListView(generics.ListAPIView):
    """
    Vue admin pour lister toutes les candidatures avec filtres
    """
    serializer_class = CandidatureAdminSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'category', 'candidate', 'published']
    search_fields = [
        'candidate__first_name', 'candidate__last_name', 'candidate__email',
        'category__name', 'description'
    ]
    ordering_fields = ['submitted_at', 'reviewed_at', 'status']
    ordering = ['-submitted_at']

    def get_queryset(self):
        return Candidature.objects.select_related(
            'candidate', 'category', 'category__category_class', 'reviewed_by'
        ).prefetch_related('files').annotate(
            vote_count=models.Count('votes', distinct=True)
        )


class AdminCandidatureDetailView(generics.RetrieveAPIView):
    """
    Vue admin pour récupérer les détails d'une candidature
    """
    serializer_class = CandidatureAdminSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def get_queryset(self):
        return Candidature.objects.select_related(
            'candidate', 'category', 'category__category_class', 'reviewed_by'
        ).prefetch_related('files').annotate(
            vote_count=models.Count('votes', distinct=True)
        )


class AdminCandidatureUpdateView(generics.UpdateAPIView):
    """
    Vue admin pour mettre à jour une candidature
    """
    serializer_class = CandidatureUpdateSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def get_queryset(self):
        return Candidature.objects.select_related(
            'candidate', 'category', 'category__category_class', 'reviewed_by'
        ).prefetch_related('files')

    def update(self, request, *args, **kwargs):
        candidature = self.get_object()
        
        # Mettre à jour les champs de base
        if 'description' in request.data:
            candidature.description = request.data['description']
        
        if 'status' in request.data:
            candidature.status = request.data['status']
            if request.data['status'] == 'approved':
                candidature.reviewed_at = timezone.now()
                candidature.reviewed_by = request.user
            elif request.data['status'] == 'rejected':
                candidature.reviewed_at = timezone.now()
                candidature.reviewed_by = request.user
        
        if 'published' in request.data:
            candidature.published = request.data['published']
        
        if 'rejection_reason' in request.data:
            candidature.rejection_reason = request.data['rejection_reason']
        
        candidature.save()
        
        serializer = self.get_serializer(candidature)
        return Response(serializer.data)


class AdminCandidatureDeleteView(generics.DestroyAPIView):
    """
    Vue admin pour supprimer une candidature
    """
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def get_queryset(self):
        return Candidature.objects.all()

    def destroy(self, request, *args, **kwargs):
        candidature = self.get_object()
        
        # Supprimer tous les fichiers associés
        candidature.files.all().delete()
        
        # Supprimer tous les votes associés
        candidature.votes.all().delete()
        
        # Supprimer la candidature
        candidature.delete()
        
        return Response(
            {"detail": "Candidature supprimée avec succès"}, 
            status=status.HTTP_204_NO_CONTENT
        )


class AdminCandidatureCreateView(generics.CreateAPIView):
    """
    Vue admin pour créer une candidature
    """
    serializer_class = CandidatureAdminCreateSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]

    def perform_create(self, serializer):
        # L'admin peut créer une candidature pour n'importe quel candidat
        serializer.save()