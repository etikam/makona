# Scripts de démarrage - Makona Awards 2025

## Scripts disponibles

### Scripts de démarrage

#### Windows - PowerShell (Recommandé)
```powershell
.\scripts\start.ps1
```

#### Windows - Batch
```cmd
scripts\start.bat
```

#### Linux/Mac
```bash
chmod +x scripts/start.sh
./scripts/start.sh
```

### Scripts de nettoyage

⚠️ **ATTENTION** : Ces scripts suppriment **TOUS** les conteneurs, images et volumes du projet !

#### Windows - PowerShell
```powershell
.\scripts\clean.ps1
```

#### Windows - Batch
```cmd
scripts\clean.bat
```

#### Linux/Mac
```bash
chmod +x scripts/clean.sh
./scripts/clean.sh
```

Le script de nettoyage :
1. ✅ Arrête tous les conteneurs
2. ✅ Supprime les conteneurs orphelins
3. ✅ Supprime les images du projet
4. ✅ Supprime les volumes de données
5. ✅ Relance automatiquement l'application avec `start.sh`

**Note** : Le réseau Docker `makona_network` est préservé.

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
   # Application
   docker-compose -p app ps
   
   # Traefik
   docker-compose -f docker-compose.traefik.yml -p traefik ps
   ```

### Lancements suivants

Pour les lancements suivants, utilisez les commandes avec les noms de projet :

```bash
# Démarrer Traefik
docker-compose -f docker-compose.traefik.yml -p traefik up -d

# Démarrer l'application
docker-compose -p app up -d
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

### Application (projet `app`)

```bash
# Voir les logs
docker-compose -p app logs -f

# Voir les logs d'un service spécifique
docker-compose -p app logs -f backend
docker-compose -p app logs -f frontend
docker-compose -p app logs -f db

# Redémarrer un service
docker-compose -p app restart backend

# Arrêter tous les services
docker-compose -p app down

# Rebuild et redémarrer
docker-compose -p app up -d --build
```

### Traefik (projet `traefik`)

```bash
# Voir les logs
docker-compose -f docker-compose.traefik.yml -p traefik logs -f

# Redémarrer Traefik
docker-compose -f docker-compose.traefik.yml -p traefik restart

# Arrêter Traefik
docker-compose -f docker-compose.traefik.yml -p traefik down
```

## Documentation complète

Pour une documentation complète de toutes les commandes Docker disponibles, consultez :

📖 **[DOCKER_COMMANDS.md](./DOCKER_COMMANDS.md)**

Ce guide contient :
- ✅ Toutes les commandes de gestion des conteneurs
- ✅ Commandes de logs et debugging
- ✅ Gestion des volumes et sauvegardes
- ✅ Commandes d'urgence
- ✅ Workflow typique