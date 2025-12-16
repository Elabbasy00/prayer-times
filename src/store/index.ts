// src/store/index.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../api/client';
import storage from '../utils/mmkv';
import type { User, RegisterDTO } from '../types/auth';
import type { Notification } from '../types/ui';

// Create a storage adapter for Zustand
const zustandStorage = {
  setItem: (name: string, value: string) => {
    storage.set(name, value);
  },
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ?? null;
  },
  removeItem: (name: string) => {
    storage.delete(name);
  },
};

// Auth Store
interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterDTO) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await api.auth.login(email, password);
          const { user, access, refresh } = response.data;

          set({
            user,
            accessToken: access,
            refreshToken: refresh,
            isAuthenticated: true,
            isLoading: false,
          });

          // Store tokens in secure storage
          storage.set('access_token', access);
          if (refresh) {
            storage.set('refresh_token', refresh);
          }
        } catch (error: any) {
          set({
            error: error.message || 'Login failed',
            isAuthenticated: false,
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (data: RegisterDTO) => {
        set({ isLoading: true, error: null });

        try {
          const response = await api.auth.register(data);
          const { user, access, refresh } = response.data;

          set({
            user,
            accessToken: access,
            refreshToken: refresh,
            isAuthenticated: true,
            isLoading: false,
          });

          storage.set('access_token', access);
          if (refresh) {
            storage.set('refresh_token', refresh);
          }
        } catch (error: any) {
          set({
            error: error.message || 'Registration failed',
            isAuthenticated: false,
            isLoading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });

        try {
          await api.auth.logout();
        } catch (error) {
          // Silent fail on logout
        }

        // Clear all storage
        storage.clearAll();
        AsyncStorage.clear();

        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      setUser: (user: User) => {
        set({ user });
      },

      clearError: () => {
        set({ error: null });
      },

      refreshUser: async () => {
        try {
          const response = await api.users.getProfile();
          set({ user: response.data });
        } catch (error) {
          console.error('Failed to refresh user:', error);
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => zustandStorage),
      partialize: state => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

// UI Store
interface UIState {
  theme: 'light' | 'dark';
  language: string;
  isDrawerOpen: boolean;
  notifications: Notification[];
  unreadCount: number;

  // Actions
  toggleTheme: () => void;
  setLanguage: (lang: string) => void;
  toggleDrawer: () => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  clearNotifications: () => void;
}

export const useUIStore = create<UIState>(set => ({
  theme: 'light',
  language: 'en',
  isDrawerOpen: false,
  notifications: [],
  unreadCount: 0,

  toggleTheme: () => {
    set(state => ({
      theme: state.theme === 'light' ? 'dark' : 'light',
    }));
  },

  setLanguage: (lang: string) => {
    set({ language: lang });
  },

  toggleDrawer: () => {
    set(state => ({ isDrawerOpen: !state.isDrawerOpen }));
  },

  addNotification: (notification: Notification) => {
    set(state => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  markAsRead: (id: string) => {
    set(state => ({
      notifications: state.notifications.map(n =>
        n.id === id ? { ...n, read: true } : n,
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },

  clearNotifications: () => {
    set({ notifications: [], unreadCount: 0 });
  },
}));



// Selectors (Derived State)
export const useUserFullName = () =>
  useAuthStore(state =>
    state.user ? `${state.user.firstName} ${state.user.lastName}` : '',
  );

export const useUnreadNotifications = () =>
  useUIStore(state => state.notifications.filter(n => !n.read));

// Combined Store Hook
export const useStore = () => {
  const auth = useAuthStore();
  const ui = useUIStore();

  return {
    ...auth,
    ...ui,
  };
};
