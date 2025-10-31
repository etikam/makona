# Guide d'utilisation Docker Compose - Makona Awards

## Architecture des projets

L'application utilise **deux projets Docker Compose séparés** pour éviter les avertissements d'orphelins :

1. **Projet Traefik** (`makona-traefik`) : Gère uniquement Traefik
   - Fichier : `docker-compose.traefik.yml`
   - Commande : `docker-compose -p makona-traefik -f docker-compose.traefik.yml`

2. **Projet Application** (`makona-app`) : Gère les services applicatifs
   - Fichier : `docker-compose.yml`
   - Commande : `docker-compose -p makona-app`

## ⚠️ Pourquoi cette séparation ?

En utilisant deux fichiers compose séparés sans nom de projet différent, Docker Compose détecte les conteneurs d'un projet comme "orphelins" dans l'autre projet, générant des avertissements.

En utilisant des **noms de projets différents** (`-p makona-traefik` et `-p makona-app`), Docker Compose sépare complètement les deux configurations et **aucun avertissement n'apparaît**.

## Commandes de base

### Démarrer tous les services

```bash
# Méthode 1 : Utiliser le script automatique (recommandé)
./scripts/start.sh

# Méthode 2 : Commandes manuelles
docker-compose -p makona-traefik -f docker-compose.traefik.yml up -d
docker-compose -p makona-app up -d --build
```

### Arrêter tous les services

```bash
docker-compose -p makona-app down
docker-compose -p makona-traefik -f docker-compose.traefik.yml down
```

### Voir le statut

```bash
# Voir Traefik
docker-compose -p makona-traefik -f docker-compose.traefik.yml ps

# Voir l'application
docker-compose -p makona-app ps

# Voir tous les conteneurs Makona
docker ps --filter "name=makona_"
```

### Logs

```bash
# Logs Traefik
docker-compose -p makona-traefik -f docker-compose.traefik.yml logs -f

# Logs Application
docker-compose -p makona-app logs -f

# Logs d'un service spécifique
docker-compose -p makona-app logs -f backend
docker-compose -p makona-app logs -f db
```

### Redémarrer un service

```bash
# Redémarrer le backend
docker-compose -p makona-app restart backend

# Redémarrer Traefik
docker-compose -p makona-traefik -f docker-compose.traefik.yml restart traefik
```

### Rebuild et redémarrage

```bash
# Rebuild et redémarrer l'application
docker-compose -p makona-app up -d --build

# Rebuild un service spécifique
docker-compose -p makona-app up -d --build backend
```

## Migration vers cette configuration

Si vous avez des conteneurs existants créés sans nom de projet spécifique :

```bash
# Utiliser le script de migration (recommandé)
./scripts/migrate_to_traefik.sh

# Ou manuellement :
# 1. Arrêter les conteneurs existants
docker-compose down

# 2. Démarrer avec les nouveaux noms de projets
docker-compose -p makona-traefik -f docker-compose.traefik.yml up -d
docker-compose -p makona-app up -d
```

## Avantages de cette configuration

✅ **Aucun avertissement** : Les projets sont complètement séparés  
✅ **Clarté** : Facile de distinguer Traefik des services applicatifs  
✅ **Indépendance** : Traefik et l'application peuvent être gérés séparément  
✅ **Volumes préservés** : Les volumes nommés sont indépendants des projets  
✅ **Production-ready** : Configuration propre et professionnelle  

## Vérification des volumes

Les volumes sont nommés explicitement et sont **indépendants des projets** :

```bash
# Voir tous les volumes Makona
docker volume ls | grep makona

# Volumes applicatifs
docker volume inspect makona_postgres_data
docker volume inspect makona_media
docker volume inspect makona_static
docker volume inspect makona_logs

# Volumes Traefik
docker volume inspect makona_traefik_letsencrypt
docker volume inspect makona_traefik_logs
```

## Dépannage

### Les conteneurs ne démarrent pas

```bash
# Vérifier les logs
docker-compose -p makona-app logs
docker-compose -p makona-traefik -f docker-compose.traefik.yml logs

# Vérifier le réseau
docker network inspect makona_network

# Vérifier les volumes
docker volume ls | grep makona
```

### Supprimer et recréer

```bash
# ATTENTION : Cela supprime les conteneurs mais PAS les volumes
docker-compose -p makona-app down
docker-compose -p makona-traefik -f docker-compose.traefik.yml down

# Recréer
docker-compose -p makona-traefik -f docker-compose.traefik.yml up -d
docker-compose -p makona-app up -d --build
```

## Scripts disponibles

- `scripts/start.sh` : Démarrage initial de tous les services
- `scripts/migrate_to_traefik.sh` : Migration vers la configuration avec projets séparés
- `scripts/DOCKER_COMPOSE_USAGE.md` : Ce guide (documentation)

