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
   * Récupérer les candidatures d'une catégorie
   */
  async getCategoryCandidatures(categoryId) {
    return await apiService.get(`/categories/${categoryId}/candidatures/`);
  }
}

export default new CategoryService();