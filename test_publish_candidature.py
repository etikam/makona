#!/usr/bin/env python
"""
Script pour tester la publication d'une candidature
"""
import os
import sys
import django

# Configuration Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from candidates.models import Candidature

def test_publish_candidature():
    """Tester la publication d'une candidature"""
    
    # Récupérer une candidature en attente
    candidature = Candidature.objects.filter(status='pending').first()
    
    if not candidature:
        print("Aucune candidature en attente trouvée.")
        return
    
    print(f"Candidature trouvée: {candidature.category.name}")
    print(f"Statut: {candidature.status}")
    print(f"Publiée: {candidature.published}")
    print(f"Peut être modifiée: {candidature.can_be_modified()}")
    
    # Publier la candidature
    candidature.published = True
    candidature.save()
    
    print(f"\nAprès publication:")
    print(f"Publiée: {candidature.published}")
    print(f"Peut être modifiée: {candidature.can_be_modified()}")

if __name__ == '__main__':
    test_publish_candidature()

