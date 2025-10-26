# Scripts de Configuration de la Base de Données

Ce dossier contient des scripts pour configurer et peupler la base de données avec des données de démonstration.

## 📁 Fichiers disponibles

### 1. `create_categories.py`
Script Python standalone pour créer des catégories d'exemple.

**Usage:**
```bash
python manage.py shell < scripts/create_categories.py
```

### 2. `setup_demo_data.py`
Script complet pour configurer toutes les données de démonstration (catégories, utilisateurs, candidatures).

**Usage:**
```bash
python manage.py shell < scripts/setup_demo_data.py
```

## 🎯 Commandes Django Management

### Créer des catégories
```bash
# Créer toutes les catégories
python manage.py create_categories

# Créer seulement 5 catégories
python manage.py create_categories --count 5

# Supprimer toutes les catégories existantes et recréer
python manage.py create_categories --reset
```

### Créer des utilisateurs de test
```bash
# Créer 5 candidats et 2 admins
python manage.py create_test_users

# Créer 10 candidats et 3 admins
python manage.py create_test_users --candidates 10 --admins 3

# Supprimer tous les utilisateurs de test et recréer
python manage.py create_test_users --reset
```

## 📊 Données créées

### Catégories (12 au total)
- 🎵 **Musique** - Photo, Vidéo, Audio requis
- 💃 **Danse** - Photo, Vidéo, Portfolio requis
- 🎬 **Cinéma & Vidéo** - Photo, Vidéo, Portfolio requis
- 📸 **Photographie** - Photo, Portfolio requis
- 📚 **Littérature** - Photo, Audio, Portfolio requis
- 🎨 **Arts Visuels** - Photo, Vidéo, Portfolio requis
- 🎭 **Théâtre** - Photo, Vidéo, Portfolio requis
- 👗 **Mode & Design** - Photo, Vidéo, Portfolio requis
- 👨‍🍳 **Cuisine** - Photo, Vidéo requis
- 🏃‍♂️ **Sport & Fitness** - Photo, Vidéo requis
- 💻 **Technologie & Innovation** - Photo, Vidéo, Portfolio requis
- 🎓 **Éducation & Formation** - Tous les types requis

### Utilisateurs de test

#### Administrateurs
- `admin@test.com` / `admin123`
- `admin1@test.com` / `admin123`
- `admin2@test.com` / `admin123`

#### Candidats
- `candidat@test.com` / `candidat123`
- `candidat1@test.com` / `candidat123`
- `candidat2@test.com` / `candidat123`
- `candidat3@test.com` / `candidat123`
- `candidat4@test.com` / `candidat123`
- `candidat5@test.com` / `candidat123`

## 🚀 Démarrage rapide

Pour configurer rapidement l'application avec des données de test :

```bash
# 1. Activer l'environnement virtuel
# (selon votre configuration)

# 2. Installer les dépendances
pip install -r requirements.txt

# 3. Appliquer les migrations
python manage.py migrate

# 4. Créer un superutilisateur (optionnel)
python manage.py createsuperuser

# 5. Configurer les données de démonstration
python manage.py shell < scripts/setup_demo_data.py

# 6. Démarrer le serveur
python manage.py runserver

# 7. Démarrer le frontend (dans un autre terminal)
cd front-end
npm install
npm run dev
```

## 🔧 Personnalisation

### Modifier les catégories
Éditez le fichier `categories/management/commands/create_categories.py` pour :
- Ajouter de nouvelles catégories
- Modifier les types de fichiers requis
- Changer les durées maximales de vidéo
- Personnaliser les icônes et couleurs

### Modifier les utilisateurs de test
Éditez le fichier `categories/management/commands/create_test_users.py` pour :
- Ajouter de nouveaux candidats
- Modifier les profils candidats
- Changer les mots de passe par défaut
- Ajouter des administrateurs

## 📝 Notes importantes

- Les scripts utilisent `get_or_create()` pour éviter les doublons
- Les mots de passe par défaut sont : `admin123` et `candidat123`
- Tous les utilisateurs de test ont l'email vérifié par défaut
- Les candidats ont automatiquement un profil candidat créé
- Les catégories sont actives par défaut

## 🐛 Dépannage

### Erreur "Module not found"
Assurez-vous d'être dans le répertoire racine du projet et que l'environnement virtuel est activé.

### Erreur de base de données
Vérifiez que les migrations sont appliquées :
```bash
python manage.py migrate
```

### Erreur de permissions
Assurez-vous que l'utilisateur Django a les permissions nécessaires pour créer des objets dans la base de données.

