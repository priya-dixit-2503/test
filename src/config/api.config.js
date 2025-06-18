export const API_CONFIG = {
  BASE_URL: 'http://localhost:8000',
  API_URL: 'http://localhost:8000/api',
  ENDPOINTS: {
    LOGIN: '/login/',
    SIGNUP: '/signup/',
    REFRESH_TOKEN: '/token/refresh/',
    LOGOUT: '/logout/',
    PASSWORD_RESET: '/password/reset/',
    PASSWORD_RESET_CONFIRM: '/password/reset/confirm/',
    PASSWORD_CHANGE: '/password/change/',
    USER_PROFILE: '/profile/',
    IPO_LIST: '/ipos/',
    COMPANY_LIST: '/companies/',
  }
};

export const APP_CONFIG = {
  TOKEN_STORAGE_KEY: 'auth_token',
  REFRESH_TOKEN_STORAGE_KEY: 'refresh_token',
  USER_STORAGE_KEY: 'user_info',
};
