"""
Vues pour le profil candidat
"""
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.db.models import Count, Q
from .models import CandidateProfile
from .candidate_serializers import (
    CandidateDashboardSerializer, CandidateProfileUpdateSerializer,
    UserProfileUpdateSerializer, CandidatureCreateSerializer,
    PasswordChangeSerializer, CategorySerializer, CandidatureSerializer
)
from candidates.models import Candidature
from categories.models import Category, CategoryClass

User = get_user_model()


class CandidateDashboardView(APIView):
    """Vue pour le dashboard du candidat"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Récupérer les données du dashboard candidat"""
        if not request.user.is_candidate():
            return Response(
                {"detail": "Accès non autorisé"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            profile = request.user.candidate_profile
        except CandidateProfile.DoesNotExist:
            return Response(
                {"detail": "Profil candidat non trouvé"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = CandidateDashboardSerializer(profile)
        return Response(serializer.data)


class CandidateProfileUpdateView(APIView):
    """Vue pour mettre à jour le profil candidat"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Récupérer le profil candidat"""
        if not request.user.is_candidate():
            return Response(
                {"detail": "Accès non autorisé"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            profile = request.user.candidate_profile
            serializer = CandidateProfileUpdateSerializer(profile)
            return Response(serializer.data)
        except CandidateProfile.DoesNotExist:
            return Response(
                {"detail": "Profil candidat non trouvé"}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
    def put(self, request):
        """Mettre à jour le profil candidat"""
        if not request.user.is_candidate():
            return Response(
                {"detail": "Accès non autorisé"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            profile = request.user.candidate_profile
        except CandidateProfile.DoesNotExist:
            return Response(
                {"detail": "Profil candidat non trouvé"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = CandidateProfileUpdateSerializer(profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileUpdateView(APIView):
    """Vue pour mettre à jour les informations utilisateur"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Récupérer les informations utilisateur"""
        serializer = UserProfileUpdateSerializer(request.user)
        return Response(serializer.data)
    
    def put(self, request):
        """Mettre à jour les informations utilisateur"""
        serializer = UserProfileUpdateSerializer(request.user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CandidateCandidaturesView(APIView):
    """Vue pour gérer les candidatures du candidat"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Récupérer les candidatures du candidat"""
        if not request.user.is_candidate():
            return Response(
                {"detail": "Accès non autorisé"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            profile = request.user.candidate_profile
        except CandidateProfile.DoesNotExist:
            return Response(
                {"detail": "Profil candidat non trouvé"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        candidatures = Candidature.objects.filter(
            candidate=profile
        ).select_related('category', 'category__category_class').prefetch_related('files')
        
        serializer = CandidatureSerializer(candidatures, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        """Créer une nouvelle candidature"""
        if not request.user.is_candidate():
            return Response(
                {"detail": "Accès non autorisé"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            profile = request.user.candidate_profile
        except CandidateProfile.DoesNotExist:
            return Response(
                {"detail": "Profil candidat non trouvé"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = CandidatureCreateSerializer(
            data=request.data, 
            context={'request': request}
        )
        if serializer.is_valid():
            candidature = serializer.save(candidate=profile)
            return Response(
                CandidatureCreateSerializer(candidature).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CandidateCategoriesView(APIView):
    """Vue pour récupérer les catégories disponibles"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Récupérer les catégories actives"""
        if not request.user.is_candidate():
            return Response(
                {"detail": "Accès non autorisé"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        categories = Category.objects.filter(
            is_active=True
        ).select_related('category_class').order_by('category_class__order', 'name')
        
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)


class PasswordChangeView(APIView):
    """Vue pour changer le mot de passe"""
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        """Changer le mot de passe"""
        serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({"detail": "Mot de passe modifié avec succès"})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CandidateStatsView(APIView):
    """Vue pour les statistiques du candidat"""
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Récupérer les statistiques du candidat"""
        if not request.user.is_candidate():
            return Response(
                {"detail": "Accès non autorisé"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            profile = request.user.candidate_profile
        except CandidateProfile.DoesNotExist:
            return Response(
                {"detail": "Profil candidat non trouvé"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        candidatures = Candidature.objects.filter(candidate=profile.user)
        
        stats = {
            'total_candidatures': candidatures.count(),
            'pending_candidatures': candidatures.filter(status='pending').count(),
            'approved_candidatures': candidatures.filter(status='approved').count(),
            'rejected_candidatures': candidatures.filter(status='rejected').count(),
            'categories_available': Category.objects.filter(is_active=True).count(),
            'profile_completion': self._calculate_profile_completion(profile)
        }
        
        return Response(stats)
    
    def _calculate_profile_completion(self, profile):
        """Calculer le pourcentage de completion du profil"""
        if not profile:
            return 0
        
        fields = ['bio', 'facebook_url', 'instagram_url', 'youtube_url', 'website_url']
        completed_fields = sum(1 for field in fields if getattr(profile, field))
        return int((completed_fields / len(fields)) * 100)
