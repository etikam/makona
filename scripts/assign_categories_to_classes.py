#!/usr/bin/env python
"""
Script pour assigner les catégories existantes aux classes
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

def assign_categories():
    """Assigner les catégories existantes aux classes"""
    
    # Récupérer les classes
    try:
        arts_class = CategoryClass.objects.get(name='Arts & Culture')
        innovation_class = CategoryClass.objects.get(name='Innovation & Technologie')
        sport_class = CategoryClass.objects.get(name='Sport & Fitness')
        education_class = CategoryClass.objects.get(name='Éducation & Formation')
        social_class = CategoryClass.objects.get(name='Social & Communautaire')
        environment_class = CategoryClass.objects.get(name='Environnement & Durabilité')
    except CategoryClass.DoesNotExist as e:
        print(f"❌ Classe non trouvée: {e}")
        return
    
    # Assigner les catégories existantes
    assignments = {
        'Arts & Culture': ['Musique', 'Danse', 'Art Visuel'],
        'Innovation & Technologie': ['Technologie', 'Innovation Numérique', 'Startup', 'Recherche'],
        'Sport & Fitness': ['Sport Individuel', 'Sport Collectif', 'Fitness', 'Sport Adapté'],
        'Éducation & Formation': ['Formation Professionnelle', 'Éducation Alternative', 'Mentorat'],
        'Social & Communautaire': ['Entrepreneuriat Social', 'Action Communautaire', 'Développement Local'],
        'Environnement & Durabilité': ['Écologie', 'Développement Durable', 'Conservation']
    }
    
    class_mapping = {
        'Arts & Culture': arts_class,
        'Innovation & Technologie': innovation_class,
        'Sport & Fitness': sport_class,
        'Éducation & Formation': education_class,
        'Social & Communautaire': social_class,
        'Environnement & Durabilité': environment_class
    }
    
    total_assigned = 0
    
    for class_name, category_names in assignments.items():
        category_class = class_mapping[class_name]
        print(f"\n📂 Classe: {class_name}")
        
        for category_name in category_names:
            try:
                category = Category.objects.get(name=category_name)
                if not category.category_class:
                    category.category_class = category_class
                    category.save()
                    print(f"  ✅ {category_name} assigné à {class_name}")
                    total_assigned += 1
                else:
                    print(f"  ℹ️  {category_name} déjà assigné à {category.category_class.name}")
            except Category.DoesNotExist:
                print(f"  ⚠️  Catégorie non trouvée: {category_name}")
    
    return total_assigned

def main():
    """Fonction principale"""
    print("🚀 Attribution des catégories aux classes...")
    print("=" * 50)
    
    # Assigner les catégories
    total_assigned = assign_categories()
    
    print("=" * 50)
    print(f"📊 Résumé:")
    print(f"   • {total_assigned} catégories assignées")
    print(f"   • {Category.objects.filter(category_class__isnull=False).count()} catégories avec classe")
    print(f"   • {Category.objects.filter(category_class__isnull=True).count()} catégories sans classe")
    
    print("\n✅ Attribution terminée avec succès!")

if __name__ == '__main__':
    main()
