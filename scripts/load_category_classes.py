#!/usr/bin/env python
"""
Script pour charger des classes de catégories dans la base de données
"""
import os
import sys
import django

# Ajouter le répertoire du projet au path Python
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Configurer Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from categories.models import CategoryClass, Category

def create_category_classes():
    """Créer des classes de catégories complètes avec des catégories associées"""
    
    classes_data = [
        {
            'name': 'Arts & Culture',
            'description': 'Catégories artistiques et culturelles incluant musique, danse, art visuel, littérature et théâtre',
            'icon': 'Palette',
            'color_gradient': 'from-purple-500 to-pink-600',
            'order': 1,
            'categories': [
                {
                    'name': 'Musique',
                    'description': 'Candidatures dans le domaine musical (chanteurs, musiciens, compositeurs)',
                    'icon': 'Music',
                    'color_gradient': 'from-purple-500 to-indigo-600',
                    'requires_photo': True,
                    'requires_video': True,
                    'requires_audio': True,
                    'requires_portfolio': False,
                    'requires_documents': False,
                    'max_video_duration': 300,
                    'max_audio_duration': 180
                },
                {
                    'name': 'Danse',
                    'description': 'Candidatures dans le domaine de la danse (danseurs, chorégraphes)',
                    'icon': 'Zap',
                    'color_gradient': 'from-pink-500 to-rose-600',
                    'requires_photo': True,
                    'requires_video': True,
                    'requires_audio': False,
                    'requires_portfolio': True,
                    'requires_documents': False,
                    'max_video_duration': 240
                },
                {
                    'name': 'Art Visuel',
                    'description': 'Candidatures dans les arts visuels (peintres, sculpteurs, photographes)',
                    'icon': 'Image',
                    'color_gradient': 'from-blue-500 to-cyan-600',
                    'requires_photo': True,
                    'requires_video': False,
                    'requires_audio': False,
                    'requires_portfolio': True,
                    'requires_documents': False
                },
                {
                    'name': 'Littérature',
                    'description': 'Candidatures dans le domaine littéraire (écrivains, poètes, romanciers)',
                    'icon': 'BookOpen',
                    'color_gradient': 'from-green-500 to-emerald-600',
                    'requires_photo': True,
                    'requires_video': False,
                    'requires_audio': False,
                    'requires_portfolio': True,
                    'requires_documents': True
                },
                {
                    'name': 'Théâtre',
                    'description': 'Candidatures dans le domaine théâtral (comédiens, metteurs en scène)',
                    'icon': 'Theater',
                    'color_gradient': 'from-orange-500 to-red-600',
                    'requires_photo': True,
                    'requires_video': True,
                    'requires_audio': False,
                    'requires_portfolio': True,
                    'requires_documents': False,
                    'max_video_duration': 300
                }
            ]
        },
        {
            'name': 'Innovation & Technologie',
            'description': 'Catégories liées à l\'innovation technologique, startups et recherche',
            'icon': 'Lightbulb',
            'color_gradient': 'from-blue-500 to-cyan-600',
            'order': 2,
            'categories': [
                {
                    'name': 'Innovation Numérique',
                    'description': 'Candidatures dans l\'innovation numérique et les nouvelles technologies',
                    'icon': 'Cpu',
                    'color_gradient': 'from-blue-500 to-indigo-600',
                    'requires_photo': True,
                    'requires_video': True,
                    'requires_audio': False,
                    'requires_portfolio': True,
                    'requires_documents': True,
                    'max_video_duration': 180
                },
                {
                    'name': 'Startup & Entrepreneuriat',
                    'description': 'Candidatures de startups et entrepreneurs innovants',
                    'icon': 'Rocket',
                    'color_gradient': 'from-green-500 to-teal-600',
                    'requires_photo': True,
                    'requires_video': True,
                    'requires_audio': False,
                    'requires_portfolio': True,
                    'requires_documents': True,
                    'max_video_duration': 240
                },
                {
                    'name': 'Recherche & Développement',
                    'description': 'Candidatures dans la recherche scientifique et le développement',
                    'icon': 'Microscope',
                    'color_gradient': 'from-purple-500 to-violet-600',
                    'requires_photo': True,
                    'requires_video': False,
                    'requires_audio': False,
                    'requires_portfolio': True,
                    'requires_documents': True
                }
            ]
        },
        {
            'name': 'Sport & Fitness',
            'description': 'Catégories sportives et de fitness pour tous les niveaux',
            'icon': 'Trophy',
            'color_gradient': 'from-green-500 to-emerald-600',
            'order': 3,
            'categories': [
                {
                    'name': 'Sport Individuel',
                    'description': 'Candidatures dans les sports individuels (athlétisme, natation, etc.)',
                    'icon': 'User',
                    'color_gradient': 'from-green-500 to-lime-600',
                    'requires_photo': True,
                    'requires_video': True,
                    'requires_audio': False,
                    'requires_portfolio': False,
                    'requires_documents': True,
                    'max_video_duration': 120
                },
                {
                    'name': 'Sport Collectif',
                    'description': 'Candidatures dans les sports collectifs (football, basketball, etc.)',
                    'icon': 'Users',
                    'color_gradient': 'from-blue-500 to-cyan-600',
                    'requires_photo': True,
                    'requires_video': True,
                    'requires_audio': False,
                    'requires_portfolio': False,
                    'requires_documents': True,
                    'max_video_duration': 180
                },
                {
                    'name': 'Fitness & Bien-être',
                    'description': 'Candidatures dans le fitness et le bien-être',
                    'icon': 'Heart',
                    'color_gradient': 'from-pink-500 to-rose-600',
                    'requires_photo': True,
                    'requires_video': True,
                    'requires_audio': False,
                    'requires_portfolio': True,
                    'requires_documents': False,
                    'max_video_duration': 150
                }
            ]
        },
        {
            'name': 'Éducation & Formation',
            'description': 'Catégories éducatives et de formation professionnelle',
            'icon': 'BookOpen',
            'color_gradient': 'from-orange-500 to-yellow-600',
            'order': 4,
            'categories': [
                {
                    'name': 'Formation Professionnelle',
                    'description': 'Candidatures dans la formation professionnelle et technique',
                    'icon': 'GraduationCap',
                    'color_gradient': 'from-orange-500 to-amber-600',
                    'requires_photo': True,
                    'requires_video': True,
                    'requires_audio': False,
                    'requires_portfolio': True,
                    'requires_documents': True,
                    'max_video_duration': 300
                },
                {
                    'name': 'Éducation Alternative',
                    'description': 'Candidatures dans l\'éducation alternative et innovante',
                    'icon': 'Lightbulb',
                    'color_gradient': 'from-yellow-500 to-orange-600',
                    'requires_photo': True,
                    'requires_video': True,
                    'requires_audio': False,
                    'requires_portfolio': True,
                    'requires_documents': True,
                    'max_video_duration': 240
                },
                {
                    'name': 'Mentorat & Coaching',
                    'description': 'Candidatures dans le mentorat et le coaching',
                    'icon': 'UserCheck',
                    'color_gradient': 'from-indigo-500 to-purple-600',
                    'requires_photo': True,
                    'requires_video': True,
                    'requires_audio': False,
                    'requires_portfolio': True,
                    'requires_documents': True,
                    'max_video_duration': 180
                }
            ]
        },
        {
            'name': 'Social & Communautaire',
            'description': 'Catégories liées aux initiatives sociales et communautaires',
            'icon': 'Heart',
            'color_gradient': 'from-pink-500 to-rose-600',
            'order': 5,
            'categories': [
                {
                    'name': 'Entrepreneuriat Social',
                    'description': 'Candidatures dans l\'entrepreneuriat social et l\'innovation sociale',
                    'icon': 'HandHeart',
                    'color_gradient': 'from-pink-500 to-red-600',
                    'requires_photo': True,
                    'requires_video': True,
                    'requires_audio': False,
                    'requires_portfolio': True,
                    'requires_documents': True,
                    'max_video_duration': 300
                },
                {
                    'name': 'Action Communautaire',
                    'description': 'Candidatures dans l\'action communautaire et le développement local',
                    'icon': 'Users',
                    'color_gradient': 'from-rose-500 to-pink-600',
                    'requires_photo': True,
                    'requires_video': True,
                    'requires_audio': False,
                    'requires_portfolio': True,
                    'requires_documents': True,
                    'max_video_duration': 240
                },
                {
                    'name': 'Développement Local',
                    'description': 'Candidatures dans le développement local et régional',
                    'icon': 'MapPin',
                    'color_gradient': 'from-emerald-500 to-green-600',
                    'requires_photo': True,
                    'requires_video': True,
                    'requires_audio': False,
                    'requires_portfolio': True,
                    'requires_documents': True,
                    'max_video_duration': 300
                }
            ]
        },
        {
            'name': 'Environnement & Durabilité',
            'description': 'Catégories liées à l\'environnement et au développement durable',
            'icon': 'Leaf',
            'color_gradient': 'from-green-600 to-teal-600',
            'order': 6,
            'categories': [
                {
                    'name': 'Écologie & Conservation',
                    'description': 'Candidatures dans l\'écologie et la conservation de la nature',
                    'icon': 'TreePine',
                    'color_gradient': 'from-green-600 to-emerald-600',
                    'requires_photo': True,
                    'requires_video': True,
                    'requires_audio': False,
                    'requires_portfolio': True,
                    'requires_documents': True,
                    'max_video_duration': 300
                },
                {
                    'name': 'Développement Durable',
                    'description': 'Candidatures dans le développement durable et les énergies renouvelables',
                    'icon': 'Recycle',
                    'color_gradient': 'from-teal-500 to-cyan-600',
                    'requires_photo': True,
                    'requires_video': True,
                    'requires_audio': False,
                    'requires_portfolio': True,
                    'requires_documents': True,
                    'max_video_duration': 240
                },
                {
                    'name': 'Innovation Verte',
                    'description': 'Candidatures dans l\'innovation verte et les technologies propres',
                    'icon': 'Wind',
                    'color_gradient': 'from-lime-500 to-green-600',
                    'requires_photo': True,
                    'requires_video': True,
                    'requires_audio': False,
                    'requires_portfolio': True,
                    'requires_documents': True,
                    'max_video_duration': 180
                }
            ]
        }
    ]
    
    created_classes = []
    total_categories = 0
    
    for class_data in classes_data:
        # Créer la classe de catégorie
        category_class, created = CategoryClass.objects.get_or_create(
            name=class_data['name'],
            defaults={
                'description': class_data['description'],
                'icon': class_data['icon'],
                'color_gradient': class_data['color_gradient'],
                'order': class_data['order'],
                'is_active': True
            }
        )
        
        if created:
            print(f"✅ Classe créée: {category_class.name}")
        else:
            print(f"ℹ️  Classe existante: {category_class.name}")
        
        created_classes.append(category_class)
        
        # Créer les catégories associées
        for cat_data in class_data['categories']:
            # Vérifier si la catégorie existe déjà
            try:
                category = Category.objects.get(name=cat_data['name'])
                # Mettre à jour la classe de catégorie si elle n'est pas définie
                if not category.category_class:
                    category.category_class = category_class
                    category.save()
                    print(f"  🔄 Catégorie mise à jour: {category.name}")
                else:
                    print(f"  ℹ️  Catégorie existante: {category.name}")
            except Category.DoesNotExist:
                # Créer une nouvelle catégorie
                category = Category.objects.create(
                    category_class=category_class,
                    name=cat_data['name'],
                    description=cat_data['description'],
                    icon=cat_data['icon'],
                    color_gradient=cat_data['color_gradient'],
                    is_active=True,
                    requires_photo=cat_data['requires_photo'],
                    requires_video=cat_data['requires_video'],
                    requires_audio=cat_data['requires_audio'],
                    requires_portfolio=cat_data['requires_portfolio'],
                    requires_documents=cat_data['requires_documents'],
                    max_video_duration=cat_data.get('max_video_duration'),
                    max_audio_duration=cat_data.get('max_audio_duration')
                )
                print(f"  ✅ Catégorie créée: {category.name}")
                total_categories += 1
    
    return created_classes, total_categories

def main():
    """Fonction principale"""
    print("🚀 Chargement des classes de catégories et catégories...")
    print("=" * 60)
    
    # Créer les classes et catégories
    classes, total_categories = create_category_classes()
    
    print("=" * 60)
    print(f"📊 Résumé:")
    print(f"   • {len(classes)} classes de catégories")
    print(f"   • {total_categories} nouvelles catégories créées")
    print(f"   • {Category.objects.count()} catégories au total")
    print(f"   • {CategoryClass.objects.count()} classes au total")
    
    print("\n✅ Chargement terminé avec succès!")
    print("\n🎯 Vous pouvez maintenant:")
    print("   • Accéder au dashboard admin")
    print("   • Gérer les classes de catégories")
    print("   • Créer des candidatures avec les nouvelles catégories")

if __name__ == '__main__':
    main()
