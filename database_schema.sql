-- ============================================================================
-- MAKONA AWARDS 2025 - BASE DE DONNÉES COMPLÈTE (MySQL)
-- ============================================================================
-- Création de la base de données et de toutes les tables
-- Version: 1.0 | Date: 2025
-- ============================================================================

-- Création de la base de données
CREATE DATABASE IF NOT EXISTS `makona_awards_2025` 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `makona_awards_2025`;

-- ============================================================================
-- TABLE: users (Utilisateurs)
-- ============================================================================
CREATE TABLE `users` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `password` VARCHAR(128) NOT NULL,
    `last_login` DATETIME(6) NULL,
    
    -- Champs de base
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `username` VARCHAR(150) NOT NULL UNIQUE,
    `first_name` VARCHAR(150) NOT NULL,
    `last_name` VARCHAR(150) NOT NULL,
    `phone` VARCHAR(20) NULL,
    
    -- Localisation
    `country` ENUM('Guinée', 'Libéria', 'Sierra Leone') NOT NULL DEFAULT 'Guinée',
    
    -- Statut et permissions
    `is_verified` BOOLEAN NOT NULL DEFAULT FALSE,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `is_staff` BOOLEAN NOT NULL DEFAULT FALSE,
    `is_superuser` BOOLEAN NOT NULL DEFAULT FALSE,
    
    -- Timestamps
    `date_joined` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    
    INDEX `idx_email` (`email`),
    INDEX `idx_country` (`country`),
    INDEX `idx_is_verified` (`is_verified`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Utilisateurs de la plateforme (votants et administrateurs)';


-- ============================================================================
-- TABLE: otp_codes (Codes OTP pour authentification)
-- ============================================================================
CREATE TABLE `otp_codes` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    
    -- Code OTP
    `code` CHAR(6) NOT NULL,
    
    -- Statut et validité
    `is_used` BOOLEAN NOT NULL DEFAULT FALSE,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `expires_at` DATETIME(6) NOT NULL,
    `used_at` DATETIME(6) NULL,
    
    -- Clés étrangères
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_code` (`code`),
    INDEX `idx_expires_at` (`expires_at`),
    INDEX `idx_is_used` (`is_used`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Codes OTP à usage unique pour authentification par email';


-- ============================================================================
-- TABLE: categories (Catégories de compétition)
-- ============================================================================
CREATE TABLE `categories` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    
    -- Informations de base
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(100) NOT NULL UNIQUE,
    `description` TEXT NOT NULL,
    `icon` VARCHAR(50) NOT NULL COMMENT 'Nom de l''icône Lucide React',
    `color_gradient` VARCHAR(100) NOT NULL COMMENT 'Classes Tailwind pour le gradient',
    
    -- Statut
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `display_order` INT NOT NULL DEFAULT 0,
    
    -- Configuration des fichiers requis
    `requires_photo` BOOLEAN NOT NULL DEFAULT TRUE,
    `photo_min_count` INT NOT NULL DEFAULT 1,
    `photo_max_count` INT NOT NULL DEFAULT 5,
    
    `requires_video` BOOLEAN NOT NULL DEFAULT FALSE,
    `video_required` BOOLEAN NOT NULL DEFAULT FALSE,
    `max_video_duration_seconds` INT NULL COMMENT 'Durée max en secondes, NULL = illimité',
    
    `requires_audio` BOOLEAN NOT NULL DEFAULT FALSE,
    `audio_required` BOOLEAN NOT NULL DEFAULT FALSE,
    `max_audio_duration_seconds` INT NULL,
    
    `requires_portfolio` BOOLEAN NOT NULL DEFAULT FALSE,
    `portfolio_required` BOOLEAN NOT NULL DEFAULT FALSE,
    `portfolio_file_types` VARCHAR(255) NULL COMMENT 'Types de fichiers acceptés séparés par virgule',
    
    -- Timestamps
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    
    INDEX `idx_slug` (`slug`),
    INDEX `idx_is_active` (`is_active`),
    INDEX `idx_display_order` (`display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Catégories de compétition avec configuration des fichiers requis';


-- ============================================================================
-- TABLE: candidates (Candidats aux awards)
-- ============================================================================
CREATE TABLE `candidates` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `category_id` BIGINT UNSIGNED NOT NULL,
    
    -- Informations personnelles
    `first_name` VARCHAR(100) NOT NULL,
    `last_name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(20) NOT NULL,
    `country` ENUM('Guinée', 'Libéria', 'Sierra Leone') NOT NULL,
    
    -- Biographie et présentation
    `bio` TEXT NOT NULL,
    `achievements` TEXT NULL COMMENT 'Réalisations principales',
    
    -- Réseaux sociaux (optionnels)
    `facebook_url` VARCHAR(255) NULL,
    `instagram_url` VARCHAR(255) NULL,
    `youtube_url` VARCHAR(255) NULL,
    `twitter_url` VARCHAR(255) NULL,
    `linkedin_url` VARCHAR(255) NULL,
    `website_url` VARCHAR(255) NULL,
    
    -- Statut de la candidature
    `status` ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    `rejection_reason` TEXT NULL,
    
    -- Métadonnées de validation
    `submitted_by_user_id` BIGINT UNSIGNED NULL COMMENT 'Utilisateur qui a soumis (si applicable)',
    `reviewed_by_user_id` BIGINT UNSIGNED NULL,
    `submitted_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `reviewed_at` DATETIME(6) NULL,
    
    -- Compteurs (dénormalisés pour performance)
    `votes_count` INT UNSIGNED NOT NULL DEFAULT 0,
    `views_count` INT UNSIGNED NOT NULL DEFAULT 0,
    
    -- Timestamps
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    
    -- Clés étrangères
    FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT,
    FOREIGN KEY (`submitted_by_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
    FOREIGN KEY (`reviewed_by_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
    
    INDEX `idx_category_id` (`category_id`),
    INDEX `idx_status` (`status`),
    INDEX `idx_country` (`country`),
    INDEX `idx_submitted_at` (`submitted_at`),
    INDEX `idx_votes_count` (`votes_count`),
    INDEX `idx_category_status` (`category_id`, `status`),
    INDEX `idx_candidates_category_status_votes` (`category_id`, `status`, `votes_count` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Candidats aux Makona Awards avec statut de validation';


-- ============================================================================
-- TABLE: candidate_files (Fichiers des candidats)
-- ============================================================================
CREATE TABLE `candidate_files` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `candidate_id` BIGINT UNSIGNED NOT NULL,
    
    -- Type et métadonnées du fichier
    `file_type` ENUM('photo', 'video', 'audio', 'portfolio', 'document') NOT NULL,
    `file_path` VARCHAR(500) NOT NULL COMMENT 'Chemin relatif dans MEDIA_ROOT',
    `file_name` VARCHAR(255) NOT NULL COMMENT 'Nom original du fichier',
    `file_size` BIGINT UNSIGNED NOT NULL COMMENT 'Taille en octets',
    `mime_type` VARCHAR(100) NOT NULL,
    
    -- Informations additionnelles
    `title` VARCHAR(255) NULL COMMENT 'Titre descriptif du fichier',
    `description` TEXT NULL,
    `duration_seconds` INT NULL COMMENT 'Durée pour vidéo/audio',
    
    -- Ordre d'affichage
    `display_order` INT NOT NULL DEFAULT 0,
    
    -- Validation et traitement
    `is_validated` BOOLEAN NOT NULL DEFAULT FALSE,
    `validation_notes` TEXT NULL,
    
    -- Métadonnées techniques (pour images)
    `width` INT NULL,
    `height` INT NULL,
    
    -- Timestamps
    `uploaded_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    
    -- Clés étrangères
    FOREIGN KEY (`candidate_id`) REFERENCES `candidates`(`id`) ON DELETE CASCADE,
    
    INDEX `idx_candidate_id` (`candidate_id`),
    INDEX `idx_file_type` (`file_type`),
    INDEX `idx_display_order` (`display_order`),
    INDEX `idx_candidate_type` (`candidate_id`, `file_type`),
    INDEX `idx_candidate_files_candidate_type_order` (`candidate_id`, `file_type`, `display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Fichiers multimédias des candidats (photos, vidéos, portfolios)';


-- ============================================================================
-- TABLE: votes (Votes des utilisateurs)
-- ============================================================================
CREATE TABLE `votes` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    `candidate_id` BIGINT UNSIGNED NOT NULL,
    `category_id` BIGINT UNSIGNED NOT NULL COMMENT 'Dénormalisé pour performance',
    
    -- Métadonnées du vote
    `ip_address` VARCHAR(45) NULL COMMENT 'IPv4 ou IPv6',
    `user_agent` VARCHAR(500) NULL,
    
    -- Validation
    `is_valid` BOOLEAN NOT NULL DEFAULT TRUE COMMENT 'Pour invalider en cas de fraude',
    `invalidation_reason` TEXT NULL,
    `invalidated_at` DATETIME(6) NULL,
    `invalidated_by_user_id` BIGINT UNSIGNED NULL,
    
    -- Timestamps
    `voted_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    
    -- Clés étrangères
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`candidate_id`) REFERENCES `candidates`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`invalidated_by_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
    
    -- Contrainte unique : un vote par utilisateur et par catégorie
    UNIQUE KEY `unique_user_category_vote` (`user_id`, `category_id`),
    
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_candidate_id` (`candidate_id`),
    INDEX `idx_category_id` (`category_id`),
    INDEX `idx_voted_at` (`voted_at`),
    INDEX `idx_is_valid` (`is_valid`),
    INDEX `idx_votes_user_category_valid` (`user_id`, `category_id`, `is_valid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Votes des utilisateurs - un vote par catégorie, modifiable';


-- ============================================================================
-- TABLE: winners (Lauréats/Gagnants)
-- ============================================================================
CREATE TABLE `winners` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `candidate_id` BIGINT UNSIGNED NOT NULL UNIQUE,
    `category_id` BIGINT UNSIGNED NOT NULL,
    
    -- Édition
    `edition_year` VARCHAR(4) NOT NULL DEFAULT '2025',
    
    -- Rang (1er, 2ème, 3ème)
    `rank` TINYINT UNSIGNED NOT NULL DEFAULT 1 COMMENT '1 = Premier, 2 = Deuxième, 3 = Troisième',
    
    -- Snapshot des statistiques au moment de l'annonce
    `votes_count` INT UNSIGNED NOT NULL,
    `percentage` DECIMAL(5,2) NULL COMMENT 'Pourcentage des votes',
    
    -- Métadonnées
    `announced_at` DATETIME(6) NOT NULL,
    `announced_by_user_id` BIGINT UNSIGNED NOT NULL,
    
    -- Informations supplémentaires
    `special_mention` TEXT NULL COMMENT 'Mention spéciale ou commentaire du jury',
    `prize_description` TEXT NULL,
    
    -- Timestamps
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    
    -- Clés étrangères
    FOREIGN KEY (`candidate_id`) REFERENCES `candidates`(`id`) ON DELETE RESTRICT,
    FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE RESTRICT,
    FOREIGN KEY (`announced_by_user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT,
    
    -- Contrainte unique : un seul gagnant de rang 1 par catégorie et édition
    UNIQUE KEY `unique_category_edition_rank` (`category_id`, `edition_year`, `rank`),
    
    INDEX `idx_category_id` (`category_id`),
    INDEX `idx_edition_year` (`edition_year`),
    INDEX `idx_rank` (`rank`),
    INDEX `idx_announced_at` (`announced_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Lauréats annoncés par catégorie et édition';


-- ============================================================================
-- TABLE: site_configuration (Configuration du site)
-- ============================================================================
CREATE TABLE `site_configuration` (
    `id` BIGINT UNSIGNED PRIMARY KEY DEFAULT 1,
    
    -- Dates de la compétition
    `candidature_start_date` DATETIME(6) NOT NULL,
    `candidature_end_date` DATETIME(6) NOT NULL,
    `voting_start_date` DATETIME(6) NOT NULL,
    `voting_end_date` DATETIME(6) NOT NULL,
    `ceremony_date` DATETIME(6) NOT NULL,
    
    -- Statuts globaux
    `results_published` BOOLEAN NOT NULL DEFAULT FALSE,
    `site_maintenance` BOOLEAN NOT NULL DEFAULT FALSE,
    `allow_candidatures` BOOLEAN NOT NULL DEFAULT TRUE,
    `allow_voting` BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Limites et restrictions
    `max_votes_per_user` INT NOT NULL DEFAULT 8 COMMENT 'Normalement 1 par catégorie = 8',
    `max_candidature_file_size_mb` INT NOT NULL DEFAULT 50,
    
    -- Messages personnalisables
    `maintenance_message` TEXT NULL,
    `welcome_message` TEXT NULL,
    `voting_closed_message` TEXT NULL,
    
    -- Edition courante
    `current_edition_year` VARCHAR(4) NOT NULL DEFAULT '2025',
    
    -- Timestamps
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    `updated_by_user_id` BIGINT UNSIGNED NULL,
    
    -- Clé étrangère
    FOREIGN KEY (`updated_by_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
    
    -- Contrainte pour singleton
    CHECK (`id` = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Configuration globale du site (singleton)';


-- ============================================================================
-- TABLE: activity_logs (Logs d'activité admin)
-- ============================================================================
CREATE TABLE `activity_logs` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NOT NULL,
    
    -- Action effectuée
    `action_type` ENUM(
        'candidate_approved', 
        'candidate_rejected',
        'winner_announced',
        'vote_invalidated',
        'config_updated',
        'category_updated',
        'user_promoted',
        'user_banned'
    ) NOT NULL,
    
    -- Contexte
    `entity_type` VARCHAR(50) NULL COMMENT 'Type d''entité concernée (candidate, vote, etc.)',
    `entity_id` BIGINT UNSIGNED NULL COMMENT 'ID de l''entité concernée',
    
    -- Détails
    `description` TEXT NOT NULL,
    `metadata` JSON NULL COMMENT 'Données additionnelles en JSON',
    
    -- Métadonnées de la requête
    `ip_address` VARCHAR(45) NULL,
    `user_agent` VARCHAR(500) NULL,
    
    -- Timestamp
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    
    -- Clé étrangère
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_action_type` (`action_type`),
    INDEX `idx_entity` (`entity_type`, `entity_id`),
    INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Logs des actions administratives pour traçabilité';


-- ============================================================================
-- TABLE: email_notifications (Notifications email)
-- ============================================================================
CREATE TABLE `email_notifications` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT UNSIGNED NULL,
    
    -- Type et destinataire
    `notification_type` ENUM(
        'otp_code',
        'candidature_received',
        'candidature_approved',
        'candidature_rejected',
        'vote_confirmation',
        'winner_announcement',
        'system_notification'
    ) NOT NULL,
    `recipient_email` VARCHAR(255) NOT NULL,
    
    -- Contenu
    `subject` VARCHAR(255) NOT NULL,
    `body_html` TEXT NULL,
    `body_text` TEXT NOT NULL,
    
    -- Statut d'envoi
    `status` ENUM('pending', 'sent', 'failed') NOT NULL DEFAULT 'pending',
    `sent_at` DATETIME(6) NULL,
    `error_message` TEXT NULL,
    `attempts` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    
    -- Timestamps
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    
    -- Clé étrangère
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
    
    INDEX `idx_user_id` (`user_id`),
    INDEX `idx_notification_type` (`notification_type`),
    INDEX `idx_status` (`status`),
    INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Historique des emails envoyés par la plateforme';


-- ============================================================================
-- TRIGGERS
-- ============================================================================

DELIMITER //

-- Trigger pour mettre à jour le compteur de votes après insertion
CREATE TRIGGER `after_vote_insert` 
AFTER INSERT ON `votes`
FOR EACH ROW
BEGIN
    IF NEW.is_valid = TRUE THEN
        UPDATE `candidates` 
        SET `votes_count` = `votes_count` + 1
        WHERE `id` = NEW.candidate_id;
    END IF;
END//

-- Trigger pour mettre à jour le compteur de votes après modification
CREATE TRIGGER `after_vote_update` 
AFTER UPDATE ON `votes`
FOR EACH ROW
BEGIN
    IF OLD.candidate_id != NEW.candidate_id OR OLD.is_valid != NEW.is_valid THEN
        IF OLD.is_valid = TRUE THEN
            UPDATE `candidates` 
            SET `votes_count` = `votes_count` - 1
            WHERE `id` = OLD.candidate_id;
        END IF;
        
        IF NEW.is_valid = TRUE THEN
            UPDATE `candidates` 
            SET `votes_count` = `votes_count` + 1
            WHERE `id` = NEW.candidate_id;
        END IF;
    END IF;
END//

-- Trigger pour mettre à jour le compteur de votes après suppression
CREATE TRIGGER `after_vote_delete` 
AFTER DELETE ON `votes`
FOR EACH ROW
BEGIN
    IF OLD.is_valid = TRUE THEN
        UPDATE `candidates` 
        SET `votes_count` = `votes_count` - 1
        WHERE `id` = OLD.candidate_id;
    END IF;
END//

DELIMITER ;


-- ============================================================================
-- VUES
-- ============================================================================

-- Vue des statistiques par catégorie
DROP VIEW IF EXISTS `v_category_stats`;
CREATE VIEW `v_category_stats` AS
SELECT 
    c.id AS category_id,
    c.name AS category_name,
    c.slug AS category_slug,
    COUNT(DISTINCT ca.id) AS total_candidates,
    COUNT(DISTINCT CASE WHEN ca.status = 'approved' THEN ca.id END) AS approved_candidates,
    COUNT(DISTINCT CASE WHEN ca.status = 'pending' THEN ca.id END) AS pending_candidates,
    COUNT(DISTINCT v.id) AS total_votes,
    COUNT(DISTINCT v.user_id) AS unique_voters
FROM `categories` c
LEFT JOIN `candidates` ca ON c.id = ca.category_id
LEFT JOIN `votes` v ON c.id = v.category_id AND v.is_valid = TRUE
GROUP BY c.id, c.name, c.slug;


-- Vue du classement des candidats
DROP VIEW IF EXISTS `v_candidates_ranking`;
CREATE VIEW `v_candidates_ranking` AS
SELECT 
    ca.id AS candidate_id,
    ca.first_name,
    ca.last_name,
    ca.category_id,
    c.name AS category_name,
    ca.country,
    ca.votes_count,
    RANK() OVER (PARTITION BY ca.category_id ORDER BY ca.votes_count DESC) AS category_rank,
    ROUND(ca.votes_count * 100.0 / NULLIF(cat_votes.total_votes, 0), 2) AS vote_percentage
FROM `candidates` ca
INNER JOIN `categories` c ON ca.category_id = c.id
LEFT JOIN (
    SELECT category_id, COUNT(*) AS total_votes
    FROM `votes`
    WHERE is_valid = TRUE
    GROUP BY category_id
) cat_votes ON ca.category_id = cat_votes.category_id
WHERE ca.status = 'approved';


-- ============================================================================
-- DONNÉES INITIALES
-- ============================================================================

-- Configuration initiale du site
INSERT INTO `site_configuration` (
    `id`,
    `candidature_start_date`,
    `candidature_end_date`,
    `voting_start_date`,
    `voting_end_date`,
    `ceremony_date`,
    `results_published`,
    `site_maintenance`,
    `current_edition_year`
) VALUES (
    1,
    '2025-10-01 00:00:00',
    '2025-12-15 23:59:59',
    '2025-12-16 00:00:00',
    '2025-12-27 23:59:59',
    '2025-12-28 18:00:00',
    FALSE,
    FALSE,
    '2025'
);


-- Insertion des 8 catégories initiales
INSERT INTO `categories` (
    `name`, `slug`, `description`, `icon`, `color_gradient`, `display_order`,
    `requires_photo`, `photo_min_count`, `photo_max_count`,
    `requires_video`, `video_required`, `max_video_duration_seconds`,
    `requires_audio`, `audio_required`, `max_audio_duration_seconds`,
    `requires_portfolio`, `portfolio_required`, `portfolio_file_types`
) VALUES
(
    'Danse',
    'danse',
    'Célébration du mouvement et de l''expression corporelle. Récompense les danseurs qui captivent par leur talent et leur créativité.',
    'Hand',
    'from-purple-500 to-pink-500',
    1,
    TRUE, 1, 5,
    TRUE, TRUE, 180,
    FALSE, FALSE, NULL,
    FALSE, FALSE, NULL
),
(
    'Musique',
    'musique',
    'Mélodies et rythmes qui font vibrer la région. Honore les artistes qui enchantent par leur voix et leurs compositions.',
    'Music',
    'from-blue-500 to-cyan-500',
    2,
    TRUE, 1, 5,
    FALSE, FALSE, 300,
    TRUE, TRUE, 300,
    FALSE, FALSE, NULL
),
(
    'Slam & Poésie',
    'slam-poesie',
    'L''art des mots et de l''éloquence mis en lumière. Célèbre les poètes et slammeurs qui touchent les cœurs.',
    'Mic',
    'from-orange-500 to-red-500',
    3,
    TRUE, 1, 3,
    TRUE, TRUE, 300,
    FALSE, FALSE, NULL,
    FALSE, FALSE, NULL
),
(
    'Mode & Design',
    'mode-design',
    'La créativité et le savoir-faire des stylistes locaux. Récompense l''innovation et l''esthétique dans la mode africaine.',
    'Shirt',
    'from-pink-500 to-rose-500',
    4,
    TRUE, 3, 10,
    FALSE, FALSE, 180,
    FALSE, FALSE, NULL,
    TRUE, FALSE, 'pdf,jpg,png'
),
(
    'Humour',
    'humour',
    'Les comédiens qui apportent la joie et le rire. Honore ceux qui utilisent l''humour pour divertir et sensibiliser.',
    'Smile',
    'from-yellow-500 to-amber-500',
    5,
    TRUE, 1, 3,
    TRUE, TRUE, 300,
    FALSE, FALSE, NULL,
    FALSE, FALSE, NULL
),
(
    'Innovation Tech',
    'innovation-tech',
    'Les esprits brillants qui construisent le futur. Célèbre les innovateurs technologiques de la région.',
    'Cpu',
    'from-green-500 to-emerald-500',
    6,
    TRUE, 1, 5,
    TRUE, TRUE, 300,
    FALSE, FALSE, NULL,
    TRUE, FALSE, 'pdf,pptx,docx'
),
(
    'Entrepreneuriat Social',
    'entrepreneuriat-social',
    'Les projets qui créent un impact positif durable. Récompense les entrepreneurs qui changent des vies.',
    'Users',
    'from-indigo-500 to-purple-500',
    7,
    TRUE, 1, 5,
    TRUE, TRUE, 300,
    FALSE, FALSE, NULL,
    TRUE, FALSE, 'pdf,pptx,docx'
),
(
    'Média d''Impact',
    'media-impact',
    'Le journalisme qui informe et inspire le changement. Honore les médias qui éclairent et transforment la société.',
    'Tv',
    'from-teal-500 to-cyan-500',
    8,
    TRUE, 1, 3,
    FALSE, FALSE, 600,
    FALSE, FALSE, NULL,
    TRUE, TRUE, 'pdf,docx,mp4'
);


-- ============================================================================
-- FIN DU SCRIPT
-- ============================================================================
-- Base de données Makona Awards 2025 créée avec succès !
-- Toutes les tables, triggers, vues et données initiales sont en place.
-- ============================================================================
