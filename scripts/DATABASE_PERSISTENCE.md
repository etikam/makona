# Persistance de la base de données - Problème résolu

## 🔍 Problème identifié

Si vous perdiez toutes vos données à chaque `docker-compose down` puis `docker-compose up`, c'était parce que **Django utilisait SQLite au lieu de PostgreSQL**.

### Cause du problème

- Le `docker-compose.yml` configurait bien PostgreSQL avec un volume persistant
- Mais Django utilisait SQLite qui était stocké dans le conteneur (donc perdu à chaque arrêt)
- Les données étaient bien dans PostgreSQL, mais Django ne les voyait pas car il utilisait une autre base

## ✅ Solution appliquée

### 1. Ajout des dépendances PostgreSQL

**`requirements.txt`** :
```
psycopg2-binary==2.9.9
dj-database-url==2.1.0
```

### 2. Configuration Django pour PostgreSQL

**`config/settings.py`** :
- Utilise maintenant `DATABASE_URL` (variable d'environnement) si disponible
- Se connecte à PostgreSQL en production (Docker)
- Garde SQLite pour le développement local (si DATABASE_URL n'est pas défini)

## 📝 Vérification

### Avant la correction

```bash
# Dans le conteneur backend
docker-compose -p app exec backend python manage.py shell

# Dans le shell Django
>>> from django.conf import settings
>>> settings.DATABASES['default']['ENGINE']
'django.db.backends.sqlite3'  # ❌ Mauvais
```

### Après la correction

```bash
# Dans le conteneur backend
docker-compose -p app exec backend python manage.py shell

# Dans le shell Django
>>> from django.conf import settings
>>> settings.DATABASES['default']['ENGINE']
'django.db.backends.postgresql'  # ✅ Correct
```

## 🚀 Migration des données existantes

Si vous aviez déjà des données dans PostgreSQL (mais Django ne les voyait pas), elles sont toujours là :

```bash
# Vérifier les données directement dans PostgreSQL
docker-compose -p app exec db psql -U ${POSTGRES_USER} -d ${POSTGRES_DB}

# Dans psql, vous pouvez voir :
\dt              # Liste des tables
SELECT * FROM accounts_user;  # Vos utilisateurs
```

Si vous aviez des données dans SQLite (le fichier `db.sqlite3`), elles ne sont pas perdues mais elles sont dans SQLite, pas PostgreSQL. Pour les migrer :

```bash
# 1. D'abord, reconstruire l'image avec les nouvelles dépendances
docker-compose -p app build --no-cache backend

# 2. Redémarrer les services
docker-compose -p app up -d

# 3. Les migrations Django vont créer les tables dans PostgreSQL
# Les données existantes dans PostgreSQL (si vous en aviez) seront préservées
```

## 🔧 Commandes importantes

### Arrêt sans perte de données

```bash
# ✅ CORRECT - Les volumes sont préservés
docker-compose -p app down

# ❌ INCORRECT - Supprime les volumes (perte de données)
docker-compose -p app down -v
```

### Vérifier que PostgreSQL est utilisé

```bash
# Vérifier les logs du backend au démarrage
docker-compose -p app logs backend | grep -i database

# Devrait afficher une connexion à PostgreSQL, pas SQLite
```

### Vérifier les volumes

```bash
# Liste des volumes
docker volume ls | grep makona

# Vérifier le volume PostgreSQL
docker volume inspect makona_postgres_data

# Vérifier la taille du volume (données persistées)
docker run --rm -v makona_postgres_data:/data alpine du -sh /data
```

## 💾 Sauvegardes

Maintenant que les données sont dans PostgreSQL, vous pouvez faire des sauvegardes :

```bash
# Sauvegarder la base de données
docker-compose -p app exec db pg_dump -U ${POSTGRES_USER} ${POSTGRES_DB} > backup.sql

# Restaurer la base de données
docker-compose -p app exec -T db psql -U ${POSTGRES_USER} ${POSTGRES_DB} < backup.sql
```

## 📊 Test de persistance

Pour vérifier que tout fonctionne :

```bash
# 1. Démarrer les conteneurs
docker-compose -p app up -d

# 2. Créer quelques données via Django admin ou API

# 3. Arrêter les conteneurs
docker-compose -p app down

# 4. Vérifier que le volume existe toujours
docker volume ls | grep makona_postgres_data

# 5. Redémarrer
docker-compose -p app up -d

# 6. Les données doivent toujours être là ! ✅
```

## ⚠️ Important

- **Ne jamais utiliser `down -v`** sauf si vous voulez vraiment tout supprimer
- Les volumes nommés (`makona_postgres_data`, `makona_media`, etc.) sont persistants même après `down`
- Utilisez `docker-compose -p app down` (sans `-v`) pour préserver les données

---

**Note** : Après cette correction, vos données seront maintenant réellement persistées dans PostgreSQL et vous ne les perdrez plus lors des `down` / `up`.

