#!/usr/bin/env python
"""
Script pour créer des classes de catégories de démonstration
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
    """Créer les classes de catégories de démonstration"""
    
    classes_data = [
        {
            'name': 'Social',
            'description': 'Catégories liées aux initiatives sociales et communautaires',
            'icon': 'Heart',
            'color_gradient': 'from-pink-500 to-rose-600',
            'order': 1
        },
        {
            'name': 'Culture',
            'description': 'Catégories artistiques et culturelles',
            'icon': 'Palette',
            'color_gradient': 'from-purple-500 to-indigo-600',
            'order': 2
        },
        {
            'name': 'Innovation',
            'description': 'Catégories technologiques et d\'innovation',
            'icon': 'Lightbulb',
            'color_gradient': 'from-blue-500 to-cyan-600',
            'order': 3
        },
        {
            'name': 'Sport',
            'description': 'Catégories sportives et de fitness',
            'icon': 'Trophy',
            'color_gradient': 'from-green-500 to-emerald-600',
            'order': 4
        },
        {
            'name': 'Éducation',
            'description': 'Catégories éducatives et de formation',
            'icon': 'BookOpen',
            'color_gradient': 'from-orange-500 to-yellow-600',
            'order': 5
        },
        {
            'name': 'Environnement',
            'description': 'Catégories liées à l\'environnement et au développement durable',
            'icon': 'Leaf',
            'color_gradient': 'from-green-600 to-teal-600',
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
            print(f"✅ Classe de catégorie créée: {category_class.name}")
            created_classes.append(category_class)
        else:
            print(f"ℹ️  Classe de catégorie existante: {category_class.name}")
            created_classes.append(category_class)
    
    return created_classes

def assign_categories_to_classes():
    """Assigner les catégories existantes aux classes"""
    
    # Récupérer les classes
    social_class = CategoryClass.objects.get(name='Social')
    culture_class = CategoryClass.objects.get(name='Culture')
    innovation_class = CategoryClass.objects.get(name='Innovation')
    sport_class = CategoryClass.objects.get(name='Sport')
    education_class = CategoryClass.objects.get(name='Éducation')
    environment_class = CategoryClass.objects.get(name='Environnement')
    
    # Assigner les catégories existantes
    assignments = {
        'Social': ['Entrepreneuriat Social', 'Action Communautaire', 'Développement Local'],
        'Culture': ['Musique', 'Danse', 'Art Visuel', 'Littérature', 'Théâtre'],
        'Innovation': ['Technologie', 'Innovation Numérique', 'Startup', 'Recherche'],
        'Sport': ['Sport Individuel', 'Sport Collectif', 'Fitness', 'Sport Adapté'],
        'Éducation': ['Formation Professionnelle', 'Éducation Alternative', 'Mentorat'],
        'Environnement': ['Écologie', 'Développement Durable', 'Conservation']
    }
    
    for class_name, category_names in assignments.items():
        category_class = CategoryClass.objects.get(name=class_name)
        
        for category_name in category_names:
            try:
                category = Category.objects.get(name=category_name)
                category.category_class = category_class
                category.save()
                print(f"✅ {category_name} assigné à {class_name}")
            except Category.DoesNotExist:
                print(f"⚠️  Catégorie non trouvée: {category_name}")

def main():
    """Fonction principale"""
    print("🚀 Création des classes de catégories...")
    
    # Créer les classes
    classes = create_category_classes()
    
    print(f"\n📊 {len(classes)} classes de catégories disponibles")
    
    # Assigner les catégories existantes
    print("\n🔗 Attribution des catégories aux classes...")
    assign_categories_to_classes()
    
    print("\n✅ Script terminé avec succès!")

if __name__ == '__main__':
    main()
