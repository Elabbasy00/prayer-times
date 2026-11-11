// src/store/index.ts
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { zustandStorage } from '../utils/mmkv';

import type { Notification } from '../types/ui';

// UI Store
interface UIState {
  theme: 'light' | 'dark' | 'system';
  language: string;
  isDrawerOpen: boolean;
  notifications: Notification[];
  unreadCount: number;
  // _hasHydrated: boolean;

  // Actions
  // setHasHydrated: (val: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;
  setLanguage: (lang: string) => void;
  toggleDrawer: () => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  clearNotifications: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      language: 'en',
      isDrawerOpen: false,
      notifications: [],
      unreadCount: 0,
      _hasHydrated: false,

      // setHasHydrated: val => set({ _hasHydrated: val }),
      setTheme: theme => set({ theme }),

      toggleTheme: () => {
        set(state => {
          const next = state.theme === 'light' ? 'dark' : 'light';
          return { theme: next };
        });
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
    }),
    {
      name: 'ui-storage',
      storage: createJSONStorage(() => zustandStorage),
      version: 1,
      // onRehydrateStorage: () => state => {
      //   state?.setHasHydrated(true);
      // },
    },
  ),
);

export const useUnreadNotifications = () =>
  useUIStore(state => state.notifications.filter(n => !n.read));

// Combined Store Hook
export const useStore = () => {
  const ui = useUIStore();

  return {
    ...ui,
  };
};
