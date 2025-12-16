// src/types/ui.ts

/**
 * Notification model
 */
export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
    createdAt: string;
    data?: Record<string, any>;
}

/**
 * Theme type
 */
export type ThemeMode = 'light' | 'dark' | 'auto';

/**
 * Language code
 */
export type LanguageCode = 'en' | 'ar' | 'fr' | 'es';

/**
 * Toast notification
 */
export interface ToastNotification {
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    duration?: number;
}
