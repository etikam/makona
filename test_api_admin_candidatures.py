#!/usr/bin/env python
"""
Script de test pour l'API admin des candidatures
"""
import os
import django
import requests
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.test import Client
from django.contrib.auth import authenticate

User = get_user_model()

def test_api_admin_candidatures():
    print("=== Test de l'API admin des candidatures ===\n")
    
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
    
    try:
        response = client.get('/api/admin/candidates/candidatures/')
        print(f"\nStatus Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ API fonctionne correctement")
            print(f"Nombre de candidatures: {len(data.get('results', []))}")
            
            if data.get('results'):
                candidature = data['results'][0]
                print("\nPremière candidature:")
                print(f"- ID: {candidature.get('id')}")
                print(f"- Candidat: {candidature.get('candidate_name', 'N/A')}")
                print(f"- Email: {candidature.get('candidate_email', 'N/A')}")
                print(f"- Catégorie: {candidature.get('category_name', 'N/A')}")
                print(f"- Classe: {candidature.get('category_class_name', 'N/A')}")
                print(f"- Statut: {candidature.get('status', 'N/A')}")
                print(f"- Publiée: {candidature.get('published', 'N/A')}")
                print(f"- Votes: {candidature.get('vote_count', 'N/A')}")
                print(f"- Rang: {candidature.get('ranking', 'N/A')}")
        else:
            print(f"❌ Erreur API: {response.content.decode()}")
            
    except Exception as e:
        print(f"❌ Erreur de connexion: {e}")

if __name__ == '__main__':
    test_api_admin_candidatures()
