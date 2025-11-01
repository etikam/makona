/**
 * Service pour les APIs des catégories
 */
import apiService from './api';

class CategoryService {
  /**
   * Récupérer toutes les catégories
   */
  async getCategories() {
    return await apiService.get('/categories/');
  }
  
  /**
   * Récupérer une catégorie par ID (admin)
   */
  async getCategory(categoryId) {
    return await apiService.get(`/categories/admin/${categoryId}/`);
  }
  
  /**
   * Créer une nouvelle catégorie (admin)
   */
  async createCategory(categoryData) {
    return await apiService.post('/categories/admin/', categoryData);
  }
  
  /**
   * Mettre à jour une catégorie (admin)
   */
  async updateCategory(categoryId, categoryData) {
    return await apiService.put(`/categories/admin/${categoryId}/`, categoryData);
  }
  
  /**
   * Supprimer une catégorie (admin)
   */
  async deleteCategory(categoryId) {
    return await apiService.delete(`/categories/admin/${categoryId}/`);
  }
  
  /**
   * Récupérer les catégories actives
   */
  async getActiveCategories() {
    return await apiService.get('/categories/?is_active=true');
  }
  
  /**
   * Récupérer une catégorie par ID (public ou admin selon l'authentification)
   */
  async getCategoryById(categoryId) {
    try {
      // Essayer d'abord avec l'endpoint admin
      const response = await apiService.get(`/categories/admin/${categoryId}/`);
      return {
        success: true,
        category: response,
      };
    } catch (error) {
      // Si l'endpoint admin échoue, chercher dans les catégories actives
      try {
        const categories = await this.getActiveCategories();
        const category = Array.isArray(categories) 
          ? categories.find(cat => cat.id === parseInt(categoryId))
          : (categories.results || []).find(cat => cat.id === parseInt(categoryId));
        
        if (category) {
          return {
            success: true,
            category: category,
          };
        }
        
        return {
          success: false,
          error: 'Catégorie non trouvée',
        };
      } catch (err) {
        return {
          success: false,
          error: err.message || 'Erreur lors du chargement de la catégorie',
        };
      }
    }
  }

  /**
   * Récupérer les candidatures d'une catégorie
   */
  async getCategoryCandidatures(categoryId) {
    return await apiService.get(`/categories/${categoryId}/candidatures/`);
  }

  /**
   * Obtenir les exigences de fichiers d'une catégorie
   */
  getFileRequirements(category) {
    if (!category) return {};
    
    return {
      requires_photo: category.requires_photo || false,
      requires_video: category.requires_video || false,
      requires_portfolio: category.requires_portfolio || false,
      requires_audio: category.requires_audio || false,
      requires_documents: category.requires_documents || false,
      max_video_duration: category.max_video_duration || null,
      max_audio_duration: category.max_audio_duration || null,
    };
  }

  /**
   * Obtenir les types de fichiers requis d'une catégorie
   */
  getRequiredFileTypes(category) {
    if (!category) return [];
    
    const requiredTypes = [];
    if (category.requires_photo) requiredTypes.push('photo');
    if (category.requires_video) requiredTypes.push('video');
    if (category.requires_portfolio) requiredTypes.push('portfolio');
    if (category.requires_audio) requiredTypes.push('audio');
    
    return requiredTypes;
  }
}

export default new CategoryService();