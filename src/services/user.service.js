import axios from 'axios';
import { API_CONFIG } from '../config/api.config';
import { handleApiError } from '../utils/apiError';

export const userService = {
  async getUserProfile() {
    try {
      const response = await axios.get(
        `${API_CONFIG.API_URL}${API_CONFIG.ENDPOINTS.USER_PROFILE}`
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async updateUserProfile(data) {
    try {
      const response = await axios.put(
        `${API_CONFIG.API_URL}${API_CONFIG.ENDPOINTS.USER_PROFILE}`,
        data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async changePassword(oldPassword, newPassword) {
    try {
      const response = await axios.post(
        `${API_CONFIG.API_URL}${API_CONFIG.ENDPOINTS.PASSWORD_CHANGE}`,
        {
          old_password: oldPassword,
          new_password: newPassword
        }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};
