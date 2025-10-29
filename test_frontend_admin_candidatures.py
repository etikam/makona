#!/usr/bin/env python
"""
Script de test pour vérifier que le frontend peut accéder à l'API admin
"""
import os
import django
import requests
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.test import Client

User = get_user_model()

def test_frontend_api_access():
    print("=== Test d'accès API pour le frontend ===\n")
    
    # Créer ou récupérer un utilisateur admin
    admin_user, created = User.objects.get_or_create(
        email='admin@test.com',
        defaults={
            'username': 'admin',
            'first_name': 'Admin',
            'last_name': 'Test',
            'user_type': 'admin',
            'is_staff': True,
            'is_superuser': True,
            'is_verified': True
        }
    )
    
    if created:
        admin_user.set_password('password123')
        admin_user.save()
        print("✅ Utilisateur admin créé")
    else:
        print("✅ Utilisateur admin existant")
    
    # Utiliser le client de test Django
    client = Client()
    
    # Se connecter
    login_success = client.login(email='admin@test.com', password='password123')
    if not login_success:
        print("❌ Échec de la connexion")
        return
    
    print("✅ Connexion réussie")
    
    # Tester l'endpoint exact utilisé par le frontend
    try:
        response = client.get('/api/admin/candidates/candidatures/')
        print(f"\nStatus Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ API accessible depuis le frontend")
            print(f"Structure de la réponse:")
            print(f"- count: {data.get('count', 'N/A')}")
            print(f"- next: {data.get('next', 'N/A')}")
            print(f"- previous: {data.get('previous', 'N/A')}")
            print(f"- results: {len(data.get('results', []))} candidatures")
            
            if data.get('results'):
                candidature = data['results'][0]
                print(f"\nStructure d'une candidature:")
                for key, value in candidature.items():
                    print(f"  {key}: {value}")
        else:
            print(f"❌ Erreur API: {response.content.decode()}")
            
    except Exception as e:
        print(f"❌ Erreur de connexion: {e}")

if __name__ == '__main__':
    test_frontend_api_access()
