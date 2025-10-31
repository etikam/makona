@echo off
REM Script de nettoyage complet - Makona Awards 2025 (Windows Batch)
REM Supprime tous les conteneurs, images et volumes liés au projet
REM Puis relance l'application avec start.bat

echo 🧹 Nettoyage complet de Makona Awards 2025
echo.

REM Demander confirmation
set /p confirmation="⚠️  ATTENTION: Ce script va supprimer TOUS les conteneurs, images et volumes du projet. Continuer? (oui/non): "
if /i not "%confirmation%"=="oui" (
    echo Nettoyage annulé.
    exit /b 1
)

echo.
echo 🛑 Arrêt des projets Docker Compose...

REM Arrêter et supprimer les conteneurs de l'application
docker-compose -p app down -v 2>nul

REM Arrêter et supprimer les conteneurs Traefik
docker-compose -f docker-compose.traefik.yml -p traefik down -v 2>nul

echo.
echo 🗑️  Suppression des conteneurs orphelins...

REM Supprimer tous les conteneurs makona_*
for /f "tokens=*" %%i in ('docker ps -a --filter "name=makona_" --format "{{.Names}}" 2^>nul') do (
    echo    Suppression de %%i...
    docker rm -f %%i 2>nul
)

echo.
echo 🖼️  Suppression des images...
echo    (Suppression manuelle des images recommandée via: docker images)

echo.
echo 💾 Suppression des volumes...

REM Supprimer les volumes spécifiques
for %%v in (makona_postgres_data makona_media makona_static makona_logs makona_traefik_letsencrypt makona_traefik_logs) do (
    docker volume inspect %%v >nul 2>&1
    if not errorlevel 1 (
        echo    Suppression du volume %%v...
        docker volume rm %%v 2>nul
    )
)

REM Nettoyage des volumes anonymes
docker volume prune -f >nul 2>&1

echo.
echo 🌐 Préservation du réseau...
echo    Le réseau makona_network est conservé

echo.
echo ✅ Nettoyage terminé!
echo.
echo 🚀 Relance de l'application...

REM Relancer le script start.bat
if exist "scripts\start.bat" (
    call scripts\start.bat
) else if exist ".\start.bat" (
    call .\start.bat
) else (
    echo ⚠️  Script start.bat introuvable. Démarrage manuel requis.
    echo.
    echo Pour démarrer manuellement:
    echo    docker-compose -f docker-compose.traefik.yml -p traefik up -d
    echo    docker-compose -p app up -d --build
)

pause

