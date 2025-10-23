# Plan Backend API REST - Makona Awards 2025

## Vue d'ensemble
Créer une API REST complète avec Django REST Framework pour la plateforme Makona Awards 2025, incluant l'authentification OTP, la gestion des candidatures avec fichiers spécifiques par catégorie, le système de vote, et un dashboard admin.

## Architecture des Modèles

### 1. Modèle User (base)
- Étendre `AbstractUser` de Django
- Champs : email (unique), nom, prénom, téléphone, pays (Guinée/Libéria/Sierra Leone)
- `is_verified` : bool pour validation OTP
- `user_type` : CharField (candidate, admin)
- `created_at`, `updated_at`

### 2. Modèle CandidateProfile
- `user` : OneToOneField vers User (limit_choices_to={'user_type': 'candidate'})
- `bio` : TextField
- `facebook_url`, `instagram_url`, `youtube_url`, `website_url` : URLField (optionnels)
- Pas de category ici car un candidat peut candidater dans plusieurs catégories

### 3. Modèle DeviceFingerprint (pour anonymiser les votes)
- `fingerprint_hash` : CharField (hash unique du device)
- `user_agent` : TextField
- `ip_address` : GenericIPAddressField
- `screen_resolution` : CharField
- `timezone` : CharField
- `language` : CharField
- `created_at` : datetime

