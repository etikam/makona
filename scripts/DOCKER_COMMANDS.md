# Guide des commandes Docker - Makona Awards 2025

Documentation complète des commandes pour gérer les conteneurs, images et volumes du projet Makona Awards 2025.

## 📋 Architecture du projet

Le projet utilise **deux projets Docker Compose séparés** :

- **Projet `app`** : Backend Django, Frontend React, Base de données PostgreSQL
- **Projet `traefik`** : Reverse proxy Traefik avec certificats SSL Let's Encrypt

## 🚀 Démarrage et arrêt

### Démarrage complet

```bash
# Utiliser le script de démarrage (recommandé)
./scripts/start.sh          # Linux/Mac
.\scripts\start.ps1          # PowerShell Windows
.\scripts\start.bat          # Batch Windows

# Ou manuellement :
# 1. Démarrer Traefik
docker-compose -f docker-compose.traefik.yml -p traefik up -d

# 2. Démarrer l'application
docker-compose -p app up -d --build
```

### Arrêt complet

```bash
# Arrêter l'application
docker-compose -p app down

# Arrêter Traefik
docker-compose -f docker-compose.traefik.yml -p traefik down
```

### Redémarrage

```bash
# Redémarrer l'application
docker-compose -p app restart

# Redémarrer un service spécifique
docker-compose -p app restart backend
docker-compose -p app restart frontend
docker-compose -p app restart db

# Redémarrer Traefik
docker-compose -f docker-compose.traefik.yml -p traefik restart
```

## 📊 Consultation du statut

### Statut des conteneurs

```bash
# Statut de l'application
docker-compose -p app ps

# Statut de Traefik
docker-compose -f docker-compose.traefik.yml -p traefik ps

# Statut de tous les conteneurs makona
docker ps --filter "name=makona_" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

### Informations détaillées

```bash
# Informations sur un conteneur spécifique
docker inspect makona_backend
docker inspect makona_db
docker inspect makona_frontend
docker inspect makona_traefik_prod

# Statistiques d'utilisation (ressources)
docker stats makona_backend makona_db makona_frontend makona_traefik_prod
```

## 📝 Logs

### Consulter les logs

```bash
# Logs de l'application (tous les services)
docker-compose -p app logs -f

# Logs d'un service spécifique
docker-compose -p app logs -f backend
docker-compose -p app logs -f frontend
docker-compose -p app logs -f db

# Logs de Traefik
docker-compose -f docker-compose.traefik.yml -p traefik logs -f

# Logs d'un conteneur spécifique (dernières 100 lignes)
docker logs --tail 100 makona_backend
docker logs --tail 100 makona_db
docker logs --tail 100 makona_frontend
docker logs --tail 100 makona_traefik_prod
```

### Options de logs

```bash
# Logs depuis une date/heure
docker-compose -p app logs --since "2024-01-01T00:00:00" backend

# Dernières N lignes
docker-compose -p app logs --tail 50 backend

# Suivre les logs en temps réel (par défaut avec -f)
docker-compose -p app logs -f backend
```

## 🔧 Gestion des services

### Reconstruire les images

```bash
# Reconstruire toutes les images de l'application
docker-compose -p app build --no-cache

# Reconstruire un service spécifique
docker-compose -p app build --no-cache backend
docker-compose -p app build --no-cache frontend
```

### Exécuter des commandes dans les conteneurs

```bash
# Backend Django (shell Python)
docker-compose -p app exec backend python manage.py shell

# Backend Django (bash)
docker-compose -p app exec backend bash

# Migrations Django
docker-compose -p app exec backend python manage.py migrate

# Créer un superutilisateur Django
docker-compose -p app exec backend python manage.py createsuperuser

# Collecter les fichiers statiques
docker-compose -p app exec backend python manage.py collectstatic --noinput

# Base de données PostgreSQL (psql)
docker-compose -p app exec db psql -U ${POSTGRES_USER} -d ${POSTGRES_DB}
```

### Redémarrer un service après modification

```bash
# Reconstruire et redémarrer un service
docker-compose -p app up -d --build backend
```

## 💾 Gestion des volumes

### Lister les volumes

```bash
# Tous les volumes
docker volume ls

# Volumes du projet makona
docker volume ls | grep makona
```

### Inspecter un volume

```bash
# Informations sur un volume
docker volume inspect makona_postgres_data
docker volume inspect makona_media
docker volume inspect makona_static
docker volume inspect makona_logs
docker volume inspect makona_traefik_letsencrypt
```

### Sauvegarder un volume

```bash
# Sauvegarder la base de données PostgreSQL
docker run --rm -v makona_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz /data

# Sauvegarder les fichiers média
docker run --rm -v makona_media:/data -v $(pwd):/backup alpine tar czf /backup/media_backup.tar.gz /data
```

### Restaurer un volume

```bash
# Restaurer la base de données PostgreSQL
docker run --rm -v makona_postgres_data:/data -v $(pwd):/backup alpine sh -c "cd /data && tar xzf /backup/postgres_backup.tar.gz"

# Restaurer les fichiers média
docker run --rm -v makona_media:/data -v $(pwd):/backup alpine sh -c "cd /data && tar xzf /backup/media_backup.tar.gz"
```

## 🖼️ Gestion des images

### Lister les images

```bash
# Toutes les images
docker images

