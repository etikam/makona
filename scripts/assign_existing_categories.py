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

def assign_existing_categories():
    """Assigner les catégories existantes aux classes"""
    
    # Récupérer les classes
    try:
        arts_class = CategoryClass.objects.get(name='Arts & Culture')
    except CategoryClass.DoesNotExist:
        print("❌ Classe Arts & Culture non trouvée")
        return
    
    # Assigner les catégories existantes à Arts & Culture
    arts_categories = ['Art Visuel', 'Arts Visuels', 'Cinema & Video', 'Danse', 'Litterature', 'Musique', 'Photographie']
    
    total_assigned = 0
    
    print(f"📂 Classe: Arts & Culture")
    
    for category_name in arts_categories:
        try:
            category = Category.objects.get(name=category_name)
            if not category.category_class:
                category.category_class = arts_class
                category.save()
                print(f"  ✅ {category_name} assigné à Arts & Culture")
                total_assigned += 1
            else:
                print(f"  ℹ️  {category_name} déjà assigné à {category.category_class.name}")
        except Category.DoesNotExist:
            print(f"  ⚠️  Catégorie non trouvée: {category_name}")
    
    return total_assigned

def main():
    """Fonction principale"""
    print("🚀 Attribution des catégories existantes aux classes...")
    print("=" * 60)
    
    # Assigner les catégories
    total_assigned = assign_existing_categories()
    
    print("=" * 60)
    print(f"📊 Résumé:")
    print(f"   • {total_assigned} catégories assignées")
    print(f"   • {Category.objects.filter(category_class__isnull=False).count()} catégories avec classe")
    print(f"   • {Category.objects.filter(category_class__isnull=True).count()} catégories sans classe")
    
    print("\n✅ Attribution terminée avec succès!")

if __name__ == '__main__':
    main()
