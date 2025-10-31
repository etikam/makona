/**
 * Service API centralisé pour Makona Awards 2025
 * Gère tous les appels vers le backend Django REST Framework
 */

// Base URL configurable via Vite env var at build time
// Example: VITE_API_BASE_URL=https://atyapimakona.n-it.org/api
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  /**
   * Configure les headers par défaut
   */
  getHeaders(includeAuth = true, isFormData = false) {
    const headers = {};
    
    // Ne pas définir Content-Type pour FormData (le navigateur le fait automatiquement avec le boundary)
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    return headers;
  }

  /**
   * Gère les réponses API
   */
  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Créer un objet d'erreur enrichi avec les données de réponse
      const error = new Error(errorData.detail || errorData.message || `HTTP ${response.status}`);
      
      // Ajouter les données d'erreur pour un traitement ultérieur
      error.response = response;
      error.data = errorData;
      error.status = response.status;
      
      // Gérer les erreurs de validation Django REST Framework
      if (errorData.non_field_errors && errorData.non_field_errors.length > 0) {
        error.message = errorData.non_field_errors[0];
      }
      
      // Gérer les erreurs de champ spécifiques (Django REST Framework format)
      if (typeof errorData === 'object' && !errorData.detail && !errorData.message && !errorData.non_field_errors) {
        // Extraire toutes les erreurs de champs
        const fieldErrors = {};
        Object.keys(errorData).forEach(field => {
          if (Array.isArray(errorData[field])) {
            fieldErrors[field] = errorData[field];
          } else if (typeof errorData[field] === 'string' || typeof errorData[field] === 'object') {
            fieldErrors[field] = errorData[field];
          }
        });
        
        // Si on a des erreurs de champs, utiliser la première comme message principal
        const firstField = Object.keys(fieldErrors)[0];
        if (firstField && Array.isArray(fieldErrors[firstField])) {
          error.message = fieldErrors[firstField][0];
        } else if (firstField && typeof fieldErrors[firstField] === 'string') {
          error.message = fieldErrors[firstField];
        }
      }
      
      throw error;
    }

    // Gérer les réponses vides (204 No Content)
    if (response.status === 204) {
      // Pour les réponses 204 (No Content), il n'y a pas de contenu
      return null;
    }
    
    const contentType = response.headers.get('content-type');
    
    // Si c'est du JSON, essayer de parser
    if (contentType && contentType.includes('application/json')) {
      try {
        return await response.json();
      } catch (error) {
        // Si le parsing échoue (réponse vide), retourner null au lieu de lever une erreur
        console.warn('Impossible de parser la réponse JSON (réponse vide?):', error);
        return null;
      }
    }
    
    // Si ce n'est pas du JSON, essayer de récupérer le texte
    try {
      const text = await response.text();
      return text && text.trim() !== '' ? text : null;
    } catch (error) {
      // Si l'extraction du texte échoue, retourner null
      return null;
    }
  }

  /**
   * Effectue une requête HTTP
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const isFormData = options.body instanceof FormData;
    const config = {
      headers: this.getHeaders(options.includeAuth !== false, isFormData),
      credentials: 'include', // Important pour les cookies de session
      ...options,
    };
    
    // Supprimer Content-Type si FormData (le navigateur le définira avec le boundary)
    if (isFormData && config.headers && config.headers['Content-Type']) {
      delete config.headers['Content-Type'];
    }

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
