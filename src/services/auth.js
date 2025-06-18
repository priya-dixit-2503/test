import axios from 'axios';
import { API_CONFIG, APP_CONFIG } from '../config/api.config';

// Development mode flag - set to false when connecting to real backend
const DEV_MODE = false;

const MOCK_USER = {
  email: 'test@example.com',
  name: 'Test User'
};

const MOCK_TOKEN = 'mock-jwt-token';

const handleApiError = (error) => {
  console.error('API Error Details:', {
    error,
    message: error.message,
    stack: error.stack
  });

  if (!error.response) {
    // Network error
    if (!navigator.onLine) {
      throw new Error('Please check your internet connection');
    }
    if (DEV_MODE) {
      console.warn('Running in development mode without backend');
      return null;
    }
    throw new Error('Unable to connect to the server. Please try again later or contact support if the problem persists.');
  }
  throw error;
};

export const authService = {
  async login(email, password) {
    try {
      if (DEV_MODE) {
        console.warn('Using mock login in development mode');
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (email === 'test@example.com' && password === 'password') {
          localStorage.setItem('user', JSON.stringify(MOCK_USER));
          localStorage.setItem('token', MOCK_TOKEN);
          return { user: MOCK_USER, token: MOCK_TOKEN };
        }
        throw new Error('Invalid credentials');
      }      const response = await axios.post(
        `${API_CONFIG.API_URL}${API_CONFIG.ENDPOINTS.LOGIN}`,
        { email, password }
      );

      const { data } = response;
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('token', data.token);
      return data;
    } catch (error) {
      const result = handleApiError(error);
      if (result === null) return { user: MOCK_USER, token: MOCK_TOKEN };
      throw error;
    }
  },

  async signup(email, password) {
    try {
      if (DEV_MODE) {
        console.warn('Using mock signup in development mode');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (email && password) {
          return { message: 'Account created successfully' };
        }
        throw new Error('Invalid signup data');
      }      const response = await axios.post(
        `${API_CONFIG.API_URL}${API_CONFIG.ENDPOINTS.SIGNUP}`,
        { email, password }
      );

      const { data } = response;
      return data;
    } catch (error) {
      const result = handleApiError(error);
      if (result === null) return { message: 'Account created successfully' };
      throw error;
    }
  },

  async resetPassword(email) {
    try {
      if (DEV_MODE) {
        console.warn('Using mock password reset in development mode');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (email) {
          return { message: 'Password reset email sent' };
        }
        throw new Error('Invalid email');
      }      const response = await axios.post(
        `${API_CONFIG.API_URL}${API_CONFIG.ENDPOINTS.PASSWORD_RESET}`,
        { email }
      );

      const { data } = response;
      return data;
    } catch (error) {
      const result = handleApiError(error);
      if (result === null) return { message: 'Password reset email sent' };
      throw error;
    }
  },

  async confirmPasswordReset(uid, token, newPassword) {
    try {
      if (DEV_MODE) {
        console.warn('Using mock password reset confirm in development mode');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (uid && token && newPassword) {
          return { message: 'Password reset successfully' };
        }
        throw new Error('Invalid password reset data');
      }

      const response = await axios.post(
        `${API_CONFIG.API_URL}${API_CONFIG.ENDPOINTS.PASSWORD_RESET_CONFIRM}`,
        { uid, token, new_password: newPassword }
      );

      return response.data;
    } catch (error) {
      const result = handleApiError(error);
      if (result === null) return { message: 'Password reset successfully' };
      throw error;
    }
  },

  async changePassword(oldPassword, newPassword) {
    try {
      if (DEV_MODE) {
        console.warn('Using mock password change in development mode');
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { message: 'Password changed successfully' };
      }

      const response = await axios.post(
        `${API_CONFIG.API_URL}${API_CONFIG.ENDPOINTS.PASSWORD_CHANGE}`,
        { old_password: oldPassword, new_password: newPassword }
      );

      return response.data;
    } catch (error) {
      const result = handleApiError(error);
      if (result === null) return { message: 'Password changed successfully' };
      throw error;
    }
  },

  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem(APP_CONFIG.REFRESH_TOKEN_STORAGE_KEY);
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post(
        `${API_CONFIG.API_URL}${API_CONFIG.ENDPOINTS.REFRESH_TOKEN}`,
        { refresh: refreshToken }
      );

      const { access } = response.data;
      localStorage.setItem(APP_CONFIG.TOKEN_STORAGE_KEY, access);
      return access;
    } catch (error) {
      this.logout();
      throw error;
    }
  },

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
      if (!DEV_MODE) {
      fetch(`${API_CONFIG.API_URL}${API_CONFIG.ENDPOINTS.LOGOUT}`, {
        method: 'POST',
        credentials: 'include',
      }).catch(() => {
        // Ignore logout API errors
      });
    }
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  getAuthToken() {
    return localStorage.getItem('token');
  },
};
