# Scripts de démarrage - Makona Awards 2025

## Scripts disponibles

### Windows

#### Option 1: PowerShell (Recommandé)
```powershell
.\scripts\start.ps1
```

#### Option 2: Batch
```cmd
scripts\start.bat
```

### Linux/Mac

```bash
chmod +x scripts/start.sh
./scripts/start.sh
```

## Fonctionnalités

Le script de premier lancement :

1. ✅ **Vérifie le fichier .env**
   - Crée `.env` depuis `env.example` s'il n'existe pas
   - Demande de configurer les variables importantes

2. ✅ **Crée le réseau Docker**
   - Crée le réseau `makona_network` s'il n'existe pas
   - Évite les erreurs de réseau manquant

3. ✅ **Démarre tous les services**
   - Build et démarre tous les conteneurs
   - Configure Traefik avec les certificats SSL

## Utilisation

### Premier lancement

1. **Copier et configurer les variables d'environnement** :
   ```bash
   cp env.example .env
   nano .env  # Ou utiliser votre éditeur préféré
   ```

2. **Exécuter le script** :
   - Windows: `.\scripts\start.ps1` ou `scripts\start.bat`
   - Linux/Mac: `./scripts/start.sh`

3. **Vérifier le statut** :
   ```bash
   docker-compose ps
   ```

### Lancements suivants

Pour les lancements suivants, vous pouvez utiliser directement :
```bash
docker-compose up -d
```

## Variables à configurer dans .env

### Obligatoires:
- `SECRET_KEY`: Clé secrète Django (générer avec `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`)
- `POSTGRES_PASSWORD`: Mot de passe sécurisé pour PostgreSQL
- `EMAIL_HOST_PASSWORD`: Mot de passe d'application Gmail pour etiro2005@gmail.com

### Déjà configurées:
- `FRONTEND_DOMAIN`: makona-awards.n-it.org
- `API_DOMAIN`: atyapimakona.n-it.org
- `ACME_EMAIL`: etiennedheleine2000@gmail.com
- `EMAIL_HOST_USER`: etiro2005@gmail.com
- `DEFAULT_FROM_EMAIL`: etiennedheleine2000@gmail.com

## Commandes utiles

```bash
# Voir les logs
docker-compose logs -f

# Redémarrer un service
docker-compose restart backend

# Arrêter tous les services
docker-compose down

# Rebuild et redémarrer
docker-compose up -d --build
```