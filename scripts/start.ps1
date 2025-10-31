# Script de premier lancement - Makona Awards 2025 (PowerShell)
Write-Host "🚀 Configuration et démarrage de Makona Awards 2025" -ForegroundColor Cyan
Write-Host ""

# Vérifier si .env existe
if (-not (Test-Path .env)) {
    Write-Host "📝 Création du fichier .env depuis env.example..." -ForegroundColor Yellow
    Copy-Item env.example .env
    Write-Host "⚠️  IMPORTANT: Veuillez modifier le fichier .env avec vos valeurs de production" -ForegroundColor Yellow
    Write-Host "   - SECRET_KEY: Générer une clé secrète Django" -ForegroundColor Yellow
    Write-Host "   - POSTGRES_PASSWORD: Mot de passe sécurisé pour PostgreSQL" -ForegroundColor Yellow
    Write-Host "   - EMAIL_HOST_PASSWORD: Mot de passe d'application Gmail" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Appuyez sur Entrée une fois que vous avez modifié .env"
}

# Créer le réseau Docker s'il n'existe pas
$networkExists = docker network ls | Select-String "makona_network"
if (-not $networkExists) {
    Write-Host "📡 Création du réseau Docker makona_network..." -ForegroundColor Green
    docker network create makona_network
} else {
    Write-Host "✅ Réseau makona_network existe déjà" -ForegroundColor Green
}

# Démarrer Traefik avec un nom de projet séparé
Write-Host ""
Write-Host "🌐 Démarrage de Traefik..." -ForegroundColor Cyan
docker-compose -f docker-compose.traefik.yml -p traefik up -d

# Démarrer l'application avec un nom de projet spécifique
Write-Host ""
Write-Host "🐳 Démarrage de l'application..." -ForegroundColor Cyan
docker-compose -p app up -d --build

Write-Host ""
Write-Host "✅ Configuration terminée!" -ForegroundColor Green
Write-Host ""

Write-Host "📊 Statut des services:" -ForegroundColor Cyan
Write-Host "Application:" -ForegroundColor Yellow
docker-compose -p app ps
Write-Host ""
Write-Host "Traefik:" -ForegroundColor Yellow
docker-compose -f docker-compose.traefik.yml -p traefik ps

Write-Host ""
Write-Host "📝 Logs (pour voir les logs en temps réel):" -ForegroundColor Cyan
Write-Host "   Application: docker-compose -p app logs -f"
Write-Host "   Traefik: docker-compose -f docker-compose.traefik.yml -p traefik logs -f"
Write-Host ""
Write-Host "🌐 Accès:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost"
Write-Host "   API: http://localhost/api"
Write-Host "   Dashboard Traefik: http://localhost:8080"
Write-Host ""
