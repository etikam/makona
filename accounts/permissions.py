"""
Permissions personnalisées pour l'app accounts
"""
from rest_framework import permissions


class IsAdminUser(permissions.BasePermission):
    """
    Permission pour les administrateurs uniquement
    """
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.is_admin()
        )


class IsCandidateUser(permissions.BasePermission):
    """
    Permission pour les candidats uniquement
    """
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.is_candidate()
        )


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Permission pour le propriétaire de l'objet ou un admin
    """
    def has_object_permission(self, request, view, obj):
        # Les admins peuvent tout faire
        if request.user.is_admin():
            return True
        
        # Le propriétaire peut modifier ses propres données
        if hasattr(obj, 'user'):
            return obj.user == request.user
        elif hasattr(obj, 'id'):
            return obj.id == request.user.id
        
        return False


class IsVerifiedUser(permissions.BasePermission):
    """
    Permission pour les utilisateurs vérifiés uniquement
    """
    def has_permission(self, request, view):
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.is_verified
        )


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Permission en lecture seule pour tous, écriture pour les admins
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return (
            request.user and 
            request.user.is_authenticated and 
            request.user.is_admin()
        )


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Permission en lecture seule pour tous, écriture pour le propriétaire
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Les admins peuvent tout faire
        if request.user.is_admin():
            return True
        
        # Le propriétaire peut modifier ses propres données
        if hasattr(obj, 'user'):
            return obj.user == request.user
        elif hasattr(obj, 'id'):
            return obj.id == request.user.id
        
        return False


class IsPublicOrAuthenticated(permissions.BasePermission):
    """
    Permission publique ou authentifiée selon la méthode
    """
    def has_permission(self, request, view):
        # Méthodes publiques
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True
        
        # Méthodes nécessitant une authentification
        return request.user and request.user.is_authenticated
