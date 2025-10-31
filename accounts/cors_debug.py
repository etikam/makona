"""
Endpoint de diagnostic CORS pour débugger les problèmes CORS
"""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status, permissions
from django.conf import settings
from django.http import JsonResponse


@api_view(['GET', 'OPTIONS'])
@permission_classes([permissions.AllowAny])
def cors_debug_view(request):
    """
    Endpoint de diagnostic CORS pour vérifier la configuration
    """
    data = {
        'method': request.method,
        'origin': request.META.get('HTTP_ORIGIN', 'Not provided'),
        'cors_allowed_origins': list(getattr(settings, 'CORS_ALLOWED_ORIGINS', [])),
        'cors_allow_credentials': getattr(settings, 'CORS_ALLOW_CREDENTIALS', False),
        'cors_allow_headers': getattr(settings, 'CORS_ALLOW_HEADERS', []),
        'cors_allow_methods': getattr(settings, 'CORS_ALLOW_METHODS', []),
        'frontend_domain': getattr(settings, 'FRONTEND_DOMAIN', None),
        'allowed_hosts': getattr(settings, 'ALLOWED_HOSTS', []),
        'headers_received': {
            key: value for key, value in request.META.items() 
            if key.startswith('HTTP_')
        }
    }
    
    return Response(data, status=status.HTTP_200_OK)