### 4. Modèle Catégorie (Category)
- `name` : CharField (Danse, Musique, Slam & Poésie, Mode & Design, Humour, Innovation Tech, Entrepreneuriat Social, Média d'Impact)
- `slug` : SlugField (unique)
- `icon` : CharField (nom de l'icône Lucide)
- `description` : TextField
- `color_gradient` : CharField (ex: "from-purple-500 to-pink-500")
- `is_active` : bool
- Fichiers requis configurables :
  - `requires_photo` : bool
  - `requires_video` : bool
  - `requires_portfolio` : bool (pour Mode, Tech)
  - `requires_audio` : bool (pour Musique)
  - `max_video_duration` : int (en secondes, nullable)

### 5. Modèle Candidature (Candidature)
- `candidate` : ForeignKey vers User (limit_choices_to={'user_type': 'candidate'})
- `category` : ForeignKey vers Category
- `status` : CharField (pending, approved, rejected)
- `submitted_at` : datetime
- `reviewed_at` : datetime (nullable)
- `reviewed_by` : ForeignKey vers User (nullable, admin qui a validé, limit_choices_to={'user_type': 'admin'})
- `rejection_reason` : TextField (nullable, pour expliquer le rejet)
- Contrainte unique : (candidate, category) - un candidat ne peut postuler qu'une fois par catégorie

### 6. Modèle Fichiers Candidature (CandidatureFile)
- `candidature` : ForeignKey vers Candidature
- `file_type` : CharField (photo, video, portfolio, audio)
- `file` : FileField (avec upload_to dynamique selon type)
- `title` : CharField (optionnel, pour décrire le fichier)
- `order` : int (pour trier les fichiers)
- `uploaded_at` : datetime
- Validation : vérifier que le type de fichier correspond aux exigences de la catégorie

### 7. Modèle Vote (Vote)
- `device_fingerprint` : ForeignKey vers DeviceFingerprint
- `candidature` : ForeignKey vers Candidature
- `category` : ForeignKey vers Category (pour requêtes optimisées)
- `voted_at` : datetime
- `ip_address` : GenericIPAddressField
- Contrainte unique : (device_fingerprint, category) - un device ne peut voter qu'une fois par catégorie
- `is_valid` : bool (pour pouvoir invalider des votes si fraude détectée)

### 8. Modèle Configuration (SiteConfiguration)
- Singleton pattern (une seule instance)
- `voting_start_date` : datetime
- `voting_end_date` : datetime
- `candidature_start_date` : datetime
- `candidature_end_date` : datetime
- `ceremony_date` : datetime
- `results_published` : bool
- `site_maintenance` : bool

### 9. Modèle Lauréat (Winner)
- `candidature` : OneToOneField vers Candidature
- `category` : ForeignKey vers Category
- `edition` : CharField (ex: "2025")
- `announced_at` : datetime
- `votes_count` : int (snapshot du nombre de votes)

## Structure des Applications Django

### App: `accounts`
- Gestion utilisateurs, authentification OTP
- Models: User, CandidateProfile, DeviceFingerprint
- Endpoints: 
  - `POST /api/auth/request-otp/` (envoyer OTP par email)
  - `POST /api/auth/verify-otp/` (vérifier et obtenir JWT)
  - `POST /api/auth/refresh/` (refresh JWT token)
  - `GET /api/auth/me/` (profil utilisateur)
  - `PATCH /api/auth/me/` (mise à jour profil)
  - `POST /api/auth/register/` (inscription candidat)
  - `GET /api/devices/fingerprint/` (générer fingerprint device)

### App: `categories`
- Gestion des catégories
- Models: Category
- Endpoints:
  - `GET /api/categories/` (liste publique)
  - `GET /api/categories/{slug}/` (détail catégorie)

### App: `candidates`
- Gestion des candidatures et fichiers
- Models: Candidature, CandidatureFile
- Endpoints:
  - `POST /api/candidatures/submit/` (soumettre candidature)
  - `GET /api/candidatures/` (liste publique des candidatures approuvées)
  - `GET /api/candidatures/{id}/` (détail candidature)
  - `GET /api/candidatures/by-category/{category_slug}/` (candidatures par catégorie)
  - `GET /api/candidatures/my-candidatures/` (mes candidatures - authentifié)

### App: `votes`
- Système de vote anonyme
- Models: Vote
- Endpoints:
  - `POST /api/votes/` (voter pour une candidature - anonyme)
  - `GET /api/votes/stats/` (stats publiques si résultats publiés)
  - `GET /api/votes/check-device/{fingerprint}/` (vérifier si device a déjà voté)

### App: `dashboard`
- Admin dashboard API
- Utilise les modèles des autres apps
- Endpoints (protégés admin uniquement):
  - `GET /api/admin/candidatures/pending/` (candidatures en attente)
  - `PATCH /api/admin/candidatures/{id}/approve/`
  - `PATCH /api/admin/candidatures/{id}/reject/`
  - `GET /api/admin/votes/stats/` (stats détaillées)
  - `GET /api/admin/votes/by-category/`
  - `GET /api/admin/devices/stats/` (stats des devices uniques)
  - `POST /api/admin/winners/announce/` (annoncer les gagnants)
  - `GET /api/admin/config/` (configuration site)
  - `PATCH /api/admin/config/` (modifier config)

## Configuration Technique

### Dependencies à ajouter
- `djangorestframework`
- `djangorestframework-simplejwt` (JWT auth)
- `django-cors-headers` (CORS pour le front React)
- `pillow` (gestion images)
- `django-filter` (filtrage API)
- `drf-spectacular` (documentation OpenAPI/Swagger)
- `python-decouple` (variables d'environnement)
- `celery` + `redis` (optionnel, pour envoi emails async)

### Settings à configurer
- CORS_ALLOWED_ORIGINS (autoriser le front-end)
- REST_FRAMEWORK (pagination, auth, renderers)
- SIMPLE_JWT (durée tokens, refresh)
- MEDIA_ROOT et MEDIA_URL (upload fichiers)
- EMAIL_BACKEND (pour envoi OTP)
- Validation upload : taille max, types MIME autorisés

### Sécurité
- Rate limiting sur endpoints OTP (max 3 tentatives/heure)
- Validation rigoureuse des fichiers uploadés
- Permissions personnalisées (IsAdmin, IsOwner, etc.)
- CSRF exempt pour API mais JWT required
- Sanitization des données utilisateur

## Logique Métier Importante

### Validation Fichiers par Catégorie
- **Danse** : photo obligatoire, vidéo obligatoire (max 3 min)
- **Musique** : photo obligatoire, audio obligatoire, vidéo optionnelle
- **Slam & Poésie** : photo obligatoire, vidéo obligatoire (performance)
- **Mode & Design** : photo obligatoire (plusieurs), portfolio PDF optionnel
- **Humour** : photo obligatoire, vidéo obligatoire (sketch)
- **Innovation Tech** : photo obligatoire, vidéo démo obligatoire, portfolio optionnel
- **Entrepreneuriat Social** : photo obligatoire, vidéo pitch obligatoire, portfolio optionnel
- **Média d'Impact** : photo obligatoire, portfolio (articles/reportages) obligatoire

### Workflow Vote (Anonyme)
1. Frontend génère un fingerprint du device (User-Agent + Screen + Timezone + Language)
2. Hash le fingerprint côté client
3. Vérifier que la période de vote est active
4. Vérifier que la candidature est approuvée
5. Vérifier que ce device n'a pas déjà voté dans cette catégorie
6. Créer ou récupérer le DeviceFingerprint
7. Créer le Vote avec le fingerprint
8. Retourner confirmation

### Workflow Admin - Validation Candidature
1. Admin voit liste candidatures pending
2. Peut voir tous les fichiers uploadés
3. Approuve ou rejette avec raison (optionnel)
4. Email de notification au candidat
5. Si approuvé → candidature visible publiquement

### Workflow Inscription Candidat
1. Candidat s'inscrit avec email, nom, prénom, téléphone, pays
2. Système envoie OTP par email
3. Candidat vérifie OTP
4. Candidat complète son profil (bio, réseaux sociaux)
5. Candidat peut maintenant soumettre des candidatures

## Migration Front-end
- Remplacer localStorage par appels API
- Adapter AuthPage pour inscription candidats + OTP
- CategoryVoting : implémenter fingerprint device + vote anonyme
- Dashboard : récupérer vraies candidatures de l'utilisateur
- ResultsPage : afficher vrais résultats depuis API
- Ajouter page inscription candidats
- Modifier VotePage pour système anonyme

## Tests à implémenter
- Tests unitaires pour chaque modèle
- Tests API pour chaque endpoint
- Tests permissions (public, authenticated, admin)
- Tests validation fichiers
- Tests logique vote (unicité par device/catégorie)
- Tests fingerprint device (unicité, hash)
- Tests workflow candidature (un candidat = une candidature par catégorie)

## Tâches à réaliser

1. **Setup projet** - Installer les dépendances DRF et configurer settings.py
2. **Créer apps** - Créer les apps Django (accounts, categories, candidates, votes, dashboard)
3. **Modèles accounts** - Créer modèles User, CandidateProfile et DeviceFingerprint
4. **Modèles categories** - Créer modèle Category avec configuration fichiers requis
5. **Modèles candidates** - Créer modèles Candidature et CandidatureFile avec validations
6. **Modèles votes** - Créer modèle Vote avec contrainte unique (device_fingerprint, category)
7. **Modèles config** - Créer modèles SiteConfiguration et Winner
8. **Serializers** - Créer tous les serializers DRF pour chaque modèle
9. **Auth endpoints** - Implémenter endpoints authentification OTP, JWT et inscription candidats
10. **Categories endpoints** - Implémenter endpoints API catégories (lecture seule publique)
11. **Candidates endpoints** - Implémenter endpoints candidatures avec upload fichiers
12. **Votes endpoints** - Implémenter endpoints système de vote anonyme avec fingerprint
13. **Admin endpoints** - Implémenter endpoints dashboard admin
14. **Permissions** - Créer permissions personnalisées (IsAdmin, IsCandidate, etc.)
15. **Seed data** - Créer commande de management pour peupler les 8 catégories initiales
16. **Documentation** - Configurer drf-spectacular pour documentation API auto

---

*Plan créé le $(date) - Projet Makona Awards 2025*

