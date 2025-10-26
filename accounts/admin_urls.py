"""
URLs pour l'administration des comptes
"""
from django.urls import path
from . import admin_views

urlpatterns = [
    # Gestion des utilisateurs
    path('users/', admin_views.AdminUsersView.as_view(), name='admin-users-list'),
    path('users/<int:user_id>/', admin_views.AdminUserDetailView.as_view(), name='admin-user-detail'),
    path('users/<int:pk>/candidate-profile/', admin_views.AdminUserCandidateProfileView.as_view(), name='admin-user-candidate-profile'),
    path('users/<int:user_id>/candidatures/', admin_views.AdminUserCandidaturesView.as_view(), name='admin-user-candidatures'),
    
    # Gestion des profils candidats
    path('candidate-profiles/', admin_views.AdminCandidateProfilesView.as_view(), name='admin-candidate-profiles-list'),
    path('candidate-profiles/<int:profile_id>/', admin_views.AdminCandidateProfileDetailView.as_view(), name='admin-candidate-profile-detail'),
    
    # Statistiques
    path('dashboard-stats/', admin_views.admin_dashboard_stats, name='admin-dashboard-stats'),
]
