#!/usr/bin/env python
"""
Script de test pour vérifier les données des candidatures admin
"""
import os
import django
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from candidates.models import Candidature
from candidates.serializers import CandidatureAdminSerializer

def test_candidature_data():
    print("=== Test des données de candidatures admin ===\n")
    
    # Récupérer quelques candidatures
    candidatures = Candidature.objects.select_related(
        'candidate', 'category', 'category__category_class', 'reviewed_by'
    ).prefetch_related('files')[:3]
    
    if not candidatures.exists():
        print("❌ Aucune candidature trouvée")
        return
    
    print(f"✅ {candidatures.count()} candidature(s) trouvée(s)\n")
    
    for i, candidature in enumerate(candidatures, 1):
        print(f"--- Candidature {i} ---")
        print(f"ID: {candidature.id}")
        print(f"Candidat: {candidature.candidate}")
        print(f"Nom complet: {candidature.candidate.get_full_name() if candidature.candidate else 'N/A'}")
        print(f"Email: {candidature.candidate.email if candidature.candidate else 'N/A'}")
        print(f"Catégorie: {candidature.category}")
        print(f"Nom catégorie: {candidature.category.name if candidature.category else 'N/A'}")
        print(f"Classe catégorie: {candidature.category.category_class.name if candidature.category and candidature.category.category_class else 'N/A'}")
        print(f"Statut: {candidature.status}")
        print(f"Publiée: {candidature.published}")
        print(f"Description: {candidature.description[:50] if candidature.description else 'N/A'}...")
        print(f"Fichiers: {candidature.files.count()}")
        print(f"Votes: {candidature.get_vote_count()}")
        print(f"Rang: {candidature.get_ranking_in_category()}")
        print()
    
    # Tester le serializer
    print("=== Test du serializer ===\n")
    
    candidature = candidatures.first()
    serializer = CandidatureAdminSerializer(candidature)
    data = serializer.data
    
    print("Données sérialisées:")
    print(f"- candidate_name: {data.get('candidate_name', 'N/A')}")
    print(f"- candidate_email: {data.get('candidate_email', 'N/A')}")
    print(f"- category_name: {data.get('category_name', 'N/A')}")
    print(f"- category_class_name: {data.get('category_class_name', 'N/A')}")
    print(f"- status: {data.get('status', 'N/A')}")
    print(f"- published: {data.get('published', 'N/A')}")
    print(f"- vote_count: {data.get('vote_count', 'N/A')}")
    print(f"- ranking: {data.get('ranking', 'N/A')}")
    print(f"- files count: {len(data.get('files', []))}")

if __name__ == '__main__':
    test_candidature_data()
