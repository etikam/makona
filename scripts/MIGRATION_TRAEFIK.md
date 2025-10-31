# Migration vers docker-compose.traefik.yml - Guide de sécurité

## Problème rencontré

Lors de l'utilisation de `docker-compose.traefik.yml`, Docker détecte des conteneurs "orphelins" qui ont été créés avec `docker-compose.yml` mais qui ne sont pas définis dans le nouveau fichier.

## ⚠️ IMPORTANT : Les volumes sont préservés

**Le flag `--remove-orphans` ne supprime QUE les conteneurs, PAS les volumes Docker.**

Les volumes définis dans `docker-compose.yml` sont nommés explicitement :
- `makona_postgres_data` (base de données PostgreSQL)
- `makona_media` (fichiers média uploadés)
- `makona_static` (fichiers statiques)
- `makona_logs` (logs de l'application)

Ces volumes sont **indépendants des conteneurs** et leurs données sont **toujours préservées** même si les conteneurs sont supprimés.

## Solution recommandée : Script de migration

Utilisez le script `scripts/migrate_to_traefik.sh` qui :

1. ✅ Vérifie que tous les volumes critiques existent
2. ✅ Affiche la taille des volumes avant migration
3. ✅ Arrête proprement les conteneurs existants
4. ✅ Supprime les conteneurs orphelins (sans toucher aux volumes)
5. ✅ Vérifie à nouveau que les volumes sont toujours présents
6. ✅ Redémarre les services correctement

## Utilisation

```bash
# En production
./scripts/migrate_to_traefik.sh
```

## Vérification manuelle des volumes

Si vous voulez vérifier manuellement avant la migration :

```bash
# Lister tous les volumes Makona
docker volume ls | grep makona

# Inspecter un volume spécifique
docker volume inspect makona_postgres_data

# Voir la taille des données d'un volume (sur le serveur)
docker volume inspect makona_postgres_data --format '{{ .Mountpoint }}' | xargs sudo du -sh
```

## Commande manuelle sécurisée

Si vous préférez faire la migration manuellement :

```bash
# 1. Vérifier les volumes
docker volume ls | grep makona

# 2. Arrêter les conteneurs existants
docker-compose down

# 3. Démarrer Traefik avec suppression des orphelins
docker-compose -f docker-compose.traefik.yml up -d --remove-orphans

# 4. Redémarrer les services applicatifs
docker-compose up -d

# 5. Vérifier que tout fonctionne
docker-compose ps
docker volume ls | grep makona
```

## ⚠️ Avertissement sur "makona_traefik_prod"

**C'est normal** si vous voyez cet avertissement lors du démarrage des services applicatifs :

```
WARNING: Found orphan containers (makona_traefik_prod) for this project.
```

### Pourquoi cet avertissement ?

L'architecture utilise **deux fichiers compose différents** :
- `docker-compose.traefik.yml` : Gère uniquement Traefik
- `docker-compose.yml` : Gère les services applicatifs (backend, frontend, db)

Quand vous utilisez `docker-compose up -d` (avec `docker-compose.yml`), Docker détecte `makona_traefik_prod` qui a été créé avec l'autre fichier compose et le considère comme "orphelin" dans ce contexte.

**Cet avertissement est inoffensif** et n'affecte pas le fonctionnement. Traefik continue de fonctionner normalement car :
1. Il est géré séparément par `docker-compose.traefik.yml`
2. Il est déjà en cours d'exécution
3. Les services applicatifs se connectent correctement à Traefik via le réseau Docker

### Ignorer l'avertissement

Vous pouvez ignorer cet avertissement en toute sécurité. Il n'indique aucun problème.

## Vérification post-migration

Après la migration, vérifiez que :

1. ✅ Les conteneurs démarrent correctement
2. ✅ Les volumes sont toujours présents
3. ✅ Les données sont accessibles (connexion à la base de données, fichiers média, etc.)
4. ✅ L'application fonctionne normalement

```bash
# Vérifier les conteneurs
docker-compose ps

# Vérifier les volumes
docker volume ls | grep makona

# Vérifier les logs
docker-compose logs backend
docker-compose logs db
```

## En cas de problème

Si vous constatez une perte de données (ce qui ne devrait PAS arriver) :

1. **Arrêtez immédiatement** tous les conteneurs
2. **Ne supprimez pas** les volumes
3. Vérifiez les volumes : `docker volume ls`
4. Les données sont toujours dans les volumes Docker, même si les conteneurs ne tournent plus

