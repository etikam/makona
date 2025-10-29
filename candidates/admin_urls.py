"""
URLs pour l'administration des candidatures
"""
from django.urls import path
from . import views

urlpatterns = [
    # Gestion des candidatures
    path('candidatures/', views.AdminCandidatureListView.as_view(), name='admin-candidatures-list'),
    path('candidatures/create/', views.AdminCandidatureCreateView.as_view(), name='admin-candidature-create'),
    path('candidatures/<int:pk>/', views.AdminCandidatureDetailView.as_view(), name='admin-candidature-detail'),
    path('candidatures/<int:pk>/update/', views.AdminCandidatureUpdateView.as_view(), name='admin-candidature-update'),
    path('candidatures/<int:pk>/delete/', views.AdminCandidatureDeleteView.as_view(), name='admin-candidature-delete'),
    path('candidatures/<int:candidature_id>/approve/', views.approve_candidature_view, name='admin-candidature-approve'),
    path('candidatures/<int:candidature_id>/reject/', views.reject_candidature_view, name='admin-candidature-reject'),
    
    # Statistiques
    path('stats/', views.candidature_stats_view, name='admin-candidature-stats'),
]
