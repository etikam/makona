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
docker-compose -p app down

# 3. Démarrer Traefik avec un nom de projet séparé
docker-compose -f docker-compose.traefik.yml -p traefik up -d

# 4. Redémarrer les services applicatifs
docker-compose -p app up -d

# 5. Vérifier que tout fonctionne
docker-compose -p app ps
docker-compose -f docker-compose.traefik.yml -p traefik ps
docker volume ls | grep makona
```

## ✅ Solution : Noms de projet séparés

Pour éviter les avertissements d'orchestrés, l'architecture utilise **des noms de projet distincts** :

- **Projet Traefik** : `traefik` (via `-p traefik`)
- **Projet Application** : `app` (via `-p app`)

### Utilisation

```bash
# Démarrer Traefik
docker-compose -f docker-compose.traefik.yml -p traefik up -d

# Démarrer l'application
docker-compose -p app up -d

# Voir le statut
docker-compose -p app ps
docker-compose -f docker-compose.traefik.yml -p traefik ps

# Arrêter
docker-compose -p app down
docker-compose -f docker-compose.traefik.yml -p traefik down
```

Cette séparation garantit que Docker Compose ne considère pas les conteneurs d'un projet comme des "orphelins" dans l'autre projet.

## Vérification post-migration

Après la migration, vérifiez que :

1. ✅ Les conteneurs démarrent correctement
2. ✅ Les volumes sont toujours présents
3. ✅ Les données sont accessibles (connexion à la base de données, fichiers média, etc.)
4. ✅ L'application fonctionne normalement

```bash
# Vérifier les conteneurs
docker-compose -p app ps
docker-compose -f docker-compose.traefik.yml -p traefik ps

# Vérifier les volumes
docker volume ls | grep makona

# Vérifier les logs
docker-compose -p app logs backend
docker-compose -p app logs db
docker-compose -f docker-compose.traefik.yml -p traefik logs
```

## En cas de problème

Si vous constatez une perte de données (ce qui ne devrait PAS arriver) :

1. **Arrêtez immédiatement** tous les conteneurs
2. **Ne supprimez pas** les volumes
3. Vérifiez les volumes : `docker volume ls`
4. Les données sont toujours dans les volumes Docker, même si les conteneurs ne tournent plus

