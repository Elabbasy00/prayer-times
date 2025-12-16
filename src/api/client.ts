// src/api/client.ts
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '../utils/mmkv';
import type { User, RegisterDTO } from '../types/auth';
import type { Product, ProductFilters, ProductCreateDTO } from '../types/product';

// The original `const storage = new MMKV();` is replaced by the import `import storage from '../utils/mmkv';`

// Environment configuration
const ENV = {
  DEV: 'http://10.0.2.2:8000/api', // Android emulator
  LOCAL: 'http://localhost:8000/api', // iOS simulator
  STAGING: 'https://staging-api.yourdomain.com/api',
  PRODUCTION: 'https://api.yourdomain.com/api',
} as const;

const getBaseURL = (): string => {
  if (__DEV__) {
    return Platform.OS === 'android' ? ENV.DEV : ENV.LOCAL;
  }
  return ENV.PRODUCTION;
};

export const apiClient = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Platform': Platform.OS,
    'X-App-Version': '1.0.0',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  async config => {
    // Get access token from secure storage
    const accessToken = storage.getString('access_token');

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Add CSRF token for Django if needed
    const csrfToken = await AsyncStorage.getItem('csrf_token');
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }

    // Add request ID for tracking
    config.headers['X-Request-ID'] = Date.now().toString();

    return config;
  },
  error => Promise.reject(error),
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Extract and store CSRF token from Django
    const csrfToken = response.headers['x-csrftoken'];
    if (csrfToken) {
      AsyncStorage.setItem('csrf_token', csrfToken);
    }

    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh token logic for Django REST Framework
        const refreshToken = storage.getString('refresh_token');

        if (refreshToken) {
          const refreshResponse = await axios.post(
            `${getBaseURL()}/auth/refresh/`,
            { refresh: refreshToken },
          );

          const { access, refresh: newRefresh } = refreshResponse.data;

          // Update tokens
          storage.set('access_token', access);
          if (newRefresh) {
            storage.set('refresh_token', newRefresh);
          }

          // Retry original request
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${access}`,
          };

          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        storage.clearAll();
        // You can use a global event emitter to notify app
        return Promise.reject(refreshError);
      }
    }

    // Handle specific Django errors
    if (error.response?.data) {
      const djangoError = error.response.data as any;

      // Format Django validation errors
      if (djangoError.detail) {
        error.message = djangoError.detail;
      } else if (typeof djangoError === 'object') {
        // Flatten field errors
        const fieldErrors = Object.entries(djangoError)
          .map(
            ([field, messages]) =>
              `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages
              }`,
          )
          .join('\n');

        if (fieldErrors) {
          error.message = fieldErrors;
        }
      }
    }

    return Promise.reject(error);
  },
);

// API endpoints module
export const api = {
  auth: {
    login: (email: string, password: string) =>
      apiClient.post('/auth/login/', { email, password }),

    register: (data: RegisterDTO) => apiClient.post('/auth/register/', data),

    logout: () => apiClient.post('/auth/logout/'),

    verifyToken: () => apiClient.get('/auth/verify/'),
  },

  users: {
    getProfile: () => apiClient.get('/users/profile/'),
    updateProfile: (data: Partial<User>) =>
      apiClient.patch('/users/profile/', data),
    uploadAvatar: (formData: FormData) =>
      apiClient.post('/users/avatar/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
  },

  // Add your Django app endpoints
  products: {
    list: (params?: ProductFilters) => apiClient.get('/products/', { params }),
    create: (data: ProductCreateDTO) => apiClient.post('/products/', data),
    update: (id: number, data: Partial<Product>) =>
      apiClient.patch(`/products/${id}/`, data),
    delete: (id: number) => apiClient.delete(`/products/${id}/`),
  },
};
