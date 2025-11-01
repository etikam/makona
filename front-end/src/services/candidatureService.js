/**
 * Service pour la gestion des candidatures
 * Gère l'upload de fichiers et la soumission de candidatures
 */

import apiService from './api';

class CandidatureService {
  /**
   * Récupérer toutes les candidatures approuvées (publique)
   */
  async getCandidatures(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters.category) {
        queryParams.append('category', filters.category);
      }
      if (filters.search) {
        queryParams.append('search', filters.search);
      }
      if (filters.ordering) {
        queryParams.append('ordering', filters.ordering);
      }

      const endpoint = `/candidatures/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiService.get(endpoint);
      
      return {
        success: true,
        candidatures: response.results || response,
        count: response.count,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Récupérer les détails d'une candidature
   */
  async getCandidatureDetail(candidatureId) {
    try {
      const response = await apiService.get(`/candidatures/${candidatureId}/`);
      return {
        success: true,
        candidature: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Récupérer les candidatures d'une catégorie
   */
  async getCandidaturesByCategory(categorySlug) {
    try {
      const response = await apiService.get(`/candidatures/by-category/${categorySlug}/`);
      return {
        success: true,
        candidatures: response.results || response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Récupérer les candidatures de l'utilisateur connecté
   */
  async getMyCandidatures() {
    try {
      const response = await apiService.get('/candidatures/my-candidatures/');
      return {
        success: true,
        candidatures: response.results || response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Soumettre une nouvelle candidature
   */
  async submitCandidature(candidatureData) {
    try {
      const formData = new FormData();
      
      // Ajouter les données de base
      formData.append('category', candidatureData.categoryId);
      
      // Ajouter les fichiers selon le format attendu par Django REST Framework
      // DRF attend les fichiers imbriqués dans un format spécifique
      if (candidatureData.files && candidatureData.files.length > 0) {
        candidatureData.files.forEach((fileData, index) => {
          // Pour chaque fichier, créer une entrée dans FormData avec le bon format
          // Format: files[index].file_type, files[index].file, etc.
          const prefix = `files[${index}]`;
          formData.append(`${prefix}.file_type`, fileData.type);
          formData.append(`${prefix}.file`, fileData.file);
          if (fileData.title) {
            formData.append(`${prefix}.title`, fileData.title);
          }
          formData.append(`${prefix}.order`, fileData.order !== undefined ? fileData.order : index);
        });
      }

      // Utiliser l'endpoint correct pour créer une candidature
      const response = await apiService.post('/candidatures/my-candidatures/', formData);
      
      return {
        success: true,
        candidature: response,
        message: 'Candidature soumise avec succès',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Mettre à jour une candidature existante
   */
  async updateCandidature(candidatureId, candidatureData) {
    try {
      const formData = new FormData();
      
      // Ajouter les nouveaux fichiers
      if (candidatureData.files && candidatureData.files.length > 0) {
        candidatureData.files.forEach((file, index) => {
          formData.append(`files[${index}].file_type`, file.type);
          formData.append(`files[${index}].file`, file.file);
          if (file.title) {
            formData.append(`files[${index}].title`, file.title);
          }
          if (file.order !== undefined) {
            formData.append(`files[${index}].order`, file.order);
          }
        });
      }

      const response = await apiService.uploadFile(`/candidatures/my-candidatures/${candidatureId}/`, formData, {
        method: 'PATCH',
      });
      
      return {
        success: true,
        candidature: response,
        message: 'Candidature mise à jour avec succès',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Supprimer une candidature
   */
  async deleteCandidature(candidatureId) {
    try {
      await apiService.delete(`/candidatures/my-candidatures/${candidatureId}/`);
      return {
        success: true,
        message: 'Candidature supprimée avec succès',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Valider les fichiers avant soumission
   */
  validateFiles(files, categoryRequirements) {
    const errors = [];
    const fileTypes = files.map(file => file.type);
    
    // Vérifier les fichiers requis
    if (categoryRequirements.requires_photo && !fileTypes.includes('photo')) {
      errors.push('Une photo est requise pour cette catégorie');
    }
    
    if (categoryRequirements.requires_video && !fileTypes.includes('video')) {
      errors.push('Une vidéo est requise pour cette catégorie');
    }
    
    if (categoryRequirements.requires_portfolio && !fileTypes.includes('portfolio')) {
      errors.push('Un portfolio est requis pour cette catégorie');
    }
    
    if (categoryRequirements.requires_audio && !fileTypes.includes('audio')) {
      errors.push('Un fichier audio est requis pour cette catégorie');
    }

    // Vérifier la taille des fichiers
    files.forEach((file, index) => {
      if (file.file && file.file.size > 10 * 1024 * 1024) { // 10MB
        errors.push(`Le fichier ${index + 1} dépasse la taille maximale de 10MB`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Préparer les données de fichier pour l'upload
   */
  prepareFileData(file, type, title = '', order = 0) {
    return {
      file,
      type,
      title,
      order,
    };
  }

  /**
   * Obtenir l'URL d'un fichier
   */
  getFileUrl(filePath) {
    if (!filePath) return null;
    
    // Si c'est déjà une URL complète
    if (filePath.startsWith('http')) {
      return filePath;
    }
    
    // Construire l'URL complète
    return `http://localhost:8000${filePath}`;
  }

  /**
   * Obtenir le type de fichier à partir de l'extension
   */
  getFileTypeFromExtension(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const videoExtensions = ['mp4', 'avi', 'mov'];
    const audioExtensions = ['mp3', 'wav'];
    const documentExtensions = ['pdf', 'doc', 'docx'];
    
    if (imageExtensions.includes(extension)) return 'photo';
    if (videoExtensions.includes(extension)) return 'video';
    if (audioExtensions.includes(extension)) return 'audio';
    if (documentExtensions.includes(extension)) return 'portfolio';
    
    return 'unknown';
  }

  /**
   * Formater la taille d'un fichier
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Instance singleton
const candidatureService = new CandidatureService();

export default candidatureService;
