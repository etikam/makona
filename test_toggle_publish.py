#!/usr/bin/env python
"""
Script de test pour vérifier le toggle de publication des candidatures
"""
import os
import django
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from django.test import Client
from candidates.models import Candidature

User = get_user_model()

def test_toggle_publish():
    print("=== Test du toggle de publication ===\n")
    
    # Récupérer une candidature
    candidature = Candidature.objects.first()
    if not candidature:
        print("❌ Aucune candidature trouvée")
        return
    
    print(f"Candidature ID {candidature.id}:")
    print(f"  - Candidat: {candidature.candidate.get_full_name()}")
    print(f"  - Catégorie: {candidature.category.name}")
    print(f"  - Statut: {candidature.status}")
    print(f"  - Publiée: {candidature.published}")
    
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
    
    # Tester l'API de mise à jour
    client = Client()
    login_success = client.login(email='admin@test.com', password='password123')
    
    if not login_success:
        print("❌ Échec de la connexion admin")
        return
    
    print("\n✅ Connexion admin réussie")
    
    # Tester la mise à jour de publication
    new_published_status = not candidature.published
    print(f"\nTest de {'publication' if new_published_status else 'dépublication'}:")
    
    response = client.put(f'/api/admin/candidates/candidatures/{candidature.id}/update/', {
        'published': new_published_status
    }, content_type='application/json')
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print("✅ Mise à jour réussie")
        print(f"  - Nouveau statut publiée: {data.get('published')}")
        
        # Vérifier en base
        candidature.refresh_from_db()
        print(f"  - Statut en base: {candidature.published}")
        
        if candidature.published == new_published_status:
            print("✅ Le statut a été correctement mis à jour en base")
        else:
            print("❌ Le statut n'a pas été mis à jour en base")
    else:
        print(f"❌ Erreur API: {response.content.decode()}")
    
    print("\n=== Test terminé ===")

if __name__ == '__main__':
    test_toggle_publish()

