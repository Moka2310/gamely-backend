import { create } from 'zustand';
import { authAPI, setToken, removeToken, getToken } from '../services/api';

interface User {
  id: string;
  email: string;
  nickname: string;
  nickname_hidden?: string;
  age?: number;
  gender?: string;
  country?: string;
  console?: string;
  games?: string[];
  interests?: string[];
  looking_for?: string;
  photo?: string;
  bio?: string;
  profile_complete?: boolean;
  is_premium?: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, nickname: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  updateUser: (data: Partial<User>) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
  
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.login(email, password);
      await setToken(response.data.token);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    } catch (error: any) {
      const message = error.response?.data?.detail || 'Erreur de connexion';
      set({ error: message, isLoading: false });
      return false;
    }
  },
  
  register: async (email: string, password: string, nickname: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.register(email, password, nickname);
      await setToken(response.data.token);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    } catch (error: any) {
      const message = error.response?.data?.detail || "Erreur d'inscription";
      set({ error: message, isLoading: false });
      return false;
    }
  },
  
  logout: async () => {
    await removeToken();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
  
  checkAuth: async () => {
    const token = await getToken();
    if (!token) {
      set({ isLoading: false, isAuthenticated: false });
      return false;
    }
    
    try {
      const response = await authAPI.getMe();
      set({
        user: response.data,
        isAuthenticated: true,
        isLoading: false,
      });
      return true;
    } catch {
      await removeToken();
      set({ user: null, isAuthenticated: false, isLoading: false });
      return false;
    }
  },
  
  updateUser: (data: Partial<User>) => {
    const currentUser = get().user;
    if (currentUser) {
      set({ user: { ...currentUser, ...data } });
    }
  },
  
  clearError: () => set({ error: null }),
}));
