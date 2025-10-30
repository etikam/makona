#!/bin/bash
set -e

# Attendre que la base de données soit prête
echo "Attente de la base de données..."
python docker/wait_for_db.py

# Collecter les fichiers statiques
echo "Collection des fichiers statiques..."
python manage.py collectstatic --noinput

# Appliquer les migrations
echo "Application des migrations..."
python manage.py migrate

# Créer un superutilisateur si nécessaire
echo "Vérification du superutilisateur..."
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(is_superuser=True).exists():
    u = User.objects.create_superuser('admin', 'admin@makonaawards.com', 'admin123')
    # S'assurer que le superuser est bien taggé comme admin applicatif
    try:
        u.user_type = 'admin'
        if not u.country:
            u.country = 'guinea'
        u.save(update_fields=['user_type', 'country'])
    except Exception as e:
        print(f'Warning: unable to set user_type/country on superuser: {e}')
    print('Superutilisateur créé: admin/admin123 (type: admin)')
else:
    print('Superutilisateur existe déjà')
"

# Démarrer l'application
echo "Démarrage de l'application..."
exec "$@"
