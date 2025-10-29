@echo off
REM Script de premier lancement - Makona Awards 2025 (Windows Batch)
echo.
echo 🚀 Configuration et démarrage de Makona Awards 2025
echo.

REM Vérifier si .env existe
if not exist .env (
    echo 📝 Création du fichier .env depuis env.example...
    copy env.example .env
    echo.
    echo ⚠️  IMPORTANT: Veuillez modifier le fichier .env avec vos valeurs de production
    echo    - SECRET_KEY: Générer une clé secrète Django
    echo    - POSTGRES_PASSWORD: Mot de passe sécurisé pour PostgreSQL
    echo    - EMAIL_HOST_PASSWORD: Mot de passe d'application Gmail
    echo.
    pause
)

REM Créer le réseau Docker s'il n'existe pas
docker network ls | findstr "makona_network" >nul
if errorlevel 1 (
    echo 📡 Création du réseau Docker makona_network...
    docker network create makona_network
) else (
    echo ✅ Réseau makona_network existe déjà
)

REM Démarrer les services
echo.
echo 🐳 Démarrage des services Docker...
docker-compose up -d --build

echo.
echo ✅ Configuration terminée!
echo.
echo 📊 Statut des services:
docker-compose ps

echo.
echo 📝 Logs (pour voir les logs en temps réel):
echo    docker-compose logs -f
echo.
echo 🌐 Accès:
echo    Frontend: https://makona-awards.n-it.org
echo    API: https://atyapimakona.n-it.org
echo.
pause
