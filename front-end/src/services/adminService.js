/**
 * Service pour les APIs d'administration
 */
import apiService from './api';

class AdminService {
  // ===== GESTION DES UTILISATEURS =====
  
  /**
   * Récupérer tous les utilisateurs avec filtres
   */
  async getUsers(params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.user_type) queryParams.append('user_type', params.user_type);
    if (params.search) queryParams.append('search', params.search);
    if (params.is_verified !== undefined) queryParams.append('is_verified', params.is_verified);
    if (params.is_active !== undefined) queryParams.append('is_active', params.is_active);
    if (params.page) queryParams.append('page', params.page);
    if (params.page_size) queryParams.append('page_size', params.page_size);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/admin/accounts/users/?${queryString}` : '/admin/accounts/users/';
    
    return await apiService.get(endpoint);
  }
  
  /**
   * Récupérer un utilisateur par ID
   */
  async getUser(userId) {
    return await apiService.get(`/admin/accounts/users/${userId}/`);
  }
  
  /**
   * Créer un nouvel utilisateur
   */
  async createUser(userData) {
    return await apiService.post('/admin/accounts/users/', userData);
  }
  
  /**
   * Mettre à jour un utilisateur
   */
  async updateUser(userId, userData) {
    return await apiService.put(`/admin/accounts/users/${userId}/`, userData);
  }
  
  /**
   * Supprimer un utilisateur
   */
  async deleteUser(userId) {
    return await apiService.delete(`/admin/accounts/users/${userId}/`);
  }
  
  /**
   * Récupérer les candidatures d'un utilisateur
   */
  async getUserCandidatures(userId) {
    return await apiService.get(`/admin/accounts/users/${userId}/candidatures/`);
  }
  
  // ===== GESTION DES PROFILS CANDIDATS =====
  
  /**
   * Récupérer tous les profils candidats
   */
  async getCandidateProfiles(params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.search) queryParams.append('search', params.search);
    if (params.page) queryParams.append('page', params.page);
    if (params.page_size) queryParams.append('page_size', params.page_size);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/admin/accounts/candidate-profiles/?${queryString}` : '/admin/accounts/candidate-profiles/';
    
