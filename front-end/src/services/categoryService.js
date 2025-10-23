/**
 * Service pour la gestion des catégories
 * Récupère les catégories depuis l'API backend
 */

import apiService from './api';

class CategoryService {
  /**
   * Récupérer toutes les catégories actives
   */
  async getCategories() {
    try {
      const response = await apiService.get('/categories/');
      return {
        success: true,
        categories: response.results || response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Récupérer les détails d'une catégorie
   */
  async getCategoryDetail(slug) {
    try {
      const response = await apiService.get(`/categories/${slug}/`);
      return {
        success: true,
        category: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Récupérer les statistiques d'une catégorie
   */
  async getCategoryStats(slug) {
    try {
      const response = await apiService.get(`/categories/${slug}/stats/`);
      return {
        success: true,
        stats: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Transformer les catégories pour le frontend
   */
  transformCategoriesForFrontend(categories) {
    return categories.map(category => ({
      id: category.slug,
      name: category.name,
      slug: category.slug,
      icon: this.getIconComponent(category.icon),
      title: category.name,
      description: category.description,
      color: category.color_gradient,
      isActive: category.is_active,
      requirements: {
        photo: category.requires_photo,
        video: category.requires_video,
        portfolio: category.requires_portfolio,
        audio: category.requires_audio,
        maxVideoDuration: category.max_video_duration,
      },
      requiredFileTypes: category.required_file_types || [],
    }));
  }

  /**
   * Obtenir le composant d'icône à partir du nom
   */
  getIconComponent(iconName) {
    // Mapping des icônes Lucide
    const iconMap = {
      'Music': 'Music',
      'Hand': 'Hand',
      'Mic': 'Mic',
      'Shirt': 'Shirt',
      'Smile': 'Smile',
      'Cpu': 'Cpu',
      'Users': 'Users',
      'Tv': 'Tv',
      'GraduationCap': 'GraduationCap',
      'Briefcase': 'Briefcase',
      'Leaf': 'Leaf',
    };

    return iconMap[iconName] || 'Award';
  }

  /**
   * Obtenir les exigences de fichiers pour une catégorie
   */
  getFileRequirements(category) {
    return {
      photo: category.requires_photo || false,
      video: category.requires_video || false,
      portfolio: category.requires_portfolio || false,
      audio: category.requires_audio || false,
      maxVideoDuration: category.max_video_duration || null,
    };
  }

  /**
   * Vérifier si une catégorie accepte un type de fichier
   */
  acceptsFileType(category, fileType) {
    const requirements = this.getFileRequirements(category);
    return requirements[fileType] || false;
  }

  /**
   * Obtenir la liste des types de fichiers requis pour une catégorie
   */
  getRequiredFileTypes(category) {
    const requirements = this.getFileRequirements(category);
    return Object.keys(requirements).filter(type => requirements[type]);
  }

  /**
   * Valider les fichiers pour une catégorie
   */
  validateFilesForCategory(files, category) {
    const errors = [];
    const fileTypes = files.map(file => file.type);
    const requirements = this.getFileRequirements(category);

    // Vérifier les fichiers requis
    if (requirements.photo && !fileTypes.includes('photo')) {
      errors.push('Une photo est requise pour cette catégorie');
    }

    if (requirements.video && !fileTypes.includes('video')) {
      errors.push('Une vidéo est requise pour cette catégorie');
    }

    if (requirements.portfolio && !fileTypes.includes('portfolio')) {
      errors.push('Un portfolio est requis pour cette catégorie');
    }

    if (requirements.audio && !fileTypes.includes('audio')) {
      errors.push('Un fichier audio est requis pour cette catégorie');
    }

    // Vérifier la durée maximale des vidéos
    if (requirements.maxVideoDuration) {
      const videoFiles = files.filter(file => file.type === 'video');
      videoFiles.forEach((file, index) => {
        if (file.duration && file.duration > requirements.maxVideoDuration) {
          errors.push(
            `La vidéo ${index + 1} dépasse la durée maximale de ${requirements.maxVideoDuration} secondes`
          );
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Obtenir la description des exigences d'une catégorie
   */
  getRequirementsDescription(category) {
    const requirements = this.getFileRequirements(category);
    const descriptions = [];

    if (requirements.photo) {
      descriptions.push('Photo obligatoire');
    }

    if (requirements.video) {
      const duration = requirements.maxVideoDuration 
        ? ` (max ${Math.floor(requirements.maxVideoDuration / 60)} min)`
        : '';
      descriptions.push(`Vidéo obligatoire${duration}`);
    }

    if (requirements.portfolio) {
      descriptions.push('Portfolio obligatoire');
    }

    if (requirements.audio) {
      descriptions.push('Fichier audio obligatoire');
    }

    return descriptions.length > 0 
      ? descriptions.join(', ')
      : 'Aucune exigence particulière';
  }

  /**
   * Obtenir l'icône et la couleur pour l'affichage
   */
  getCategoryDisplayInfo(category) {
    return {
      icon: this.getIconComponent(category.icon),
      color: category.color_gradient,
      gradient: category.color_gradient,
    };
  }

  /**
   * Filtrer les catégories par statut
   */
  filterActiveCategories(categories) {
    return categories.filter(category => category.is_active);
  }

  /**
   * Trier les catégories par nom
   */
  sortCategoriesByName(categories) {
    return [...categories].sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Rechercher des catégories
   */
  searchCategories(categories, searchTerm) {
    if (!searchTerm) return categories;

    const term = searchTerm.toLowerCase();
    return categories.filter(category => 
      category.name.toLowerCase().includes(term) ||
      category.description.toLowerCase().includes(term)
    );
  }
}

// Instance singleton
const categoryService = new CategoryService();

export default categoryService;
