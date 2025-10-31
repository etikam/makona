"""
URLs pour l'app settings
"""
from django.urls import path
from . import views

urlpatterns = [
    # Endpoints publics
    path('public/', views.get_public_settings, name='settings-public'),
    path('carousel/images/', views.get_active_carousel_images, name='carousel-images-public'),
    path('team/', views.TeamMemberListView.as_view(), name='team-members-public'),
    path('hall-of-fame/', views.get_hall_of_fame, name='hall-of-fame-public'),
    
    # Endpoints admin
    path('admin/', views.admin_settings, name='settings-admin'),
    path('admin/countdown/', views.update_countdown_settings, name='settings-countdown'),
    path('admin/general/', views.update_general_settings, name='settings-general'),
    path('admin/carousel-settings/', views.update_carousel_settings, name='settings-carousel-settings'),
    path('admin/carousel/', views.HeroCarouselImageView.as_view(), name='carousel-admin'),
    path('admin/carousel/<int:pk>/', views.HeroCarouselImageDetailView.as_view(), name='carousel-detail'),
    path('admin/team/', views.TeamMemberAdminView.as_view(), name='team-members-admin'),
    path('admin/team/<int:pk>/', views.TeamMemberDetailView.as_view(), name='team-member-detail'),
    path('admin/hall-of-fame/', views.HallOfFameAdminView.as_view(), name='hall-of-fame-admin'),
    path('admin/hall-of-fame/<int:pk>/', views.HallOfFameDetailView.as_view(), name='hall-of-fame-detail'),
]


