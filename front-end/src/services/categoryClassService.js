/**
 * Service pour les APIs des classes de catégories
 */
import apiService from './api';

class CategoryClassService {
  /**
   * Récupérer toutes les classes de catégories actives
   */
  async getCategoryClasses() {
    return await apiService.get('/categories/classes/');
  }

  /**
   * Récupérer une classe de catégorie par slug
   */
  async getCategoryClass(slug) {
    return await apiService.get(`/categories/classes/${slug}/`);
  }

  /**
   * Récupérer toutes les classes de catégories (admin)
   */
  async getAdminCategoryClasses(params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.search) queryParams.append('search', params.search);
    if (params.is_active !== undefined) queryParams.append('is_active', params.is_active);
    if (params.page) queryParams.append('page', params.page);
    if (params.page_size) queryParams.append('page_size', params.page_size);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/categories/classes/admin/?${queryString}` : '/categories/classes/admin/';
    
    return await apiService.get(endpoint);
  }

  /**
   * Récupérer une classe de catégorie par ID (admin)
   */
  async getAdminCategoryClass(id) {
    return await apiService.get(`/categories/classes/admin/${id}/`);
  }

  /**
   * Créer une nouvelle classe de catégorie
   */
  async createCategoryClass(categoryClassData) {
    return await apiService.post('/categories/classes/admin/', categoryClassData);
  }

  /**
   * Mettre à jour une classe de catégorie
   */
  async updateCategoryClass(id, categoryClassData) {
    return await apiService.put(`/categories/classes/admin/${id}/`, categoryClassData);
  }

  /**
   * Supprimer une classe de catégorie
   */
  async deleteCategoryClass(id) {
    return await apiService.delete(`/categories/classes/admin/${id}/`);
  }

  /**
   * Activer/désactiver une classe de catégorie
   */
  async toggleCategoryClassStatus(slug) {
    return await apiService.post(`/categories/classes/admin/${slug}/toggle/`);
  }
}

export default new CategoryClassService();
