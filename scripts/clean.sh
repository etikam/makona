#!/bin/bash
# Script de nettoyage complet - Makona Awards 2025
# Supprime tous les conteneurs, images et volumes liés au projet
# Puis relance l'application avec start.sh

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🧹 Nettoyage complet de Makona Awards 2025"
echo ""

# Demander confirmation
read -p "⚠️  ATTENTION: Ce script va supprimer TOUS les conteneurs, images et volumes du projet. Continuer? (oui/non): " -r
if [[ ! $REPLY =~ ^[oO]ui$ ]]; then
    echo "Nettoyage annulé."
    exit 1
fi

echo ""
echo "🛑 Arrêt des projets Docker Compose..."

# Arrêter et supprimer les conteneurs de l'application
if docker-compose -p app ps -q 2>/dev/null | grep -q .; then
    echo "   Arrêt de l'application (projet: app)..."
    docker-compose -p app down -v 2>/dev/null || true
fi

# Arrêter et supprimer les conteneurs Traefik
if docker-compose -f docker-compose.traefik.yml -p traefik ps -q 2>/dev/null | grep -q .; then
    echo "   Arrêt de Traefik (projet: traefik)..."
    docker-compose -f docker-compose.traefik.yml -p traefik down -v 2>/dev/null || true
fi

echo ""
echo "🗑️  Suppression des conteneurs orphelins..."

# Supprimer tous les conteneurs makona_*
for container in $(docker ps -a --filter "name=makona_" --format "{{.Names}}" 2>/dev/null); do
    echo "   Suppression de $container..."
    docker rm -f "$container" 2>/dev/null || true
done

echo ""
echo "🖼️  Suppression des images..."

# Supprimer les images liées au projet (basées sur le contexte de build)
for image in $(docker images --format "{{.Repository}}:{{.Tag}}" | grep -E "(makona|app|backend|frontend)" 2>/dev/null); do
    echo "   Suppression de $image..."
    docker rmi -f "$image" 2>/dev/null || true
done

echo ""
echo "💾 Suppression des volumes..."

# Liste des volumes à supprimer
VOLUMES=(
    "makona_postgres_data"
    "makona_media"
    "makona_static"
    "makona_logs"
    "makona_traefik_letsencrypt"
    "makona_traefik_logs"
)

for volume in "${VOLUMES[@]}"; do
    if docker volume inspect "$volume" >/dev/null 2>&1; then
        echo "   Suppression du volume $volume..."
        docker volume rm "$volume" 2>/dev/null || true
    fi
done

# Supprimer aussi les volumes anonymes des projets
echo "   Nettoyage des volumes anonymes..."
docker volume prune -f >/dev/null 2>&1 || true

echo ""
echo "🌐 Préservation du réseau..."

# Le réseau est conservé (ne sera pas supprimé car utilisé par d'autres projets potentiellement)
echo "   Le réseau makona_network est conservé"

echo ""
echo -e "${GREEN}✅ Nettoyage terminé!${NC}"
echo ""
echo "🚀 Relance de l'application..."

# Relancer le script start.sh
if [ -f "scripts/start.sh" ]; then
    bash scripts/start.sh
elif [ -f "./start.sh" ]; then
    bash ./start.sh
else
    echo -e "${YELLOW}⚠️  Script start.sh introuvable. Démarrage manuel requis.${NC}"
    echo ""
    echo "Pour démarrer manuellement:"
    echo "   docker-compose -f docker-compose.traefik.yml -p traefik up -d"
    echo "   docker-compose -p app up -d --build"
fi

