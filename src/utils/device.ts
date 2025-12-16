// src/utils/device.ts
import { Dimensions, Platform, StatusBar } from 'react-native';

/**
 * Device utility functions
 */

// Get device dimensions
export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Platform checks
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

// Device type detection based on screen size
export const isSmallDevice = SCREEN_WIDTH < 375;
export const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414;
export const isLargeDevice = SCREEN_WIDTH >= 414;

// Tablet detection (simple heuristic)
export const isTablet = SCREEN_WIDTH >= 768;

// Get platform version
export const platformVersion = Platform.Version;

// Status bar height (for iOS)
export const STATUS_BAR_HEIGHT = Platform.select({
    ios: StatusBar.currentHeight ?? 44, // Default to 44 for iOS simulator
    android: StatusBar.currentHeight ?? 0,
    default: 0,
});

/**
 * Scale size based on screen width
 * Useful for responsive design
 */
export const scaleSize = (size: number, baseWidth: number = 375): number => {
    return (SCREEN_WIDTH / baseWidth) * size;
};

/**
 * Check if device has notch/dynamic island
 * Simple heuristic based on screen dimensions
 */
export const hasNotch = (): boolean => {
    if (!isIOS) return false;

    const dimen = Dimensions.get('window');
    return (
        (dimen.height === 812 || dimen.width === 812) || // iPhone X, XS, 11 Pro
        (dimen.height === 896 || dimen.width === 896) || // iPhone XR, XS Max, 11, 11 Pro Max
        (dimen.height === 844 || dimen.width === 844) || // iPhone 12, 12 Pro, 13, 13 Pro
        (dimen.height === 926 || dimen.width === 926) || // iPhone 12 Pro Max, 13 Pro Max, 14 Plus
        (dimen.height === 852 || dimen.width === 852) || // iPhone 14 Pro
        (dimen.height === 932 || dimen.width === 932)    // iPhone 14 Pro Max, 15 Pro Max
    );
};

export default {
    SCREEN_WIDTH,
    SCREEN_HEIGHT,
    isIOS,
    isAndroid,
    isSmallDevice,
    isMediumDevice,
    isLargeDevice,
    isTablet,
    platformVersion,
    STATUS_BAR_HEIGHT,
    scaleSize,
    hasNotch,
};
