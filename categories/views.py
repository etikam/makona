"""
Vues pour l'app categories
"""
from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Category
from .serializers import (
    CategorySerializer, CategoryListSerializer, 
    CategoryDetailSerializer, CategoryCreateUpdateSerializer
)
from accounts.permissions import IsAdminUser, IsPublicOrAuthenticated


class CategoryListView(generics.ListAPIView):
    """
    Vue pour lister toutes les catégories actives
    """
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategoryListSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None  # Pas de pagination pour les catégories


class CategoryDetailView(generics.RetrieveAPIView):
    """
    Vue pour récupérer les détails d'une catégorie
    """
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategoryDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'


class CategoryAdminListView(generics.ListCreateAPIView):
    """
    Vue admin pour lister et créer des catégories
    """
    queryset = Category.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return CategorySerializer
        return CategoryCreateUpdateSerializer


class CategoryAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Vue admin pour gérer une catégorie spécifique
    """
    queryset = Category.objects.all()
    serializer_class = CategoryCreateUpdateSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    lookup_field = 'slug'
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return CategorySerializer
        return CategoryCreateUpdateSerializer


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def category_stats_view(request, slug):
    """
    Vue pour récupérer les statistiques d'une catégorie
    """
    category = get_object_or_404(Category, slug=slug, is_active=True)
    
    # Statistiques de base
    stats = {
        'category': {
            'id': category.id,
            'name': category.name,
            'slug': category.slug,
        },
        'candidatures': {
            'total': category.candidatures.count(),
            'approved': category.candidatures.filter(status='approved').count(),
            'pending': category.candidatures.filter(status='pending').count(),
            'rejected': category.candidatures.filter(status='rejected').count(),
        },
        'votes': {
            'total': category.votes.filter(is_valid=True).count(),
        }
    }
    
    return Response(stats, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated, IsAdminUser])
def toggle_category_status_view(request, slug):
    """
    Vue pour activer/désactiver une catégorie
    """
    category = get_object_or_404(Category, slug=slug)
    category.is_active = not category.is_active
    category.save()
    
    status_text = "activée" if category.is_active else "désactivée"
    
    return Response({
        'message': f'Catégorie {status_text} avec succès',
        'is_active': category.is_active
    }, status=status.HTTP_200_OK)