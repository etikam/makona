# Configuration Docker - Makona Awards 2025 (Production)

Configuration Docker simplifiée pour la production avec Traefik comme reverse proxy.

## Architecture

- **Frontend**: `makona-awards.n-it.org` (React/Vite)
- **Backend API**: `atyapimakona.n-it.org` (Django)
- **Base de données**: PostgreSQL 15
- **Reverse Proxy**: Traefik v3.0

## Services

### 1. Base de données (db)
- PostgreSQL 15 Alpine
- Volume persistant pour les données
- Health check intégré

### 2. Backend (backend)
- Django avec Gunicorn
- Utilisateur non-root pour la sécurité
- Collecte automatique des fichiers statiques
- Migrations automatiques

### 3. Frontend (frontend)
- Build multi-stage avec Node.js et serve
- Optimisation des performances
- Support du routing côté client

### 4. Reverse Proxy (traefik)
- Configuration minimale
- Certificats SSL automatiques
- Routage par domaine

## Utilisation

### Configuration
```bash
# 1. Copier la configuration
cp env.example .env

# 2. Modifier les variables selon vos besoins
nano .env

# 3. Démarrer tous les services
docker-compose up -d
```

### Variables d'environnement importantes

- `SECRET_KEY`: Clé secrète Django
- `POSTGRES_PASSWORD`: Mot de passe de la base de données
- `FRONTEND_DOMAIN`: makona-awards.n-it.org
- `API_DOMAIN`: atyapimakona.n-it.org
- `ACME_EMAIL`: Email pour Let's Encrypt

### Ports exposés

- `80`: HTTP (redirigé vers HTTPS)
- `443`: HTTPS

## Accès

- **Frontend**: https://makona-awards.n-it.org
- **API**: https://atyapimakona.n-it.org
- **Dashboard Traefik**: https://atyapimakona.n-it.org:8080

## Maintenance

### Redémarrage
```bash
# Redémarrer tous les services
docker-compose restart

# Redémarrer un service spécifique
docker-compose restart backend
```

### Mise à jour
```bash
# Rebuild et redémarrage
docker-compose up -d --build
```

### Logs
```bash
# Voir tous les logs
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f backend
```

### Sauvegarde
```bash
# Sauvegarde de la base de données
docker-compose exec db pg_dump -U makona makona_awards > backup.sql

# Restauration
docker-compose exec -T db psql -U makona makona_awards < backup.sql
```

## Commandes utiles

```bash
# Voir le statut des services
docker-compose ps

# Arrêter tous les services
docker-compose down

# Arrêter et supprimer les volumes
docker-compose down -v
```