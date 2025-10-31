#!/bin/bash
set -e

# Fonction pour ajuster les permissions (à exécuter en root)
adjust_permissions() {
    echo "Vérification des permissions des volumes..."
    if [ -d "/app/media" ]; then
        chown -R django:django /app/media
        chmod -R 755 /app/media
    fi
    if [ -d "/app/staticfiles" ]; then
        chown -R django:django /app/staticfiles
        chmod -R 755 /app/staticfiles
    fi
    if [ -d "/app/logs" ]; then
        chown -R django:django /app/logs
        chmod -R 755 /app/logs
    fi
}

# Construire DATABASE_URL si elle n'est pas définie (avant le passage à django)
if [ -z "$DATABASE_URL" ]; then
    echo "Construction de DATABASE_URL..."
    export DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}"
    echo "DATABASE_URL construite: postgresql://${POSTGRES_USER}:***@db:5432/${POSTGRES_DB}"
fi

# Si on est root, ajuster les permissions puis passer à django
if [ "$(id -u)" = '0' ]; then
    adjust_permissions
    # Préserver DATABASE_URL et autres variables d'environnement lors du passage à django
    export DATABASE_URL
    exec gosu django env DATABASE_URL="$DATABASE_URL" "$0" "$@"
fi

# À partir d'ici, on est l'utilisateur django

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
