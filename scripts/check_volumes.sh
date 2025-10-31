#!/bin/bash
# Script de vérification des volumes et de la base de données

echo "🔍 Vérification de la persistance des données"
echo ""

# Vérifier les volumes
echo "📦 Volumes Docker:"
docker volume ls | grep makona
echo ""

# Vérifier le volume PostgreSQL
if docker volume inspect makona_postgres_data >/dev/null 2>&1; then
    echo "✅ Volume PostgreSQL existe"
    VOLUME_PATH=$(docker volume inspect makona_postgres_data --format '{{ .Mountpoint }}')
    echo "   Chemin: $VOLUME_PATH"
    
    # Vérifier la taille du volume
    if [ -d "$VOLUME_PATH" ]; then
        SIZE=$(du -sh "$VOLUME_PATH" 2>/dev/null | cut -f1)
        echo "   Taille: $SIZE"
    fi
else
    echo "❌ Volume PostgreSQL N'EXISTE PAS!"
fi
echo ""

# Vérifier si le conteneur est en cours d'exécution
if docker ps --filter "name=makona_db" --format "{{.Names}}" | grep -q makona_db; then
    echo "✅ Conteneur PostgreSQL en cours d'exécution"
    
    # Vérifier les volumes montés dans le conteneur
    echo "📋 Volumes montés dans le conteneur:"
    docker inspect makona_db --format '{{range .Mounts}}{{.Source}} -> {{.Destination}}{{"\n"}}{{end}}' | grep postgres
    echo ""
    
    # Vérifier la base de données
    echo "🔍 Vérification de la base de données..."
    docker exec makona_db psql -U ${POSTGRES_USER:-postgres} -d ${POSTGRES_DB:-makona_db} -c "\dt" 2>/dev/null | head -20
    echo ""
    
    # Compter les tables
    TABLE_COUNT=$(docker exec makona_db psql -U ${POSTGRES_USER:-postgres} -d ${POSTGRES_DB:-makona_db} -t -c "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null | tr -d ' ')
    echo "📊 Nombre de tables: $TABLE_COUNT"
    echo ""
else
    echo "⚠️  Conteneur PostgreSQL n'est pas en cours d'exécution"
    echo "   Démarrez-le avec: docker-compose -p app up -d db"
fi

echo ""
echo "💡 Conseil: Si les données disparaissent, vérifiez que vous n'utilisez pas 'down -v'"
echo "   Utilisez 'down' (sans -v) pour préserver les volumes"

