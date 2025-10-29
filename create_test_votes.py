#!/usr/bin/env python
"""
Script pour créer des votes de test pour les candidatures
"""
import os
import sys
import django

# Configuration Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from candidates.models import Candidature, Vote
from accounts.models import User

User = get_user_model()

def create_test_votes():
    """Créer des votes de test pour les candidatures approuvées"""
    
    # Récupérer les candidatures approuvées
    approved_candidatures = Candidature.objects.filter(status='approved')
    
    if not approved_candidatures.exists():
        print("Aucune candidature approuvée trouvée.")
        return
    
    # Créer des utilisateurs de test pour voter
    test_voters = []
    for i in range(1, 6):
        voter, created = User.objects.get_or_create(
            email=f'voter{i}@test.com',
            defaults={
                'username': f'voter{i}',
                'first_name': f'Votant{i}',
                'last_name': 'Test',
                'user_type': 'candidate'  # Les candidats peuvent voter
            }
        )
        test_voters.append(voter)
        if created:
            print(f"Créé votant: {voter.email}")
    
    # Ajouter des votes aléatoires
    import random
    
    for candidature in approved_candidatures:
        # Chaque candidature reçoit entre 0 et 5 votes
        num_votes = random.randint(0, 5)
        voters_for_this_candidature = random.sample(test_voters, min(num_votes, len(test_voters)))
        
        for voter in voters_for_this_candidature:
            vote, created = Vote.objects.get_or_create(
                candidature=candidature,
                voter=voter
            )
            if created:
                print(f"Vote ajouté: {voter.email} -> {candidature.category.name}")
    
    print(f"\nVotes créés pour {approved_candidatures.count()} candidatures approuvées")
    
    # Afficher les statistiques
    for candidature in approved_candidatures:
        vote_count = candidature.get_vote_count()
        ranking = candidature.get_ranking_in_category()
        print(f"{candidature.category.name}: {vote_count} votes, rang #{ranking}")

if __name__ == '__main__':
    create_test_votes()

