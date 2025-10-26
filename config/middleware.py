"""
Middleware personnalisé pour désactiver CSRF sur les endpoints API
"""
from django.utils.deprecation import MiddlewareMixin


class DisableCSRFForAPI(MiddlewareMixin):
    """
    Désactive la vérification CSRF pour les endpoints API
    """
    
    def process_request(self, request):
        # Désactiver CSRF pour tous les endpoints API
        if request.path.startswith('/api/'):
            setattr(request, '_dont_enforce_csrf_checks', True)
