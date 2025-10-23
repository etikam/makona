/**
 * Service d'authentification pour Makona Awards 2025
 * Gère l'inscription, connexion OTP et JWT
 */

import apiService from './api';

class AuthService {
  /**
   * Inscription d'un nouveau candidat
   */
  async register(userData) {
    try {
      const response = await apiService.post('/auth/register/', {
        email: userData.email,
        username: userData.email, // Utiliser l'email comme username
        first_name: userData.firstName,
        last_name: userData.lastName,
        phone: userData.phone,
        country: userData.country,
        user_type: 'candidate',
        password: userData.password,
        password_confirm: userData.passwordConfirm,
      });

      return {
        success: true,
        message: response.message,
        userId: response.user_id,
        email: response.email,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Demander un code OTP
   */
  async requestOTP(email) {
    try {
      const response = await apiService.post('/auth/otp/request/', { email });
      return {
        success: true,
        message: response.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Vérifier le code OTP et obtenir les tokens
   */
  async verifyOTP(email, code) {
    try {
      const response = await apiService.post('/auth/otp/verify/', {
        email,
        code,
      });

      // Stocker les tokens
      apiService.setToken(response.access);
      localStorage.setItem('refresh_token', response.refresh);

      return {
        success: true,
        message: response.message,
        user: response.user,
        accessToken: response.access,
        refreshToken: response.refresh,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Connexion avec email/mot de passe (authentification par session)
   */
  async login(email, password) {
    try {
      const response = await apiService.post('/auth/login/', {
        email,
        password,
      }, {
        includeAuth: false // Pas besoin d'authentification pour la connexion
      });

      // Stocker l'utilisateur et la session
      this.setStoredUser(response.user);
      
      // Pour l'authentification par session, on stocke juste l'utilisateur
      // Le cookie de session sera géré automatiquement par Django

      return {
        success: true,
        message: response.message || 'Connexion réussie',
        user: response.user,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Rafraîchir le token d'accès
   */
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiService.post('/auth/token/refresh/', {
        refresh: refreshToken,
      });

      apiService.setToken(response.access);
      return {
        success: true,
        accessToken: response.access,
      };
    } catch (error) {
      this.logout();
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Déconnexion
   */
  async logout() {
    try {
      // Appeler l'endpoint de déconnexion pour invalider la session
      await apiService.post('/auth/logout/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Nettoyer le stockage local
      localStorage.removeItem('user');
      // Pas besoin de clearToken() car on n'utilise plus JWT
    }
  }

  /**
   * Récupérer le profil utilisateur
   */
  async getProfile() {
    try {
      const response = await apiService.get('/auth/profile/');
      return {
        success: true,
        user: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Mettre à jour le profil utilisateur
   */
  async updateProfile(userData) {
    try {
      const response = await apiService.patch('/auth/profile/', userData);
      return {
        success: true,
        user: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Changer le mot de passe
   */
  async changePassword(oldPassword, newPassword, newPasswordConfirm) {
    try {
      const response = await apiService.post('/auth/password/change/', {
        old_password: oldPassword,
        new_password: newPassword,
        new_password_confirm: newPasswordConfirm,
      });
      return {
        success: true,
        message: response.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Vérifier si l'utilisateur est connecté
   */
  isAuthenticated() {
    const user = localStorage.getItem('user');
    return !!user;
  }

  /**
   * Récupérer l'utilisateur stocké
   */
  getStoredUser() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Stocker l'utilisateur
   */
  setStoredUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  /**
   * Générer un fingerprint de device
   */
  generateDeviceFingerprint() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Device fingerprint', 2, 2);

    const fingerprint = {
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      canvas: canvas.toDataURL(),
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
    };

    // Créer un hash simple
    const fingerprintString = JSON.stringify(fingerprint);
    let hash = 0;
    for (let i = 0; i < fingerprintString.length; i++) {
      const char = fingerprintString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convertir en 32-bit integer
    }

    return {
      hash: Math.abs(hash).toString(36),
      data: fingerprint,
    };
  }

  /**
   * Créer un fingerprint de device côté serveur
   */
  async createDeviceFingerprint() {
    try {
      const fingerprint = this.generateDeviceFingerprint();
      const response = await apiService.post('/auth/device/fingerprint/', {
        user_agent: fingerprint.data.userAgent,
        screen_resolution: fingerprint.data.screenResolution,
        timezone: fingerprint.data.timezone,
        language: fingerprint.data.language,
      });

      return {
        success: true,
        fingerprintId: response.fingerprint_id,
        fingerprintHash: response.fingerprint_hash,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

// Instance singleton
const authService = new AuthService();

export default authService;
