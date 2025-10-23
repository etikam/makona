/**
 * Service API centralisé pour Makona Awards 2025
 * Gère tous les appels vers le backend Django REST Framework
 */

const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('access_token');
  }

  /**
   * Configure les headers par défaut
   */
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };

    // Pour l'authentification par session, on n'a pas besoin d'ajouter de headers
    // Django gère automatiquement les cookies de session
    // On garde cette méthode pour la compatibilité future si on revient à JWT

    return headers;
  }

  /**
   * Gère les réponses API
   */
  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || `HTTP ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    return response;
  }

  /**
   * Effectue une requête HTTP
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(options.includeAuth !== false),
      credentials: 'include', // Important pour les cookies de session
      ...options,
    };

    try {
      const response = await fetch(url, config);
      return await this.handleResponse(response);
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  /**
   * Méthodes HTTP
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    });
  }

  async patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
      ...options,
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }

  /**
   * Upload de fichiers
   */
  async uploadFile(endpoint, formData, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {};

    // Pour l'authentification par session, pas besoin d'Authorization header
    // Les cookies de session sont automatiquement inclus

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
        credentials: 'include', // Important pour les cookies de session
        ...options,
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error(`Upload Error [${endpoint}]:`, error);
      throw error;
    }
  }

  /**
   * Met à jour le token d'authentification
   */
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('access_token', token);
    } else {
      localStorage.removeItem('access_token');
    }
  }

  /**
   * Supprime le token d'authentification
   */
  clearToken() {
    this.token = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
}

// Instance singleton
const apiService = new ApiService();

export default apiService;
