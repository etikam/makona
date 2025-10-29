"""
URLs pour l'app candidates
"""
from django.urls import path
from . import views

app_name = 'candidates'

urlpatterns = [
    # Vues publiques
    path('', views.CandidatureListView.as_view(), name='candidature_list'),
    path('<int:pk>/', views.CandidatureDetailView.as_view(), name='candidature_detail'),
    path('by-category/<slug:category_slug>/', views.CandidatureByCategoryView.as_view(), name='candidature_by_category'),
    
    # Vues utilisateur authentifié
    path('my-candidatures/', views.MyCandidaturesView.as_view(), name='my_candidatures'),
    path('my-candidatures/<int:pk>/', views.MyCandidatureDetailView.as_view(), name='my_candidature_detail'),
    path('my-candidatures/<int:pk>/update/', views.MyCandidatureUpdateView.as_view(), name='my_candidature_update'),
    
    # Vues admin
    path('admin/', views.AdminCandidatureListView.as_view(), name='admin_candidature_list'),
    path('admin/create/', views.AdminCandidatureCreateView.as_view(), name='admin_candidature_create'),
    path('admin/<int:pk>/', views.AdminCandidatureDetailView.as_view(), name='admin_candidature_detail'),
    path('admin/<int:pk>/update/', views.AdminCandidatureUpdateView.as_view(), name='admin_candidature_update'),
    path('admin/<int:pk>/delete/', views.AdminCandidatureDeleteView.as_view(), name='admin_candidature_delete'),
    path('admin/<int:candidature_id>/approve/', views.approve_candidature_view, name='admin_approve_candidature'),
    path('admin/<int:candidature_id>/reject/', views.reject_candidature_view, name='admin_reject_candidature'),
    path('admin/stats/', views.candidature_stats_view, name='admin_candidature_stats'),
]
