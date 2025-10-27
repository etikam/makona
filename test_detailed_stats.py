#!/usr/bin/env python
"""
Script de test détaillé pour diagnostiquer l'erreur 500
"""
import os
import sys
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from accounts.models import CandidateProfile
from candidates.models import Candidature
from categories.models import Category

User = get_user_model()

def test_candidate_stats_detailed():
    """Test détaillé de la logique des statistiques candidat"""
    print("🧪 Test détaillé des statistiques candidat...")
    
    # Trouver un candidat de test
    candidate = User.objects.filter(user_type='candidate').first()
    if not candidate:
        print("❌ Aucun candidat trouvé pour les tests")
        return
    
    print(f"👤 Test avec le candidat : {candidate.get_full_name()}")
    
    try:
        # Test 1: Vérifier le profil candidat
        profile = candidate.candidate_profile
        print(f"✅ Profil candidat trouvé : {profile.id}")
        
        # Test 2: Vérifier les candidatures
        candidatures = Candidature.objects.filter(candidate=profile.user)
        print(f"✅ Candidatures trouvées : {candidatures.count()}")
        
        # Test 3: Vérifier les catégories actives
        categories = Category.objects.filter(is_active=True)
        print(f"✅ Catégories actives : {categories.count()}")
        
        # Test 4: Calculer les statistiques manuellement
        stats = {
            'total_candidatures': candidatures.count(),
            'pending_candidatures': candidatures.filter(status='pending').count(),
            'approved_candidatures': candidatures.filter(status='approved').count(),
            'rejected_candidatures': candidatures.filter(status='rejected').count(),
            'categories_available': categories.count(),
        }
        
        print("📊 Statistiques calculées :")
        for key, value in stats.items():
            print(f"  - {key}: {value}")
        
        # Test 5: Calcul de completion du profil
        fields = ['bio', 'facebook_url', 'instagram_url', 'youtube_url', 'website_url']
        completed_fields = sum(1 for field in fields if getattr(profile, field))
        completion = int((completed_fields / len(fields)) * 100)
        print(f"✅ Completion du profil : {completion}%")
        
        print("\n🎉 Tous les tests sont passés !")
        
    except CandidateProfile.DoesNotExist:
        print("❌ Profil candidat non trouvé")
    except Exception as e:
        print(f"❌ Erreur lors du test : {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_candidate_stats_detailed()
