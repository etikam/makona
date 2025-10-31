"""
URLs pour l'app accounts
"""
from django.urls import path
from . import views
from .cors_debug import cors_debug_view

app_name = 'accounts'

urlpatterns = [
    # Authentification
    path('register/', views.UserRegistrationView.as_view(), name='register'),
    path('login/', views.UserLoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    
    # OTP
    path('otp/request/', views.OTPRequestView.as_view(), name='otp_request'),
    path('otp/verify/', views.OTPVerifyView.as_view(), name='otp_verify'),
    
    # Profil utilisateur
    path('profile/', views.UserProfileView.as_view(), name='user_profile'),
    path('profile/candidate/', views.CandidateProfileView.as_view(), name='candidate_profile'),
    path('stats/', views.UserStatsView.as_view(), name='user_stats'),
    
    # Mot de passe
    path('password/change/', views.PasswordChangeView.as_view(), name='password_change'),
    
    # Device fingerprint
    path('device/fingerprint/', views.DeviceFingerprintView.as_view(), name='device_fingerprint'),
    
    # Debug CORS
    path('cors-debug/', cors_debug_view, name='cors_debug'),
]
