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

# Démarrer les services
echo ""
echo "🐳 Démarrage des services Docker..."
docker-compose up -d --build

echo ""
echo "✅ Configuration terminée!"
echo ""
echo "📊 Statut des services:"
docker-compose ps

echo ""
echo "📝 Logs (pour voir les logs en temps réel):"
echo "   docker-compose logs -f"
echo ""
echo "🌐 Accès:"
echo "   Frontend: https://makona-awards.n-it.org"
echo "   API: https://atyapimakona.n-it.org"
echo ""
