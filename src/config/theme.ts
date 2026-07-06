// src/config/theme.ts
import { Dimensions } from 'react-native';
import { SPACING, BORDER_RADIUS } from './constants';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

/**
 * Scaled size based on screen width
 */
export const hs = (size: number) => (SCREEN_WIDTH / guidelineBaseWidth) * size;

/**
 * Scaled size based on screen height
 */
export const vs = (size: number) =>
  (SCREEN_HEIGHT / guidelineBaseHeight) * size;

/**
 * Moderate scale for sizes that shouldn't scale linearly (like font sizes or small padding)
 */
export const ms = (size: number, factor = 0.5) =>
  size + (hs(size) - size) * factor;

/**
 * Legacy normalize function for compatibility
 */
export function normalize(size: number) {
  return ms(size);
}

export const colors = {
  light: {
    // Primary colors
    primary: '#E5AF17',
    primaryDark: '#7C682F',
    primaryLight: '#EED5A0',
    accent: '#FFD700',

    // Secondary colors
    secondary: '#ff5900',
    secondaryDark: '#b73e00',
    secondaryLight: '#ff8a50',

    // Neutral colors
    background: '#222121',
    surface: '#FFFFFF',
    card: '#0f0b0bff',

    // Text colors
    text: '#E5AF17',
    textSecondary: '#7C682F',
    textTertiary: '#cbcacaff',
    textOnPrimary: '#FFFFFF',

    // Status colors
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',

    // Borders
    border: '#E0E0E0',
    divider: '#EED5A0',

    // Overlay
    overlay: 'rgba(0, 0, 0, 0.4)',
    shadow: '#000000',
  },
  dark: {
    // Primary colors
    primary: '#E5AF17',
    primaryDark: '#7C682F',
    primaryLight: '#EED5A0',
    accent: '#FFD700',

    // Secondary colors
    secondary: '#ff8a50',
    secondaryDark: '#ff5900',
    secondaryLight: '#ffb081',

    // Neutral colors
    background: '#121212',
    surface: '#1E1E1E',
    card: '#2C2C2E',

    // Text colors
    text: '#E5AF17',
    textSecondary: '#7C682F',
    textTertiary: '#78909C',
    textOnPrimary: '#FFFFFF',

    // Status colors
    success: '#66BB6A',
    warning: '#FFA726',
    error: '#EF5350',
    info: '#42A5F5',

    // Borders
    border: '#333333',
    divider: '#EED5A0',

    // Overlay
    overlay: 'rgba(0, 0, 0, 0.6)',
    shadow: '#000000',
  },
};

export const typography = {
  fontFamily: {
    regular: 'Poppins-Regular',
    medium: 'Poppins-Medium',
    bold: 'Poppins-Bold',
  },

  fontSize: {
    xs: ms(8),
    sm: ms(12),
    md: ms(18),
    lg: ms(24),
    xl: ms(32),
    xxl: ms(38),
    xxxl: ms(54),
    display: ms(70),
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const layout = {
  screenHeight: SCREEN_HEIGHT,
  screenWidth: SCREEN_WIDTH,
  isSmallDevice: SCREEN_WIDTH < 375,
  gutter: hs(16),
  containerPadding: hs(20),
  cardPadding: hs(16),
  headerHeight: vs(60),
};

export const spacing = {
  xs: hs(SPACING.xs),
  sm: hs(SPACING.sm),
  md: hs(SPACING.md),
  lg: hs(SPACING.lg),
  xl: hs(SPACING.xl),
  xxl: hs(SPACING.xxl),
};

export const borderRadius = BORDER_RADIUS;

export const shadows = {
  light: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 8,
    },
  },
  dark: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 3,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 6,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.5,
      shadowRadius: 16,
      elevation: 10,
    },
  },
};

export type Theme = {
  colors: typeof colors.light;
  typography: typeof typography;
  spacing: typeof spacing;
  layout: typeof layout;
  borderRadius: typeof borderRadius;
  shadows: typeof shadows.light;
  isRTL: boolean;
  textAlign: 'left' | 'right';
  flexDirection: 'row' | 'row-reverse';
};

export const lightTheme: Theme = {
  colors: colors.light,
  typography,
  spacing,
  layout,
  borderRadius,
  shadows: shadows.light,
  isRTL: false,
  textAlign: 'left',
  flexDirection: 'row',
};

export const darkTheme: Theme = {
  colors: colors.dark,
  typography,
  spacing,
  layout,
  borderRadius,
  shadows: shadows.dark,
  isRTL: false,
  textAlign: 'left',
  flexDirection: 'row',
};

export default {
  light: lightTheme,
  dark: darkTheme,
};
