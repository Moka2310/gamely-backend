import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL || '';

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token storage helpers
const TOKEN_KEY = 'auth_token';

export const getToken = async (): Promise<string | null> => {
  try {
    if (Platform.OS === 'web') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = async (token: string): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    }
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

export const removeToken = async (): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      localStorage.removeItem(TOKEN_KEY);
    } else {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
  } catch (error) {
    console.error('Error removing token:', error);
  }
};

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (email: string, password: string, nickname: string) =>
    api.post('/auth/register', { email, password, nickname }),
  
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  getMe: () => api.get('/auth/me'),
  
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  
  resetPassword: (email: string, reset_code: string, new_password: string) =>
    api.post('/auth/reset-password', { email, reset_code, new_password }),
};

// Profile API
export const profileAPI = {
  update: (data: any) => api.put('/profile', data),
};

// Discover API
export const discoverAPI = {
  getProfiles: () => api.get('/discover'),
  swipe: (swiped_user_id: string, action: 'like' | 'dislike') =>
    api.post('/swipe', { swiped_user_id, action }),
};

// Matches API
export const matchesAPI = {
  getMatches: () => api.get('/matches'),
  deleteMatch: (matchId: string) => api.delete(`/matches/${matchId}`),
};

// Messages API
export const messagesAPI = {
  getMessages: (matchId: string) => api.get(`/messages/${matchId}`),
  sendMessage: (matchId: string, content: string) =>
    api.post(`/messages/${matchId}`, { content }),
};

// Block API
export const blockAPI = {
  blockUser: (userId: string) => api.post('/block', { user_id: userId }),
  unblockUser: (userId: string) => api.delete(`/block/${userId}`),
};

// Subscription API
export const subscriptionAPI = {
  getStatus: () => api.get('/subscription'),
  upgrade: () => api.post('/subscription/upgrade'),
  cancel: () => api.post('/subscription/cancel'),
};

export default api;
