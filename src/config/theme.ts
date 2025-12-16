// src/config/theme.ts
import { SPACING, BORDER_RADIUS } from './constants';

/**
 * Theme configuration for light and dark modes
 */

export const colors = {
    light: {
        // Primary colors
        primary: '#007AFF',
        primaryDark: '#0051D5',
        primaryLight: '#4DA2FF',

        // Secondary colors
        secondary: '#5856D6',
        secondaryDark: '#3634A3',
        secondaryLight: '#8A89E8',

        // Neutral colors
        background: '#FFFFFF',
        surface: '#F2F2F7',
        card: '#FFFFFF',

        // Text colors
        text: '#000000',
        textSecondary: '#6C6C70',
        textTertiary: '#AEAEB2',

        // Status colors
        success: '#34C759',
        warning: '#FF9500',
        error: '#FF3B30',
        info: '#5AC8FA',

        // Borders
        border: '#E5E5EA',
        divider: '#C6C6C8',

        // Overlay
        overlay: 'rgba(0, 0, 0, 0.4)',

        // Shadows
        shadow: '#000000',
    },
    dark: {
        // Primary colors
        primary: '#0A84FF',
        primaryDark: '#0051D5',
        primaryLight: '#64B5FF',

        // Secondary colors
        secondary: '#5E5CE6',
        secondaryDark: '#3634A3',
        secondaryLight: '#9896F0',

        // Neutral colors
        background: '#000000',
        surface: '#1C1C1E',
        card: '#2C2C2E',

        // Text colors
        text: '#FFFFFF',
        textSecondary: '#EBEBF5',
        textTertiary: '#8E8E93',

        // Status colors
        success: '#30D158',
        warning: '#FF9F0A',
        error: '#FF453A',
        info: '#64D2FF',

        // Borders
        border: '#38383A',
        divider: '#48484A',

        // Overlay
        overlay: 'rgba(0, 0, 0, 0.6)',

        // Shadows
        shadow: '#000000',
    },
};

export const typography = {
    // Font families
    fontFamily: {
        regular: 'System',
        medium: 'System',
        bold: 'System',
        // Add custom fonts here after installation
        // regular: 'Inter-Regular',
        // medium: 'Inter-Medium',
        // bold: 'Inter-Bold',
    },

    // Font sizes
    fontSize: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        xxl: 24,
        xxxl: 32,
    },

    // Line heights
    lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
    },

    // Font weights
    fontWeight: {
        regular: '400' as const,
        medium: '500' as const,
        semibold: '600' as const,
        bold: '700' as const,
    },
};

export const spacing = SPACING;
export const borderRadius = BORDER_RADIUS;

export const shadows = {
    light: {
        sm: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
        },
        md: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        lg: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 5,
        },
    },
    dark: {
        sm: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
            elevation: 1,
        },
        md: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.4,
            shadowRadius: 4,
            elevation: 3,
        },
        lg: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.5,
            shadowRadius: 8,
            elevation: 5,
        },
    },
};

// Theme type
export type Theme = {
    colors: typeof colors.light;
    typography: typeof typography;
    spacing: typeof spacing;
    borderRadius: typeof borderRadius;
    shadows: typeof shadows.light;
};

// Create theme objects
export const lightTheme: Theme = {
    colors: colors.light,
    typography,
    spacing,
    borderRadius,
    shadows: shadows.light,
};

export const darkTheme: Theme = {
    colors: colors.dark,
    typography,
    spacing,
    borderRadius,
    shadows: shadows.dark,
};

export default {
    light: lightTheme,
    dark: darkTheme,
};
