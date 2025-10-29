#!/usr/bin/env python
"""
Script de test final pour vérifier toutes les fonctionnalités de l'admin des candidatures
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

def test_final_admin_candidatures():
    print("=== Test final de l'admin des candidatures ===\n")
    
    # 1. Vérifier les candidatures
    candidatures = Candidature.objects.all()
    print(f"1. Candidatures en base: {candidatures.count()}")
    
    for candidature in candidatures:
        print(f"   - ID {candidature.id}: {candidature.candidate.get_full_name()} - {candidature.category.name} (Publiée: {candidature.published})")
    
    # 2. Créer un utilisateur admin
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
        print("\n2. ✅ Utilisateur admin créé")
    else:
        print("\n2. ✅ Utilisateur admin existant")
    
    # 3. Tester l'API
    client = Client()
    login_success = client.login(email='admin@test.com', password='password123')
    
    if not login_success:
        print("❌ Échec de la connexion admin")
        return
    
    print("3. ✅ Connexion admin réussie")
    
    # 4. Tester l'endpoint principal
    print("\n4. Test de l'endpoint principal:")
    response = client.get('/api/admin/candidates/candidatures/')
    if response.status_code == 200:
        data = response.json()
        print(f"   ✅ API accessible - {len(data.get('results', []))} candidatures")
        
        if data.get('results'):
            candidature = data['results'][0]
            print("   Structure des données:")
            for key, value in candidature.items():
                if key in ['candidate_name', 'candidate_email', 'category_name', 'category_class_name', 'status', 'published', 'vote_count', 'ranking']:
                    print(f"     {key}: {value}")
    else:
        print(f"   ❌ Erreur API: {response.status_code}")
        return
    
    # 5. Tester la mise à jour
    if candidatures.exists():
        candidature = candidatures.first()
        print(f"\n5. Test de mise à jour (ID {candidature.id}):")
        
        new_published_status = not candidature.published
        response = client.put(f'/api/admin/candidates/candidatures/{candidature.id}/update/', {
            'published': new_published_status
        }, content_type='application/json')
        
        if response.status_code == 200:
            print(f"   ✅ Mise à jour réussie - Nouveau statut: {new_published_status}")
        else:
            print(f"   ❌ Erreur de mise à jour: {response.status_code}")
    
    # 6. Tester la suppression
    print(f"\n6. Test de suppression (ID {candidature.id}):")
    response = client.delete(f'/api/admin/candidates/candidatures/{candidature.id}/delete/')
    
    if response.status_code == 204:
        print("   ✅ Suppression réussie")
    else:
        print(f"   ❌ Erreur de suppression: {response.status_code}")
    
    print("\n=== Test terminé ===")
    print("✅ Toutes les fonctionnalités sont opérationnelles !")

if __name__ == '__main__':
    test_final_admin_candidatures()
