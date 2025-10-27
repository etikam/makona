"""
URLs pour le profil candidat
"""
from django.urls import path
from .candidate_views import (
    CandidateDashboardView, CandidateProfileUpdateView,
    UserProfileUpdateView, CandidateCandidaturesView,
    CandidateCategoriesView, PasswordChangeView, CandidateStatsView
)

urlpatterns = [
    # Dashboard candidat
    path('dashboard/', CandidateDashboardView.as_view(), name='candidate-dashboard'),
    
    # Profil candidat
    path('profile/', CandidateProfileUpdateView.as_view(), name='candidate-profile'),
    
    # Informations utilisateur
    path('user-profile/', UserProfileUpdateView.as_view(), name='candidate-user-profile'),
    
    # Candidatures
    path('candidatures/', CandidateCandidaturesView.as_view(), name='candidate-candidatures'),
    
    # Catégories disponibles
    path('categories/', CandidateCategoriesView.as_view(), name='candidate-categories'),
    
    # Changement de mot de passe
    path('change-password/', PasswordChangeView.as_view(), name='candidate-change-password'),
    
    # Statistiques
    path('stats/', CandidateStatsView.as_view(), name='candidate-stats'),
]

