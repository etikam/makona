#!/bin/bash
# Script de premier lancement - Makona Awards 2025
set -e

echo "🚀 Configuration et démarrage de Makona Awards 2025"
echo ""

# Vérifier si .env existe
if [ ! -f .env ]; then
    echo "📝 Création du fichier .env depuis env.example..."
    cp env.example .env
    echo "⚠️  IMPORTANT: Veuillez modifier le fichier .env avec vos valeurs de production"
    echo "   - SECRET_KEY: Générer une clé secrète Django"
    echo "   - POSTGRES_PASSWORD: Mot de passe sécurisé pour PostgreSQL"
    echo "   - EMAIL_HOST_PASSWORD: Mot de passe d'application Gmail"
    echo ""
    read -p "Appuyez sur Entrée une fois que vous avez modifié .env..."
fi

# Créer le réseau Docker s'il n'existe pas
if ! docker network ls | grep -q makona_network; then
    echo "📡 Création du réseau Docker makona_network..."
    docker network create makona_network
else
    echo "✅ Réseau makona_network existe déjà"
fi

# Démarrer Traefik avec un nom de projet séparé
echo ""
echo "🌐 Démarrage de Traefik..."
docker-compose -f docker-compose.traefik.yml -p traefik up -d

# Démarrer l'application avec un nom de projet spécifique
echo ""
echo "🐳 Démarrage de l'application..."
docker-compose -p app up -d --build

echo ""
echo "✅ Configuration terminée!"
echo ""
echo "📊 Statut des services:"
echo "Application:"
docker-compose -p app ps
echo ""
echo "Traefik:"
docker-compose -f docker-compose.traefik.yml -p traefik ps

echo ""
echo "📝 Logs (pour voir les logs en temps réel):"
echo "   Application: docker-compose -p app logs -f"
echo "   Traefik: docker-compose -f docker-compose.traefik.yml -p traefik logs -f"
echo ""
echo "🌐 Accès:"
echo "   Frontend: http://localhost"
echo "   API: http://localhost/api"
echo "   Dashboard Traefik: http://localhost:8080"
echo ""
