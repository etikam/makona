#!/usr/bin/env python
"""
Script pour créer une candidature de test
"""
import os
import sys
import django

# Configuration Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from candidates.models import Candidature
from categories.models import Category

User = get_user_model()

def create_test_candidature():
    """Créer une candidature de test"""
    
    # Récupérer un candidat
    candidate = User.objects.filter(user_type='candidate').first()
    if not candidate:
        print("Aucun candidat trouvé.")
        return
    
    # Récupérer une catégorie
    category = Category.objects.filter(is_active=True).first()
    if not category:
        print("Aucune catégorie active trouvée.")
        return
    
    # Créer une candidature
    candidature, created = Candidature.objects.get_or_create(
        candidate=candidate,
        category=category,
        defaults={
            'description': 'Candidature de test pour la modification',
            'status': 'pending',
            'published': False
        }
    )
    
    if created:
        print(f"Candidature créée: {candidature.category.name}")
    else:
        print(f"Candidature existante: {candidature.category.name}")
    
    print(f"Statut: {candidature.status}")
    print(f"Publiée: {candidature.published}")
    print(f"Peut être modifiée: {candidature.can_be_modified()}")

if __name__ == '__main__':
    create_test_candidature()

