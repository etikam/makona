"""
Commande Django pour créer des catégories
Usage: python manage.py create_categories
"""

from django.core.management.base import BaseCommand
from categories.models import Category


class Command(BaseCommand):
    help = 'Créer des catégories d\'exemple dans la base de données'

    def add_arguments(self, parser):
        parser.add_argument(
            '--reset',
            action='store_true',
            help='Supprimer toutes les catégories existantes avant de créer les nouvelles',
        )
        parser.add_argument(
            '--count',
            type=int,
            default=12,
            help='Nombre de catégories à créer (défaut: 12)',
        )

    def handle(self, *args, **options):
        if options['reset']:
            self.stdout.write(
                self.style.WARNING('🗑️  Suppression des catégories existantes...')
            )
            Category.objects.all().delete()
            self.stdout.write(
                self.style.SUCCESS('✅ Toutes les catégories ont été supprimées')
            )

        categories_data = [
            {
                'name': 'Musique',
                'slug': 'musique',
                'description': 'Catégorie dédiée aux artistes musicaux, chanteurs, compositeurs et musiciens.',
                'icon': '🎵',
                'color_gradient': 'from-purple-500 to-pink-500',
                'is_active': True,
                'requires_photo': True,
                'requires_video': True,
                'requires_audio': True,
                'requires_portfolio': False,
                'max_video_duration': 300,  # 5 minutes
            },
            {
                'name': 'Danse',
                'slug': 'danse',
                'description': 'Catégorie pour les danseurs, chorégraphes et troupes de danse.',
                'icon': '💃',
                'color_gradient': 'from-red-500 to-orange-500',
                'is_active': True,
                'requires_photo': True,
                'requires_video': True,
                'requires_audio': False,
                'requires_portfolio': True,
                'max_video_duration': 180,  # 3 minutes
            },
            {
                'name': 'Cinéma & Vidéo',
                'slug': 'cinema-video',
                'description': 'Catégorie pour les réalisateurs, acteurs, scénaristes et producteurs.',
                'icon': '🎬',
                'color_gradient': 'from-blue-500 to-indigo-500',
                'is_active': True,
                'requires_photo': True,
                'requires_video': True,
                'requires_audio': False,
                'requires_portfolio': True,
                'max_video_duration': 600,  # 10 minutes
            },
            {
                'name': 'Photographie',
                'slug': 'photographie',
                'description': 'Catégorie pour les photographes professionnels et amateurs.',
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
                'name': 'Littérature',
                'slug': 'litterature',
                'description': 'Catégorie pour les écrivains, poètes, romanciers et auteurs.',
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
                'description': 'Catégorie pour les peintres, sculpteurs, dessinateurs et artistes visuels.',
                'icon': '🎨',
                'color_gradient': 'from-pink-500 to-rose-500',
                'is_active': True,
                'requires_photo': True,
                'requires_video': True,
                'requires_audio': False,
                'requires_portfolio': True,
                'max_video_duration': 240,  # 4 minutes
            },
            {
                'name': 'Théâtre',
                'slug': 'theatre',
                'description': 'Catégorie pour les comédiens, metteurs en scène et troupes théâtrales.',
                'icon': '🎭',
                'color_gradient': 'from-indigo-500 to-purple-500',
                'is_active': True,
                'requires_photo': True,
                'requires_video': True,
                'requires_audio': False,
                'requires_portfolio': True,
                'max_video_duration': 300,  # 5 minutes
            },
            {
                'name': 'Mode & Design',
                'slug': 'mode-design',
                'description': 'Catégorie pour les stylistes, designers et créateurs de mode.',
                'icon': '👗',
                'color_gradient': 'from-rose-500 to-pink-500',
                'is_active': True,
                'requires_photo': True,
                'requires_video': True,
                'requires_audio': False,
                'requires_portfolio': True,
                'max_video_duration': 180,  # 3 minutes
            },
            {
                'name': 'Cuisine',
                'slug': 'cuisine',
                'description': 'Catégorie pour les chefs cuisiniers, pâtissiers et créateurs culinaires.',
                'icon': '👨‍🍳',
                'color_gradient': 'from-orange-500 to-red-500',
                'is_active': True,
                'requires_photo': True,
                'requires_video': True,
                'requires_audio': False,
                'requires_portfolio': False,
                'max_video_duration': 300,  # 5 minutes
            },
            {
                'name': 'Sport & Fitness',
                'slug': 'sport-fitness',
                'description': 'Catégorie pour les athlètes, coachs sportifs et influenceurs fitness.',
                'icon': '🏃‍♂️',
                'color_gradient': 'from-emerald-500 to-green-500',
                'is_active': True,
                'requires_photo': True,
                'requires_video': True,
                'requires_audio': False,
                'requires_portfolio': False,
                'max_video_duration': 180,  # 3 minutes
            },
            {
                'name': 'Technologie & Innovation',
                'slug': 'technologie-innovation',
                'description': 'Catégorie pour les développeurs, entrepreneurs tech et innovateurs.',
                'icon': '💻',
                'color_gradient': 'from-cyan-500 to-blue-500',
                'is_active': True,
                'requires_photo': True,
                'requires_video': True,
                'requires_audio': False,
                'requires_portfolio': True,
                'max_video_duration': 300,  # 5 minutes
            },
            {
                'name': 'Éducation & Formation',
                'slug': 'education-formation',
                'description': 'Catégorie pour les enseignants, formateurs et créateurs de contenu éducatif.',
                'icon': '🎓',
                'color_gradient': 'from-violet-500 to-purple-500',
                'is_active': True,
                'requires_photo': True,
                'requires_video': True,
                'requires_audio': True,
                'requires_portfolio': True,
                'max_video_duration': 600,  # 10 minutes
            }
        ]

        # Limiter le nombre de catégories selon l'option
        categories_to_create = categories_data[:options['count']]

        created_count = 0
        updated_count = 0

        self.stdout.write(
            self.style.SUCCESS('🚀 Création des catégories...')
        )
        self.stdout.write('=' * 50)

        for category_data in categories_to_create:
            category, created = Category.objects.get_or_create(
                slug=category_data['slug'],
                defaults=category_data
            )

            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'✅ Créée: {category.name} ({category.slug})')
                )
                created_count += 1
            else:
                # Mettre à jour les catégories existantes
                for key, value in category_data.items():
                    if key != 'slug':  # Ne pas modifier le slug
                        setattr(category, key, value)
                category.save()
                self.stdout.write(
                    self.style.WARNING(f'🔄 Mise à jour: {category.name} ({category.slug})')
                )
                updated_count += 1

        self.stdout.write('=' * 50)
        self.stdout.write(
            self.style.SUCCESS(f'📊 Résumé:')
        )
        self.stdout.write(f'   • {created_count} catégories créées')
        self.stdout.write(f'   • {updated_count} catégories mises à jour')
        self.stdout.write(f'   • {Category.objects.count()} catégories au total')

        # Afficher les catégories actives
        active_categories = Category.objects.filter(is_active=True)
        self.stdout.write(
            self.style.SUCCESS(f'\n🎯 Catégories actives ({active_categories.count()}):')
        )
        for category in active_categories:
            file_types = []
            if category.requires_photo:
                file_types.append("Photo")
            if category.requires_video:
                file_types.append("Vidéo")
            if category.requires_audio:
                file_types.append("Audio")
            if category.requires_portfolio:
                file_types.append("Portfolio")

            self.stdout.write(f'   • {category.icon} {category.name}')
            self.stdout.write(f'     Fichiers requis: {", ".join(file_types) if file_types else "Aucun"}')
            if category.max_video_duration:
                self.stdout.write(f'     Durée max vidéo: {category.max_video_duration}s')
            self.stdout.write()

