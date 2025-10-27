#!/usr/bin/env python
"""
Script simple pour charger des classes de catégories
"""
import os
import sys
import django

# Ajouter le répertoire du projet au path Python
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Configurer Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from categories.models import CategoryClass

def create_simple_classes():
    """Créer des classes de catégories simples"""
    
    classes_data = [
        {
            'name': 'Arts & Culture',
            'description': 'Catégories artistiques et culturelles incluant musique, danse, art visuel, littérature et théâtre',
            'order': 1
        },
        {
            'name': 'Innovation & Technologie',
            'description': 'Catégories liées à l\'innovation technologique, startups et recherche',
            'order': 2
        },
        {
            'name': 'Sport & Fitness',
            'description': 'Catégories sportives et de fitness pour tous les niveaux',
            'order': 3
        },
        {
            'name': 'Éducation & Formation',
            'description': 'Catégories éducatives et de formation professionnelle',
            'order': 4
        },
        {
            'name': 'Social & Communautaire',
            'description': 'Catégories liées aux initiatives sociales et communautaires',
            'order': 5
        },
        {
            'name': 'Environnement & Durabilité',
            'description': 'Catégories liées à l\'environnement et au développement durable',
            'order': 6
        }
    ]
    
    created_classes = []
    
    for class_data in classes_data:
        category_class, created = CategoryClass.objects.get_or_create(
            name=class_data['name'],
            defaults=class_data
        )
        
        if created:
            print(f"✅ Classe créée: {category_class.name}")
            created_classes.append(category_class)
        else:
            print(f"ℹ️  Classe existante: {category_class.name}")
            created_classes.append(category_class)
    
    return created_classes

def main():
    """Fonction principale"""
    print("🚀 Chargement des classes de catégories...")
    print("=" * 50)
    
    # Créer les classes
    classes = create_simple_classes()
    
    print("=" * 50)
    print(f"📊 Résumé:")
    print(f"   • {len(classes)} classes de catégories")
    print(f"   • {CategoryClass.objects.count()} classes au total")
    
    print("\n✅ Chargement terminé avec succès!")
    print("\n🎯 Vous pouvez maintenant:")
    print("   • Accéder au dashboard admin")
    print("   • Gérer les classes de catégories")
    print("   • Assigner des catégories existantes aux classes")

if __name__ == '__main__':
    main()
