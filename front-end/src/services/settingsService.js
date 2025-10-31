/**
 * Service pour les APIs des paramètres
 */
import apiService from './api';

class SettingsService {
  /**
   * Récupérer les paramètres publics
   */
  async getPublicSettings() {
    return await apiService.get('/settings/public/');
  }
  
  /**
   * Récupérer les paramètres (admin)
   */
  async getSettings() {
    return await apiService.get('/settings/admin/');
  }
  
  /**
   * Mettre à jour les paramètres (admin)
   */
  async updateSettings(settingsData) {
    return await apiService.put('/settings/admin/', settingsData);
  }
  
  /**
   * Mettre à jour partiellement les paramètres (admin)
   */
  async patchSettings(settingsData) {
    return await apiService.patch('/settings/admin/', settingsData);
  }
  
  /**
   * Récupérer les images actives du carousel (public)
   */
  async getActiveCarouselImages() {
    return await apiService.get('/settings/carousel/images/');
  }
  
  /**
   * Récupérer toutes les images du carousel (admin)
   */
  async getCarouselImages() {
    return await apiService.get('/settings/admin/carousel/');
  }
  
  /**
   * Créer une nouvelle image du carousel (admin)
   */
  async createCarouselImage(imageData) {
    return await apiService.post('/settings/admin/carousel/', imageData);
  }
  
  /**
   * Mettre à jour une image du carousel (admin)
   */
  async updateCarouselImage(imageId, imageData) {
    return await apiService.put(`/settings/admin/carousel/${imageId}/`, imageData);
  }
  
  /**
   * Mettre à jour partiellement une image du carousel (admin)
   */
  async patchCarouselImage(imageId, imageData) {
    return await apiService.patch(`/settings/admin/carousel/${imageId}/`, imageData);
  }
  
  /**
   * Supprimer une image du carousel (admin)
   */
  async deleteCarouselImage(imageId) {
    return await apiService.delete(`/settings/admin/carousel/${imageId}/`);
  }
  
  /**
   * Récupérer les membres de l'équipe (public)
   */
  async getTeamMembers(memberType = null) {
    const url = memberType 
      ? `/settings/team/?member_type=${memberType}`
      : '/settings/team/';
    return await apiService.get(url);
  }
  
  /**
   * Récupérer tous les membres de l'équipe (admin)
   */
  async getAllTeamMembers() {
    return await apiService.get('/settings/admin/team/');
  }
  
  /**
   * Créer un nouveau membre (admin)
   */
  async createTeamMember(memberData) {
    return await apiService.post('/settings/admin/team/', memberData);
  }
  
  /**
   * Mettre à jour un membre (admin)
   */
  async updateTeamMember(memberId, memberData) {
    return await apiService.put(`/settings/admin/team/${memberId}/`, memberData);
  }
  
  /**
   * Mettre à jour partiellement un membre (admin)
   */
  async patchTeamMember(memberId, memberData) {
    return await apiService.patch(`/settings/admin/team/${memberId}/`, memberData);
  }
  
  /**
   * Supprimer un membre (admin)
   */
  async deleteTeamMember(memberId) {
    return await apiService.delete(`/settings/admin/team/${memberId}/`);
  }
  
  /**
   * Récupérer le Hall of Fame (public)
   */
  async getHallOfFame(year = null, featured = null) {
    let url = '/settings/hall-of-fame/';
    const params = [];
    if (year) params.push(`year=${year}`);
    if (featured !== null) params.push(`featured=${featured}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    return await apiService.get(url);
  }
  
  /**
   * Récupérer toutes les entrées du Hall of Fame (admin)
   */
  async getAllHallOfFame() {
    return await apiService.get('/settings/admin/hall-of-fame/');
  }
  
  /**
   * Créer une nouvelle entrée Hall of Fame (admin)
   */
  async createHallOfFameEntry(entryData) {
    return await apiService.post('/settings/admin/hall-of-fame/', entryData);
  }
  
  /**
   * Mettre à jour une entrée Hall of Fame (admin)
   */
  async updateHallOfFameEntry(entryId, entryData) {
    return await apiService.put(`/settings/admin/hall-of-fame/${entryId}/`, entryData);
  }
  
  /**
   * Mettre à jour partiellement une entrée Hall of Fame (admin)
   */
  async patchHallOfFameEntry(entryId, entryData) {
    return await apiService.patch(`/settings/admin/hall-of-fame/${entryId}/`, entryData);
  }
  
  /**
   * Supprimer une entrée Hall of Fame (admin)
   */
  async deleteHallOfFameEntry(entryId) {
    return await apiService.delete(`/settings/admin/hall-of-fame/${entryId}/`);
  }
}

export default new SettingsService();