    return await apiService.get(endpoint);
  }
  
  /**
   * Récupérer un profil candidat par ID
   */
  async getCandidateProfile(profileId) {
    return await apiService.get(`/admin/accounts/candidate-profiles/${profileId}/`);
  }
  
  /**
   * Créer un profil candidat
   */
  async createCandidateProfile(profileData) {
    return await apiService.post('/admin/accounts/candidate-profiles/', profileData);
  }
  
  /**
   * Mettre à jour un profil candidat
   */
  async updateCandidateProfile(profileId, profileData) {
    return await apiService.put(`/admin/accounts/candidate-profiles/${profileId}/`, profileData);
  }
  
  /**
   * Supprimer un profil candidat
   */
  async deleteCandidateProfile(profileId) {
    return await apiService.delete(`/admin/accounts/candidate-profiles/${profileId}/`);
  }
  
  // ===== GESTION DES CANDIDATURES =====
  
  /**
   * Récupérer toutes les candidatures avec filtres
   */
  async getCandidatures(params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.status) queryParams.append('status', params.status);
    if (params.category) queryParams.append('category', params.category);
    if (params.candidate) queryParams.append('candidate', params.candidate);
    if (params.search) queryParams.append('search', params.search);
    if (params.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params.page) queryParams.append('page', params.page);
    if (params.page_size) queryParams.append('page_size', params.page_size);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/admin/candidates/candidatures/?${queryString}` : '/admin/candidates/candidatures/';
    
    return await apiService.get(endpoint);
  }
  
  /**
   * Récupérer une candidature par ID
   */
  async getCandidature(candidatureId) {
    return await apiService.get(`/admin/candidates/candidatures/${candidatureId}/`);
  }
  
  /**
   * Mettre à jour une candidature
   */
  async updateCandidature(candidatureId, candidatureData) {
    return await apiService.put(`/admin/candidates/candidatures/${candidatureId}/`, candidatureData);
  }
  
  /**
   * Créer une candidature
   */
  async createCandidature(candidatureData) {
    return await apiService.post('/admin/candidates/candidatures/', candidatureData);
  }
  
  /**
   * Supprimer une candidature
   */
  async deleteCandidature(candidatureId) {
    return await apiService.delete(`/admin/candidates/candidatures/${candidatureId}/`);
  }
  
  /**
   * Approuver une candidature
   */
  async approveCandidature(candidatureId) {
    return await apiService.post(`/admin/candidates/candidatures/${candidatureId}/approve/`);
  }
  
  /**
   * Rejeter une candidature
   */
  async rejectCandidature(candidatureId, rejectionReason) {
    return await apiService.post(`/admin/candidates/candidatures/${candidatureId}/reject/`, {
      rejection_reason: rejectionReason
    });
  }
  
  /**
   * Ajouter un fichier à une candidature
   */
  async addCandidatureFile(candidatureId, formData) {
    return await apiService.uploadFile(`/admin/candidates/candidatures/${candidatureId}/files/`, formData);
  }
  
  /**
   * Créer un profil candidat
   */
  async createCandidateProfile(userId, profileData) {
    return await apiService.post(`/admin/accounts/users/${userId}/candidate-profile/`, profileData);
  }
  
  // ===== GESTION DES FICHIERS DE CANDIDATURE =====
  
  /**
   * Récupérer les fichiers d'une candidature
   */
  async getCandidatureFiles(candidatureId) {
    return await apiService.get(`/admin/candidates/candidatures/${candidatureId}/files/`);
  }
  
  /**
   * Ajouter un fichier à une candidature
   */
  async addCandidatureFile(candidatureId, fileData) {
    return await apiService.post(`/admin/candidates/candidatures/${candidatureId}/files/`, fileData);
  }
  
  /**
   * Récupérer un fichier de candidature
   */
  async getCandidatureFile(candidatureId, fileId) {
    return await apiService.get(`/admin/candidates/candidatures/${candidatureId}/files/${fileId}/`);
  }
  
  /**
   * Mettre à jour un fichier de candidature
   */
  async updateCandidatureFile(candidatureId, fileId, fileData) {
    return await apiService.put(`/admin/candidates/candidatures/${candidatureId}/files/${fileId}/`, fileData);
  }
  
  /**
   * Supprimer un fichier de candidature
   */
  async deleteCandidatureFile(candidatureId, fileId) {
    return await apiService.delete(`/admin/candidates/candidatures/${candidatureId}/files/${fileId}/`);
  }
  
  // ===== STATISTIQUES =====
  
  /**
   * Récupérer les statistiques du dashboard
   */
  async getDashboardStats() {
    return await apiService.get('/admin/accounts/dashboard-stats/');
  }
  
  /**
   * Récupérer les statistiques des candidatures
   */
  async getCandidatureStats() {
    return await apiService.get('/admin/candidates/stats/');
  }
  
  // ===== UTILITAIRES =====
  
  /**
   * Exporter les données en CSV
   */
  async exportUsersCSV(params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.user_type) queryParams.append('user_type', params.user_type);
    if (params.search) queryParams.append('search', params.search);
    if (params.is_verified !== undefined) queryParams.append('is_verified', params.is_verified);
    if (params.is_active !== undefined) queryParams.append('is_active', params.is_active);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/admin/accounts/users/export/?${queryString}` : '/admin/accounts/users/export/';
    
    return await apiService.get(endpoint, { responseType: 'blob' });
  }
  
  /**
   * Exporter les candidatures en CSV
   */
  async exportCandidaturesCSV(params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.status) queryParams.append('status', params.status);
    if (params.category) queryParams.append('category', params.category);
    if (params.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/admin/candidates/candidatures/export/?${queryString}` : '/admin/candidates/candidatures/export/';
    
    return await apiService.get(endpoint, { responseType: 'blob' });
  }
}

export default new AdminService();
