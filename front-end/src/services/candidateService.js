/**
 * Service pour le profil candidat
 */
import apiService from './api';

class CandidateService {
  // Dashboard
  async getDashboard() {
    return await apiService.get('/candidate/dashboard/');
  }

  // Profil candidat
  async getProfile() {
    return await apiService.get('/candidate/profile/');
  }

  async updateProfile(data) {
    return await apiService.put('/candidate/profile/', data);
  }

  // Informations utilisateur
  async getUserProfile() {
    return await apiService.get('/candidate/user-profile/');
  }

  async updateUserProfile(data) {
    return await apiService.put('/candidate/user-profile/', data);
  }

  // Candidatures
  async getCandidatures() {
    return await apiService.get('/candidate/candidatures/');
  }

  async createCandidature(data) {
    return await apiService.post('/candidate/candidatures/', data);
  }

  // Catégories disponibles
  async getAvailableCategories() {
    return await apiService.get('/candidate/categories/');
  }

  // Changement de mot de passe
  async changePassword(data) {
    return await apiService.post('/candidate/change-password/', data);
  }

  // Statistiques
  async getStats() {
    return await apiService.get('/candidate/stats/');
  }

  // Upload de fichiers pour candidature
  async uploadCandidatureFile(candidatureId, fileData) {
    const formData = new FormData();
    formData.append('file', fileData.file);
    formData.append('file_type', fileData.file_type);
    if (fileData.description) {
      formData.append('description', fileData.description);
    }

    return await apiService.post(`/candidatures/${candidatureId}/files/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

export default new CandidateService();

