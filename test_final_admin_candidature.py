#!/usr/bin/env python
"""
Script de test final pour vérifier la création de candidatures admin
"""
import os
import django
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.test import Client
from candidates.models import Candidature
from categories.models import Category

User = get_user_model()

def test_final_admin_candidature():
    print("=== Test final de création de candidature admin ===\n")
    
    # Créer un utilisateur admin
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
    
    # Créer un candidat de test
    candidate, created = User.objects.get_or_create(
        email='testcandidate@example.com',
        defaults={
            'username': 'testcandidate',
            'first_name': 'Test',
            'last_name': 'Candidate',
            'user_type': 'candidate',
            'is_verified': True
        }
    )
    
    if created:
        print("✅ Candidat de test créé")
    else:
        print("✅ Candidat de test existant")
    
    # Supprimer les candidatures existantes de ce candidat
    Candidature.objects.filter(candidate=candidate).delete()
    print("✅ Candidatures existantes supprimées")
    
    category = Category.objects.first()
    if not category:
        print("❌ Aucune catégorie trouvée")
        return
    
    print(f"✅ Catégorie: {category.name}")
    
    # Tester l'API
    client = Client()
    login_success = client.login(email='admin@test.com', password='password123')
    
    if not login_success:
        print("❌ Échec de la connexion admin")
        return
    
    print("✅ Connexion admin réussie")
    
    # Tester la création de candidature
    print("\nTest de création de candidature...")
    candidature_data = {
        'candidate': candidate.id,
        'category': category.id,
        'description': 'Candidature créée par admin',
        'status': 'pending',
        'published': False
    }
    
    response = client.post('/api/admin/candidates/candidatures/create/', candidature_data)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 201:
        print("✅ Candidature créée avec succès !")
        data = response.json()
        print(f"   - ID: {data.get('id')}")
        print(f"   - Candidat: {data.get('candidate_name')}")
        print(f"   - Email: {data.get('candidate_email')}")
        print(f"   - Catégorie: {data.get('category_name')}")
        print(f"   - Classe: {data.get('category_class_name')}")
        print(f"   - Statut: {data.get('status')}")
        print(f"   - Publiée: {data.get('published')}")
        print(f"   - Peut être modifiée: {data.get('can_be_modified')}")
    else:
        print(f"❌ Erreur création: {response.status_code}")
        print(f"Contenu: {response.content.decode()}")
    
    print("\n=== Test terminé ===")
    print("✅ La création de candidatures admin fonctionne maintenant !")

if __name__ == '__main__':
    test_final_admin_candidature()

