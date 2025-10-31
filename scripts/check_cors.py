#!/usr/bin/env python
"""
Script de diagnostic CORS pour vérifier la configuration
Exécuter dans le conteneur backend: python scripts/check_cors.py
"""
import os
import django

# Configurer Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.conf import settings

print("=" * 60)
print("DIAGNOSTIC CORS - Configuration Django")
print("=" * 60)

print("\n1. Variables d'environnement:")
print(f"   FRONTEND_DOMAIN: {os.environ.get('FRONTEND_DOMAIN', 'NON DÉFINI')}")
print(f"   API_DOMAIN: {os.environ.get('API_DOMAIN', 'NON DÉFINI')}")
print(f"   CORS_ALLOWED_ORIGINS: {os.environ.get('CORS_ALLOWED_ORIGINS', 'NON DÉFINI')}")
print(f"   ALLOWED_HOSTS: {os.environ.get('ALLOWED_HOSTS', 'NON DÉFINI')}")

print("\n2. Configuration Django CORS:")
print(f"   CORS_ALLOWED_ORIGINS: {list(settings.CORS_ALLOWED_ORIGINS)}")
print(f"   CORS_ALLOW_CREDENTIALS: {settings.CORS_ALLOW_CREDENTIALS}")
print(f"   CORS_ALLOW_HEADERS: {settings.CORS_ALLOW_HEADERS}")
print(f"   CORS_ALLOW_METHODS: {settings.CORS_ALLOW_METHODS}")
print(f"   CORS_PREFLIGHT_MAX_AGE: {settings.CORS_PREFLIGHT_MAX_AGE}")

print("\n3. Configuration CSRF:")
print(f"   CSRF_TRUSTED_ORIGINS: {list(settings.CSRF_TRUSTED_ORIGINS)}")

print("\n4. Configuration Django:")
print(f"   ALLOWED_HOSTS: {list(settings.ALLOWED_HOSTS)}")
print(f"   DEBUG: {settings.DEBUG}")

print("\n5. Middleware:")
print(f"   Premier middleware: {settings.MIDDLEWARE[0] if settings.MIDDLEWARE else 'AUCUN'}")

# Vérifier si corsheaders est bien installé
try:
    import corsheaders
    print(f"   corsheaders installé: OUI (version: {corsheaders.__version__ if hasattr(corsheaders, '__version__') else 'inconnue'})")
except ImportError:
    print("   corsheaders installé: NON ❌")

# Vérifier que CORS middleware est en première position
if settings.MIDDLEWARE and 'corsheaders.middleware.CorsMiddleware' in settings.MIDDLEWARE:
    cors_index = settings.MIDDLEWARE.index('corsheaders.middleware.CorsMiddleware')
    print(f"   CORS middleware position: {cors_index} (devrait être 0) {'✅' if cors_index == 0 else '❌'}")
else:
    print("   CORS middleware: NON TROUVÉ ❌")

print("\n6. Origines attendues pour CORS:")
print(f"   Frontend: https://makona-awards.n-it.org")
print(f"   Configuration actuelle contient cette origine: {'✅' if 'https://makona-awards.n-it.org' in list(settings.CORS_ALLOWED_ORIGINS) else '❌'}")

print("\n" + "=" * 60)

