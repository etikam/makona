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
    // Si il y a une photo de profil, utiliser FormData
    if (data.profile_picture) {
      const formData = new FormData();
      
      // Ajouter les champs texte
      formData.append('first_name', data.first_name || '');
      formData.append('last_name', data.last_name || '');
      formData.append('phone', data.phone || '');
      formData.append('country', data.country || '');
      
      // Ajouter le fichier
      formData.append('profile_picture', data.profile_picture);
      
      return await apiService.put('/candidate/user-profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    } else {
      // Si pas de fichier, envoyer en JSON normal
      const { profile_picture, ...jsonData } = data;
      return await apiService.put('/candidate/user-profile/', jsonData);
    }
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

  // Mise à jour d'une candidature
  async updateCandidature(candidatureId, data) {
    const formData = new FormData();
    
    // Ajouter la description
    formData.append('description', data.description);
    
    // Ajouter les nouveaux fichiers
    Object.entries(data.files).forEach(([fileType, files]) => {
      files.forEach((file, index) => {
        if (file instanceof File) {
          formData.append(`${fileType}_files`, file);
        }
      });
    });
    
    return await apiService.put(`/candidatures/my-candidatures/${candidatureId}/update/`, formData);
  }
}

export default new CandidateService();

