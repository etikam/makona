# Script de nettoyage complet - Makona Awards 2025 (PowerShell)
# Supprime tous les conteneurs, images et volumes liés au projet
# Puis relance l'application avec start.ps1

Write-Host "🧹 Nettoyage complet de Makona Awards 2025" -ForegroundColor Cyan
Write-Host ""

# Demander confirmation
$confirmation = Read-Host "⚠️  ATTENTION: Ce script va supprimer TOUS les conteneurs, images et volumes du projet. Continuer? (oui/non)"
if ($confirmation -ne "oui" -and $confirmation -ne "Oui") {
    Write-Host "Nettoyage annulé." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🛑 Arrêt des projets Docker Compose..." -ForegroundColor Yellow

# Arrêter et supprimer les conteneurs de l'application
$appContainers = docker-compose -p app ps -q 2>$null
if ($appContainers) {
    Write-Host "   Arrêt de l'application (projet: app)..." -ForegroundColor Gray
    docker-compose -p app down -v 2>$null
}

# Arrêter et supprimer les conteneurs Traefik
$traefikContainers = docker-compose -f docker-compose.traefik.yml -p traefik ps -q 2>$null
if ($traefikContainers) {
    Write-Host "   Arrêt de Traefik (projet: traefik)..." -ForegroundColor Gray
    docker-compose -f docker-compose.traefik.yml -p traefik down -v 2>$null
}

Write-Host ""
Write-Host "🗑️  Suppression des conteneurs orphelins..." -ForegroundColor Yellow

# Supprimer tous les conteneurs makona_*
$containers = docker ps -a --filter "name=makona_" --format "{{.Names}}" 2>$null
if ($containers) {
    foreach ($container in $containers) {
        Write-Host "   Suppression de $container..." -ForegroundColor Gray
        docker rm -f $container 2>$null
    }
}

Write-Host ""
Write-Host "🖼️  Suppression des images..." -ForegroundColor Yellow

# Supprimer les images liées au projet
$images = docker images --format "{{.Repository}}:{{.Tag}}" | Select-String -Pattern "(makona|app|backend|frontend)" 2>$null
if ($images) {
    foreach ($image in $images) {
        Write-Host "   Suppression de $image..." -ForegroundColor Gray
        docker rmi -f $image 2>$null
    }
}

Write-Host ""
Write-Host "💾 Suppression des volumes..." -ForegroundColor Yellow

# Liste des volumes à supprimer
$volumes = @(
    "makona_postgres_data",
    "makona_media",
    "makona_static",
    "makona_logs",
    "makona_traefik_letsencrypt",
    "makona_traefik_logs"
)

foreach ($volume in $volumes) {
    $exists = docker volume inspect $volume 2>$null
    if ($exists) {
        Write-Host "   Suppression du volume $volume..." -ForegroundColor Gray
        docker volume rm $volume 2>$null
    }
}

# Supprimer aussi les volumes anonymes des projets
Write-Host "   Nettoyage des volumes anonymes..." -ForegroundColor Gray
docker volume prune -f 2>$null

Write-Host ""
Write-Host "🌐 Préservation du réseau..." -ForegroundColor Yellow
Write-Host "   Le réseau makona_network est conservé" -ForegroundColor Gray

Write-Host ""
Write-Host "✅ Nettoyage terminé!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Relance de l'application..." -ForegroundColor Cyan

# Relancer le script start.ps1
if (Test-Path "scripts\start.ps1") {
    & "scripts\start.ps1"
} elseif (Test-Path ".\start.ps1") {
    & ".\start.ps1"
} else {
    Write-Host "⚠️  Script start.ps1 introuvable. Démarrage manuel requis." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Pour démarrer manuellement:" -ForegroundColor Cyan
    Write-Host "   docker-compose -f docker-compose.traefik.yml -p traefik up -d"
    Write-Host "   docker-compose -p app up -d --build"
}

