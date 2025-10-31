"""
URLs pour l'administration des candidatures
"""
from django.urls import path
from . import admin_views

urlpatterns = [
    # Gestion des candidatures
    path('candidatures/', admin_views.AdminCandidaturesView.as_view(), name='admin-candidatures-list'),
    path('candidatures/create/', admin_views.AdminCandidaturesView.as_view(), name='admin-candidature-create'),
    path('candidatures/<int:candidature_id>/', admin_views.AdminCandidatureDetailView.as_view(), name='admin-candidature-detail'),
    path('candidatures/<int:candidature_id>/update/', admin_views.AdminCandidatureDetailView.as_view(), name='admin-candidature-update'),
    path('candidatures/<int:candidature_id>/delete/', admin_views.AdminCandidatureDetailView.as_view(), name='admin-candidature-delete'),
    path('candidatures/<int:candidature_id>/approve/', admin_views.AdminCandidatureApproveView.as_view(), name='admin-candidature-approve'),
    path('candidatures/<int:candidature_id>/reject/', admin_views.AdminCandidatureRejectView.as_view(), name='admin-candidature-reject'),
    
    # Gestion des fichiers de candidature
    path('candidatures/<int:candidature_id>/files/', admin_views.AdminCandidatureFilesView.as_view(), name='admin-candidature-files'),
    path('candidatures/<int:candidature_id>/files/<int:file_id>/', admin_views.AdminCandidatureFileDetailView.as_view(), name='admin-candidature-file-detail'),
    
    # Statistiques
    path('stats/', admin_views.admin_candidature_stats, name='admin-candidature-stats'),
]
