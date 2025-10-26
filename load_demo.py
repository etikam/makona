#!/usr/bin/env python
"""
Script simple pour charger les données de démonstration
"""

import os
import sys
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from categories.models import Category
from accounts.models import CandidateProfile
from candidates.models import Candidature

User = get_user_model()

def main():
    print("Chargement des donnees de demonstration...")
    print("=" * 50)
    
    # 1. Créer les catégories
    print("Creation des categories...")
    create_categories()
    
    # 2. Créer les utilisateurs de test
    print("\nCreation des utilisateurs de test...")
    create_test_users()
    
    # 3. Créer des candidatures d'exemple
    print("\nCreation des candidatures d'exemple...")
    create_sample_candidatures()
    
    print("\n" + "=" * 50)
    print("Configuration terminee avec succes!")
    print("\nComptes de test crees:")
    print("   Admin: admin@test.com / admin123")
    print("   Candidat: candidat@test.com / candidat123")

def create_categories():
    categories_data = [
        {
            'name': 'Musique',
            'slug': 'musique',
            'description': 'Categorie dediee aux artistes musicaux, chanteurs, compositeurs et musiciens.',
            'icon': '🎵',
            'color_gradient': 'from-purple-500 to-pink-500',
            'is_active': True,
            'requires_photo': True,
            'requires_video': True,
            'requires_audio': True,
            'requires_portfolio': False,
            'max_video_duration': 300,
        },
        {
            'name': 'Danse',
            'slug': 'danse',
            'description': 'Categorie pour les danseurs, choregraphes et troupes de danse.',
            'icon': '💃',
            'color_gradient': 'from-red-500 to-orange-500',
            'is_active': True,
            'requires_photo': True,
            'requires_video': True,
            'requires_audio': False,
            'requires_portfolio': True,
            'max_video_duration': 180,
        },
        {
            'name': 'Photographie',
            'slug': 'photographie',
            'description': 'Categorie pour les photographes professionnels et amateurs.',
            'icon': '📸',
            'color_gradient': 'from-yellow-500 to-amber-500',
            'is_active': True,
            'requires_photo': True,
            'requires_video': False,
            'requires_audio': False,
            'requires_portfolio': True,
            'max_video_duration': None,
        },
        {
            'name': 'Cinema & Video',
            'slug': 'cinema-video',
            'description': 'Categorie pour les realisateurs, acteurs, scenaristes et producteurs.',
            'icon': '🎬',
            'color_gradient': 'from-blue-500 to-indigo-500',
            'is_active': True,
            'requires_photo': True,
            'requires_video': True,
            'requires_audio': False,
            'requires_portfolio': True,
            'max_video_duration': 600,
        },
        {
            'name': 'Litterature',
            'slug': 'litterature',
            'description': 'Categorie pour les ecrivains, poetes, romanciers et auteurs.',
            'icon': '📚',
            'color_gradient': 'from-green-500 to-teal-500',
            'is_active': True,
            'requires_photo': True,
            'requires_video': False,
            'requires_audio': True,
            'requires_portfolio': True,
            'max_video_duration': None,
        },
        {
            'name': 'Arts Visuels',
            'slug': 'arts-visuels',
            'description': 'Categorie pour les peintres, sculpteurs, dessinateurs et artistes visuels.',
            'icon': '🎨',
            'color_gradient': 'from-pink-500 to-rose-500',
            'is_active': True,
            'requires_photo': True,
            'requires_video': True,
            'requires_audio': False,
            'requires_portfolio': True,
            'max_video_duration': 240,
        }
    ]
    
    for category_data in categories_data:
        category, created = Category.objects.get_or_create(
            slug=category_data['slug'],
            defaults=category_data
        )
        if created:
            print(f"   Creee: {category.name}")
        else:
            print(f"   Existe deja: {category.name}")

def create_test_users():
    # Admin
    admin, created = User.objects.get_or_create(
        email='admin@test.com',
        defaults={
            'username': 'admin',
            'first_name': 'Admin',
            'last_name': 'Test',
            'user_type': 'admin',
            'is_verified': True,
            'is_active': True,
        }
    )
    if created:
        admin.set_password('admin123')
        admin.save()
        print(f"   Admin cree: {admin.email}")
    else:
        print(f"   Admin existe deja: {admin.email}")
    
    # Candidats
    candidates_data = [
        {
            'email': 'candidat@test.com',
            'username': 'candidat',
            'first_name': 'Marie',
            'last_name': 'Dupont',
            'phone': '+224 123 456 789',
            'country': 'guinea',
            'user_type': 'candidate',
            'is_verified': True,
            'is_active': True,
            'bio': 'Chanteuse passionnee avec 5 ans d\'experience.',
            'facebook_url': 'https://facebook.com/marie.dupont',
            'instagram_url': 'https://instagram.com/marie_dupont',
        },
        {
            'email': 'candidat2@test.com',
            'username': 'candidat2',
            'first_name': 'Amadou',
            'last_name': 'Diallo',
            'phone': '+224 987 654 321',
            'country': 'guinea',
            'user_type': 'candidate',
            'is_verified': True,
            'is_active': True,
            'bio': 'Danseur professionnel specialise dans les danses traditionnelles.',
            'youtube_url': 'https://youtube.com/@amadou_diallo',
        }
    ]
    
    for candidate_data in candidates_data:
        # Extraire les données du profil
        profile_data = {
            'bio': candidate_data.pop('bio', ''),
            'facebook_url': candidate_data.pop('facebook_url', ''),
            'instagram_url': candidate_data.pop('instagram_url', ''),
            'youtube_url': candidate_data.pop('youtube_url', ''),
            'website_url': candidate_data.pop('website_url', ''),
        }
        
        user, created = User.objects.get_or_create(
            email=candidate_data['email'],
            defaults=candidate_data
        )
        
        if created:
            user.set_password('candidat123')
            user.save()
            
            # Créer le profil candidat
            CandidateProfile.objects.create(user=user, **profile_data)
            print(f"   Candidat cree: {user.email}")
        else:
            print(f"   Candidat existe deja: {user.email}")

def create_sample_candidatures():
    # Récupérer les candidats et catégories
    candidates = User.objects.filter(user_type='candidate', email__icontains='test')
    categories = Category.objects.filter(is_active=True)
    
    if not candidates.exists() or not categories.exists():
        print("   Pas assez de candidats ou categories pour creer des candidatures")
        return
    
    # Créer quelques candidatures
    candidatures_data = [
        {
            'candidate': candidates[0],
            'category': categories[0],  # Musique
            'status': 'pending',
        },
        {
            'candidate': candidates[0],
            'category': categories[1],  # Danse
            'status': 'approved',
        },
        {
            'candidate': candidates[1] if len(candidates) > 1 else candidates[0],
            'category': categories[1],  # Danse
            'status': 'pending',
        }
    ]
    
    for candidature_data in candidatures_data:
        # Vérifier qu'il n'y a pas déjà une candidature pour cette combinaison
        existing = Candidature.objects.filter(
            candidate=candidature_data['candidate'],
            category=candidature_data['category']
        ).exists()
        
        if not existing:
            candidature = Candidature.objects.create(**candidature_data)
            print(f"   Candidature creee: {candidature.candidate.get_full_name()} -> {candidature.category.name}")
        else:
            print(f"   Candidature existe deja: {candidature_data['candidate'].get_full_name()} -> {candidature_data['category'].name}")

if __name__ == '__main__':
    main()