# Images liées au projet
docker images | grep -E "(makona|app|backend|frontend)"
```

### Supprimer les images

```bash
# Supprimer une image spécifique
docker rmi image_name:tag

# Supprimer les images non utilisées
docker image prune -a
```

## 🧹 Nettoyage

### Nettoyage complet (recommandé)

```bash
# Utiliser le script de nettoyage (recommandé)
./scripts/clean.sh           # Linux/Mac
.\scripts\clean.ps1          # PowerShell Windows
.\scripts\clean.bat          # Batch Windows
```

### Nettoyage manuel

```bash
# Arrêter et supprimer les conteneurs (avec volumes)
docker-compose -p app down -v
docker-compose -f docker-compose.traefik.yml -p traefik down -v

# Supprimer les volumes
docker volume rm makona_postgres_data makona_media makona_static makona_logs makona_traefik_letsencrypt makona_traefik_logs

# Supprimer les images
docker rmi $(docker images | grep -E "(makona|app|backend|frontend)" | awk '{print $3}')

# Nettoyer les ressources inutilisées
docker system prune -a --volumes
```

⚠️ **ATTENTION** : Le nettoyage manuel supprime **TOUTES** les données ! Utilisez avec précaution.

## 🔍 Debugging et dépannage

### Vérifier la connectivité réseau

```bash
# Vérifier que les conteneurs sont sur le même réseau
docker network inspect makona_network

# Tester la connectivité entre conteneurs
docker-compose -p app exec backend ping db
docker-compose -p app exec backend ping traefik
```

### Vérifier les variables d'environnement

```bash
# Variables d'environnement d'un conteneur
docker-compose -p app exec backend env
docker inspect makona_backend | grep -A 20 Env
```

### Accéder aux fichiers dans les conteneurs

```bash
# Lister les fichiers média
docker-compose -p app exec backend ls -la /app/media

# Vérifier les fichiers statiques
docker-compose -p app exec backend ls -la /app/staticfiles

# Vérifier les logs Django
docker-compose -p app exec backend cat /app/logs/django.log
```

### Tester la base de données

```bash
# Se connecter à PostgreSQL
docker-compose -p app exec db psql -U ${POSTGRES_USER} -d ${POSTGRES_DB}

# Dans psql, vous pouvez exécuter :
# \l          - Lister les bases de données
# \dt         - Lister les tables
# \d table_name - Voir la structure d'une table
# SELECT * FROM table_name LIMIT 10; - Voir les données
```

## 🔐 Sécurité

### Vérifier les permissions

```bash
# Permissions des volumes
docker volume inspect makona_media --format '{{ .Mountpoint }}' | xargs ls -ld

# Permissions dans le conteneur
docker-compose -p app exec backend ls -la /app/media
```

### Changer les mots de passe

```bash
# Modifier .env puis redémarrer
docker-compose -p app restart
```

## 📦 Commandes utiles supplémentaires

### Mettre à jour les conteneurs

```bash
# Mettre à jour les images et redémarrer
docker-compose -p app pull
docker-compose -p app up -d

# Ou reconstruire depuis les Dockerfiles
docker-compose -p app up -d --build
```

### Surveiller les ressources

```bash
# Surveillance en temps réel
docker stats

# Surveillance d'un conteneur spécifique
docker stats makona_backend --no-stream
```

### Exporter/Importer des données

```bash
# Exporter la base de données
docker-compose -p app exec db pg_dump -U ${POSTGRES_USER} ${POSTGRES_DB} > backup.sql

# Importer la base de données
docker-compose -p app exec -T db psql -U ${POSTGRES_USER} ${POSTGRES_DB} < backup.sql
```

## 🆘 Commandes d'urgence

### Forcer l'arrêt

```bash
# Arrêter un conteneur qui ne répond pas
docker kill makona_backend
docker kill makona_db
docker kill makona_frontend
docker kill makona_traefik_prod
```

### Réinitialisation complète (⚠️ SUPPRIME TOUT)

```bash
# Arrêter tout
docker-compose -p app down -v
docker-compose -f docker-compose.traefik.yml -p traefik down -v

# Supprimer les conteneurs
docker rm -f $(docker ps -a --filter "name=makona_" -q)

# Supprimer les volumes
docker volume rm $(docker volume ls | grep makona | awk '{print $2}')

# Supprimer les images
docker rmi -f $(docker images | grep -E "(makona|app|backend|frontend)" | awk '{print $3}')

# Redémarrer proprement
./scripts/start.sh
```

## 📚 Ressources

- [Documentation Docker Compose](https://docs.docker.com/compose/)
- [Documentation Docker](https://docs.docker.com/)
- [Documentation Traefik](https://doc.traefik.io/traefik/)

## 🔄 Workflow typique

```bash
# 1. Arrêter les services
docker-compose -p app down

# 2. Faire vos modifications (code, configuration, etc.)

# 3. Reconstruire si nécessaire
docker-compose -p app build --no-cache backend

# 4. Redémarrer
docker-compose -p app up -d

# 5. Vérifier les logs
docker-compose -p app logs -f backend
```

---

**Note** : Toutes ces commandes doivent être exécutées depuis le répertoire racine du projet (`D:\Makona_Awards\code_sources`).

