# Guide de correction des erreurs CORS en production

## Problème
Le frontend `https://makona-awards.n-it.org` ne peut pas appeler l'API `https://etyapimakona.n-it.org` à cause d'erreurs CORS.

## Corrections nécessaires dans le fichier .env

### 1. Corriger la typo dans CSRF_TRUSTED_ORIGINS
❌ **Erreur actuelle :**
```
CSRF_TRUSTED_ORIGINS=https://makona-awards.n-it.org,https://etyapimakon.n-it.org
```

✅ **Corriger en :**
```
CSRF_TRUSTED_ORIGINS=https://makona-awards.n-it.org,https://etyapimakona.n-it.org
```

### 2. Ajouter ALLOWED_HOSTS
Ajoutez cette ligne si elle n'existe pas :
```
ALLOWED_HOSTS=etyapimakona.n-it.org
```

### 3. Vérifier que FRONTEND_DOMAIN et API_DOMAIN sont définis
Assurez-vous que ces lignes existent :
```
FRONTEND_DOMAIN=makona-awards.n-it.org
API_DOMAIN=etyapimakona.n-it.org
```

### 4. Fichier .env complet (exemple)
```env
POSTGRES_DB=makona_awards
POSTGRES_USER=makona
POSTGRES_PASSWORD=your-secure-password-here

# Configuration Django
DEBUG=False
SECRET_KEY=your-super-secret-key-here-change-this-in-production
ALLOWED_HOSTS=etyapimakona.n-it.org

# Configuration des domaines
FRONTEND_DOMAIN=makona-awards.n-it.org
API_DOMAIN=etyapimakona.n-it.org
ACME_EMAIL=etiennedheleine2000@gmail.com
DOMAIN=n-it.org

# Configuration email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=etiro2005@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=etiennedheleine2000@gmail.com

# Configuration CORS
CORS_ALLOWED_ORIGINS=https://makona-awards.n-it.org
CSRF_TRUSTED_ORIGINS=https://makona-awards.n-it.org,https://etyapimakona.n-it.org
```

## Actions à effectuer

### 1. Corriger le fichier .env sur le serveur
```bash
nano .env
# Corriger les valeurs ci-dessus
```

### 2. Reconstruire et redémarrer le conteneur backend
```bash
# Arrêter le conteneur
docker-compose -p app stop backend

# Reconstruire avec les nouvelles variables
docker-compose -p app up -d --build backend

# Vérifier les logs
docker-compose -p app logs -f backend
```

### 3. Vérifier que les variables sont bien chargées
```bash
# Vérifier les variables d'environnement dans le conteneur
docker exec makona_backend env | grep -E "CORS|FRONTEND|CSRF|ALLOWED"
```

Vous devriez voir :
- `CORS_ALLOWED_ORIGINS=https://makona-awards.n-it.org`
- `FRONTEND_DOMAIN=makona-awards.n-it.org`
- `API_DOMAIN=etyapimakona.n-it.org`
- `CSRF_TRUSTED_ORIGINS=https://makona-awards.n-it.org,https://etyapimakona.n-it.org`
- `ALLOWED_HOSTS=etyapimakona.n-it.org`

### 4. Vérifier la configuration Django
```bash
# Se connecter au conteneur
docker exec -it makona_backend bash

# Lancer un shell Django
python manage.py shell

# Vérifier la configuration CORS
from django.conf import settings
print("CORS_ALLOWED_ORIGINS:", settings.CORS_ALLOWED_ORIGINS)
print("CSRF_TRUSTED_ORIGINS:", settings.CSRF_TRUSTED_ORIGINS)
print("ALLOWED_HOSTS:", settings.ALLOWED_HOSTS)
```

### 5. Tester la requête CORS
```bash
# Tester une requête OPTIONS (preflight)
curl -X OPTIONS https://etyapimakona.n-it.org/api/auth/login/ \
  -H "Origin: https://makona-awards.n-it.org" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v
```

Vous devriez voir les headers :
- `Access-Control-Allow-Origin: https://makona-awards.n-it.org`
- `Access-Control-Allow-Credentials: true`
- `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS`

## Diagnostic avec le script de test

Un script de diagnostic est disponible pour vérifier la configuration :

```bash
# Copier le script dans le conteneur
docker cp scripts/check_cors.py makona_backend:/app/check_cors.py

# Exécuter le diagnostic
docker exec makona_backend python check_cors.py
```

## Tester l'endpoint de diagnostic CORS

Un endpoint de diagnostic a été ajouté à `/api/auth/cors-debug/` :

```bash
# Tester avec curl
curl -X GET https://etyapimakona.n-it.org/api/auth/cors-debug/ \
  -H "Origin: https://makona-awards.n-it.org" \
  -v
```

Cet endpoint devrait renvoyer la configuration CORS actuelle.

## Dépannage

### Si les erreurs persistent après ces étapes :

1. **Vérifier que Traefik ne bloque pas les requêtes OPTIONS**
   - Les requêtes OPTIONS (preflight) doivent passer jusqu'à Django
   - Vérifier les logs Traefik : `docker logs makona_traefik_prod`
   - Si Traefik bloque OPTIONS, il faut configurer des headers CORS dans Traefik

2. **Vérifier que le middleware CORS est bien en première position**
   - Le fichier `config/settings.py` doit avoir `corsheaders.middleware.CorsMiddleware` en premier dans `MIDDLEWARE`
   - Vérifier avec : `docker exec makona_backend python check_cors.py`

3. **Vider le cache du navigateur**
   - Les erreurs CORS peuvent être mises en cache
   - Tester en navigation privée

4. **Vérifier les logs Django**
   ```bash
   docker exec makona_backend tail -f logs/django.log
   ```

5. **Forcer le rechargement des settings Django**
   - **IMPORTANT** : Après modification du `.env`, il faut **reconstruire** le conteneur, pas seulement le redémarrer :
   ```bash
   # Arrêter
   docker-compose -p app stop backend
   
   # Reconstruire (c'est crucial pour recharger les variables d'environnement)
   docker-compose -p app build --no-cache backend
   
   # Redémarrer
   docker-compose -p app up -d backend
   ```

6. **Vérifier que les variables sont bien dans le conteneur**
   ```bash
   docker exec makona_backend env | grep -E "CORS|FRONTEND|CSRF|ALLOWED"
   ```

## Notes importantes

- Les variables d'environnement doivent être **exactement** comme indiqué (avec `https://`)
- Après chaque modification du `.env`, il faut **reconstruire** le conteneur backend
- Le middleware CORS doit être **avant** tous les autres middlewares
- Les cookies sécurisés nécessitent HTTPS, donc `SESSION_COOKIE_SECURE` et `CSRF_COOKIE_SECURE` sont automatiquement activés en production (quand `DEBUG=False`)

