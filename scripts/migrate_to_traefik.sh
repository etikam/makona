#!/bin/bash
# Script de migration sécurisée vers docker-compose.traefik.yml
# Ce script préserve toutes les données en vérifiant les volumes avant la migration

set -e

echo "🔍 Migration sécurisée vers docker-compose.traefik.yml"
echo ""

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Vérifier que les volumes critiques existent
echo "📦 Vérification des volumes de données..."
VOLUMES_OK=true

VOLUMES=(
    "makona_postgres_data"
    "makona_media"
    "makona_static"
    "makona_logs"
)

for volume in "${VOLUMES[@]}"; do
    if docker volume inspect "$volume" >/dev/null 2>&1; then
        SIZE=$(docker volume inspect "$volume" --format '{{ .Mountpoint }}' | xargs du -sh 2>/dev/null | cut -f1 || echo "N/A")
        echo -e "${GREEN}✅${NC} Volume $volume existe (Taille: $SIZE)"
    else
        echo -e "${RED}❌${NC} Volume $volume n'existe pas!"
        VOLUMES_OK=false
    fi
done

echo ""

if [ "$VOLUMES_OK" = false ]; then
    echo -e "${RED}⚠️  ATTENTION: Certains volumes n'existent pas!${NC}"
    read -p "Voulez-vous continuer malgré tout? (oui/non): " -r
    if [[ ! $REPLY =~ ^[oO]ui$ ]]; then
        echo "Migration annulée."
        exit 1
    fi
fi

# Sauvegarder l'état actuel des conteneurs
echo "📸 État actuel des conteneurs:"
docker-compose -p app ps 2>/dev/null || docker ps --filter "name=makona_" --format "table {{.Names}}\t{{.Status}}"

echo ""
read -p "Appuyez sur Entrée pour continuer avec la migration..."

# Arrêter proprement les conteneurs existants
echo ""
echo "🛑 Arrêt des conteneurs existants..."
docker-compose -p app down 2>/dev/null || true

# Si docker-compose down ne fonctionne pas, arrêter manuellement
for container in makona_backend makona_frontend makona_db; do
    if docker ps -a --format '{{.Names}}' | grep -q "^${container}$"; then
        echo "   Arrêt de $container..."
        docker stop "$container" 2>/dev/null || true
    fi
done

# Vérifier à nouveau les volumes après l'arrêt
echo ""
echo "🔍 Vérification finale des volumes (après arrêt)..."
for volume in "${VOLUMES[@]}"; do
    if docker volume inspect "$volume" >/dev/null 2>&1; then
        echo -e "${GREEN}✅${NC} Volume $volume toujours présent"
    fi
done

# Démarrer Traefik avec un nom de projet séparé
echo ""
echo "🌐 Démarrage de Traefik..."
docker-compose -f docker-compose.traefik.yml -p traefik up -d

# Attendre un peu pour que Traefik démarre
sleep 2

# Démarrer les services avec docker-compose.yml (qui utilise Traefik)
echo ""
echo "🚀 Démarrage des services applicatifs..."
docker-compose -p app up -d

echo ""
echo -e "${GREEN}✅ Migration terminée avec succès!${NC}"
echo ""
echo "📊 Statut des services:"
echo "Application:"
docker-compose -p app ps
echo ""
echo "Traefik:"
docker-compose -f docker-compose.traefik.yml -p traefik ps

echo ""
echo "🔍 Vérification finale des volumes:"
for volume in "${VOLUMES[@]}"; do
    if docker volume inspect "$volume" >/dev/null 2>&1; then
        echo -e "${GREEN}✅${NC} Volume $volume OK"
    else
        echo -e "${RED}❌${NC} Volume $volume MANQUANT!"
    fi
done

echo ""
echo "📝 Pour voir les logs:"
echo "   Application: docker-compose -p app logs -f"
echo "   Traefik: docker-compose -f docker-compose.traefik.yml -p traefik logs -f"
echo ""

