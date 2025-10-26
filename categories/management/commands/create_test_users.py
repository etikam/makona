"""
Commande Django pour créer des utilisateurs de test
Usage: python manage.py create_test_users
"""

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from candidates.models import CandidateProfile

User = get_user_model()


class Command(BaseCommand):
    help = 'Créer des utilisateurs de test (candidats et admins)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--reset',
            action='store_true',
            help='Supprimer tous les utilisateurs de test existants',
        )
        parser.add_argument(
            '--candidates',
            type=int,
            default=5,
            help='Nombre de candidats à créer (défaut: 5)',
        )
        parser.add_argument(
            '--admins',
            type=int,
            default=2,
            help='Nombre d\'admins à créer (défaut: 2)',
        )

    def handle(self, *args, **options):
        if options['reset']:
            self.stdout.write(
                self.style.WARNING('🗑️  Suppression des utilisateurs de test...')
            )
            # Supprimer les utilisateurs de test (ceux avec email contenant "test")
            User.objects.filter(email__icontains='test').delete()
            self.stdout.write(
                self.style.SUCCESS('✅ Tous les utilisateurs de test ont été supprimés')
            )

        # Créer des admins de test
        admin_data = [
            {
                'email': 'admin1@test.com',
                'username': 'admin1',
                'first_name': 'Admin',
                'last_name': 'Principal',
                'user_type': 'admin',
                'is_verified': True,
                'is_active': True,
            },
            {
                'email': 'admin2@test.com',
                'username': 'admin2',
                'first_name': 'Admin',
                'last_name': 'Secondaire',
                'user_type': 'admin',
                'is_verified': True,
                'is_active': True,
            }
        ]

        # Créer des candidats de test
        candidates_data = [
            {
                'email': 'candidat1@test.com',
                'username': 'candidat1',
                'first_name': 'Marie',
                'last_name': 'Dupont',
                'phone': '+224 123 456 789',
                'country': 'guinea',
                'user_type': 'candidate',
                'is_verified': True,
                'is_active': True,
                'bio': 'Chanteuse passionnée avec 5 ans d\'expérience dans la musique traditionnelle guinéenne.',
                'facebook_url': 'https://facebook.com/marie.dupont',
                'instagram_url': 'https://instagram.com/marie_dupont',
                'youtube_url': 'https://youtube.com/@marie_dupont',
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
                'bio': 'Danseur professionnel spécialisé dans les danses traditionnelles africaines.',
                'instagram_url': 'https://instagram.com/amadou_diallo',
                'youtube_url': 'https://youtube.com/@amadou_diallo',
            },
            {
                'email': 'candidat3@test.com',
                'username': 'candidat3',
                'first_name': 'Fatoumata',
                'last_name': 'Camara',
                'phone': '+224 555 123 456',
                'country': 'guinea',
                'user_type': 'candidate',
                'is_verified': False,
                'is_active': True,
                'bio': 'Photographe amateur passionnée par la capture des moments de vie.',
                'website_url': 'https://fatoumata-photo.com',
            },
            {
                'email': 'candidat4@test.com',
                'username': 'candidat4',
                'first_name': 'Ibrahima',
                'last_name': 'Bah',
                'phone': '+224 444 555 666',
                'country': 'guinea',
                'user_type': 'candidate',
                'is_verified': True,
                'is_active': True,
                'bio': 'Réalisateur de films documentaires sur la culture guinéenne.',
                'facebook_url': 'https://facebook.com/ibrahima.bah',
                'youtube_url': 'https://youtube.com/@ibrahima_bah',
            },
            {
                'email': 'candidat5@test.com',
                'username': 'candidat5',
                'first_name': 'Aïcha',
                'last_name': 'Sow',
                'phone': '+224 777 888 999',
                'country': 'guinea',
                'user_type': 'candidate',
                'is_verified': True,
                'is_active': False,
                'bio': 'Écrivaine et poétesse, auteure de plusieurs recueils de poésie.',
                'website_url': 'https://aicha-sow.com',
            }
        ]

        created_admins = 0
        created_candidates = 0

        self.stdout.write(
            self.style.SUCCESS('🚀 Création des utilisateurs de test...')
        )
        self.stdout.write('=' * 50)

        # Créer les admins
        self.stdout.write(
            self.style.SUCCESS('👑 Création des administrateurs...')
        )
        for admin_info in admin_data[:options['admins']]:
            user, created = User.objects.get_or_create(
                email=admin_info['email'],
                defaults={
                    **admin_info,
                    'password': 'admin123'  # Mot de passe par défaut
                }
            )
            
            if created:
                user.set_password('admin123')
                user.save()
                self.stdout.write(
                    self.style.SUCCESS(f'✅ Admin créé: {user.full_name} ({user.email})')
                )
                created_admins += 1
            else:
                self.stdout.write(
                    self.style.WARNING(f'⚠️  Admin existe déjà: {user.full_name} ({user.email})')
                )

        # Créer les candidats
        self.stdout.write(
            self.style.SUCCESS('\n👤 Création des candidats...')
        )
        for candidate_info in candidates_data[:options['candidates']]:
            # Extraire les données du profil candidat
            profile_data = {
                'bio': candidate_info.pop('bio', ''),
                'facebook_url': candidate_info.pop('facebook_url', ''),
                'instagram_url': candidate_info.pop('instagram_url', ''),
                'youtube_url': candidate_info.pop('youtube_url', ''),
                'website_url': candidate_info.pop('website_url', ''),
            }

            user, created = User.objects.get_or_create(
                email=candidate_info['email'],
                defaults={
                    **candidate_info,
                    'password': 'candidat123'  # Mot de passe par défaut
                }
            )
            
            if created:
                user.set_password('candidat123')
                user.save()
                
                # Créer le profil candidat
                CandidateProfile.objects.create(
                    user=user,
                    **profile_data
                )
                
                self.stdout.write(
                    self.style.SUCCESS(f'✅ Candidat créé: {user.full_name} ({user.email})')
                )
                created_candidates += 1
            else:
                self.stdout.write(
                    self.style.WARNING(f'⚠️  Candidat existe déjà: {user.full_name} ({user.email})')
                )

        self.stdout.write('=' * 50)
        self.stdout.write(
            self.style.SUCCESS(f'📊 Résumé:')
        )
        self.stdout.write(f'   • {created_admins} administrateurs créés')
        self.stdout.write(f'   • {created_candidates} candidats créés')
        self.stdout.write(f'   • {User.objects.count()} utilisateurs au total')

        # Afficher les informations de connexion
        self.stdout.write(
            self.style.SUCCESS(f'\n🔑 Informations de connexion:')
        )
        self.stdout.write('   Administrateurs:')
        for admin in User.objects.filter(user_type='admin', email__icontains='test'):
            self.stdout.write(f'     • {admin.email} / admin123')
        
        self.stdout.write('   Candidats:')
        for candidate in User.objects.filter(user_type='candidate', email__icontains='test'):
            self.stdout.write(f'     • {candidate.email} / candidat123')

        self.stdout.write(
            self.style.SUCCESS(f'\n✨ Utilisateurs de test créés avec succès!')
        )
