"""
URLs pour l'app categories
"""
from django.urls import path
from . import views

app_name = 'categories'

urlpatterns = [
    # Vues admin (doivent être avant les vues publiques pour éviter les conflits)
    path('admin/', views.CategoryAdminListView.as_view(), name='admin_category_list'),
    path('admin/<int:id>/', views.CategoryAdminDetailView.as_view(), name='admin_category_detail'),
    path('admin/<slug:slug>/toggle/', views.toggle_category_status_view, name='admin_category_toggle'),
    
    # Vues publiques
    path('', views.CategoryListView.as_view(), name='category_list'),
    path('<slug:slug>/', views.CategoryDetailView.as_view(), name='category_detail'),
    path('<slug:slug>/stats/', views.category_stats_view, name='category_stats'),
]
