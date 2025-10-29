/**
 * Service API centralisé pour Makona Awards 2025
 * Gère tous les appels vers le backend Django REST Framework
 */

const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * Configure les headers par défaut
   */
  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };

    return headers;
  }

  /**
   * Gère les réponses API
   */
  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Gérer les erreurs de validation Django REST Framework
      if (errorData.non_field_errors && errorData.non_field_errors.length > 0) {
        throw new Error(errorData.non_field_errors[0]);
      }
      
      // Gérer les erreurs de champ spécifiques
      if (typeof errorData === 'object' && !errorData.detail && !errorData.message) {
        const fieldErrors = Object.values(errorData).flat();
        if (fieldErrors.length > 0) {
          throw new Error(fieldErrors[0]);
        }
      }
      
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
    const requestOptions = {
      method: 'POST',
      ...options,
    };

    // Si c'est FormData, ne pas stringify et laisser le navigateur gérer les headers
    if (data instanceof FormData) {
      requestOptions.body = data;
      // Ne pas définir Content-Type pour FormData, le navigateur le fera automatiquement
      if (requestOptions.headers) {
        delete requestOptions.headers['Content-Type'];
      }
    } else {
      requestOptions.body = JSON.stringify(data);
    }

    return this.request(endpoint, requestOptions);
  }

  async put(endpoint, data, options = {}) {
    const requestOptions = {
      method: 'PUT',
      ...options,
    };

    // Si c'est FormData, ne pas stringify et laisser le navigateur gérer les headers
    if (data instanceof FormData) {
      requestOptions.body = data;
      // Ne pas définir Content-Type pour FormData, le navigateur le fera automatiquement
      if (requestOptions.headers) {
        delete requestOptions.headers['Content-Type'];
      }
    } else {
      requestOptions.body = JSON.stringify(data);
    }

    return this.request(endpoint, requestOptions);
  }

  async patch(endpoint, data, options = {}) {
    const requestOptions = {
      method: 'PATCH',
      ...options,
    };

    // Si c'est FormData, ne pas stringify et laisser le navigateur gérer les headers
    if (data instanceof FormData) {
      requestOptions.body = data;
      // Ne pas définir Content-Type pour FormData, le navigateur le fera automatiquement
      if (requestOptions.headers) {
        delete requestOptions.headers['Content-Type'];
      }
    } else {
      requestOptions.body = JSON.stringify(data);
    }

    return this.request(endpoint, requestOptions);
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }

  /**
   * Upload de fichiers
   */
  async uploadFile(endpoint, formData, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.getHeaders(options.includeAuth !== false);

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
}

// Instance singleton
const apiService = new ApiService();

export default apiService;
