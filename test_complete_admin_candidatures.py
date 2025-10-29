#!/usr/bin/env python
"""
Script de test complet pour vérifier le fonctionnement de l'admin des candidatures
"""
import os
import django
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.test import Client
from candidates.models import Candidature
from candidates.serializers import CandidatureAdminSerializer

User = get_user_model()

def test_complete_admin_candidatures():
    print("=== Test complet de l'admin des candidatures ===\n")
    
    # 1. Vérifier les candidatures en base
    print("1. Vérification des candidatures en base:")
    candidatures = Candidature.objects.all()
    print(f"   Total candidatures: {candidatures.count()}")
    
    for candidature in candidatures:
        print(f"   - ID {candidature.id}: {candidature.candidate.get_full_name()} - {candidature.category.name}")
    
    # 2. Tester le serializer
    print("\n2. Test du serializer:")
    if candidatures.exists():
        candidature = candidatures.first()
        serializer = CandidatureAdminSerializer(candidature)
        data = serializer.data
        
        print(f"   Candidat: {data.get('candidate_name', 'N/A')}")
        print(f"   Email: {data.get('candidate_email', 'N/A')}")
        print(f"   Catégorie: {data.get('category_name', 'N/A')}")
        print(f"   Classe: {data.get('category_class_name', 'N/A')}")
        print(f"   Statut: {data.get('status', 'N/A')}")
        print(f"   Publiée: {data.get('published', 'N/A')}")
        print(f"   Votes: {data.get('vote_count', 'N/A')}")
        print(f"   Rang: {data.get('ranking', 'N/A')}")
    
    # 3. Tester l'API
    print("\n3. Test de l'API:")
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
    
    client = Client()
    login_success = client.login(email='admin@test.com', password='password123')
    
    if login_success:
        print("   ✅ Connexion admin réussie")
        
        # Test de l'endpoint principal
        response = client.get('/api/admin/candidates/candidatures/')
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ API accessible - {len(data.get('results', []))} candidatures")
            
            # Vérifier la structure des données
            if data.get('results'):
                candidature = data['results'][0]
                print("   Structure des données:")
                for key, value in candidature.items():
                    if key in ['candidate_name', 'candidate_email', 'category_name', 'category_class_name', 'status', 'published']:
                        print(f"     {key}: {value}")
        else:
            print(f"   ❌ Erreur API: {response.status_code}")
    else:
        print("   ❌ Échec de la connexion admin")
    
    # 4. Vérifier les permissions
    print("\n4. Test des permissions:")
    from accounts.permissions import IsAdminUser
    permission = IsAdminUser()
    
    if permission.has_permission(None, admin_user):
        print("   ✅ L'utilisateur admin a les bonnes permissions")
    else:
        print("   ❌ L'utilisateur admin n'a pas les bonnes permissions")
    
    print("\n=== Test terminé ===")

if __name__ == '__main__':
    test_complete_admin_candidatures()
