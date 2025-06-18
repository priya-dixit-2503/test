import { APP_CONFIG } from '../config/api.config';
import { jwtDecode } from 'jwt-decode';

export const tokenService = {
  getToken() {
    return localStorage.getItem(APP_CONFIG.TOKEN_STORAGE_KEY);
  },

  getRefreshToken() {
    return localStorage.getItem(APP_CONFIG.REFRESH_TOKEN_STORAGE_KEY);
  },

  setTokens(accessToken, refreshToken) {
    localStorage.setItem(APP_CONFIG.TOKEN_STORAGE_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(APP_CONFIG.REFRESH_TOKEN_STORAGE_KEY, refreshToken);
    }
  },

  removeTokens() {
    localStorage.removeItem(APP_CONFIG.TOKEN_STORAGE_KEY);
    localStorage.removeItem(APP_CONFIG.REFRESH_TOKEN_STORAGE_KEY);
  },

  isTokenValid(token) {
    if (!token) return false;
    
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch {
      return false;
    }
  },

  isAuthenticated() {
    const token = this.getToken();
    return this.isTokenValid(token);
  }
};
