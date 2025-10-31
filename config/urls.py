"""
URL configuration for config project.
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.views.generic.base import RedirectView
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

urlpatterns = [
    # Admin
    path("admin/", admin.site.urls),
    # Root - redirige vers la documentation API
    path("", RedirectView.as_view(url="/api/docs/", permanent=False)),
    
    # API Documentation
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
    # API Health/Root
    path("api/", lambda request: JsonResponse({"status": "ok"})),
    
    # API Endpoints
    path("api/auth/", include("accounts.urls")),
    path("api/categories/", include("categories.urls")),
    path("api/candidatures/", include("candidates.urls")),
    
    # Candidate API Endpoints
    path("api/candidate/", include("accounts.candidate_urls")),
    
    # Admin API Endpoints
    path("api/admin/accounts/", include("accounts.admin_urls")),
    path("api/admin/candidates/", include("candidates.admin_urls")),
    
    # Settings API Endpoints
    path("api/settings/", include("settings.urls")),
]

# Servir les fichiers média en développement et production
# En production, les médias sont servis par Django via Traefik
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Servir les fichiers statiques uniquement en développement
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
