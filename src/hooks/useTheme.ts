// src/hooks/useTheme.ts
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme, type Theme } from '../config/theme';

/**
 * Hook to get the current theme based on color scheme
 * @returns Current theme object
 */
export const useTheme = (): Theme => {
    const colorScheme = useColorScheme();
    return colorScheme === 'dark' ? darkTheme : lightTheme;
};

export default useTheme;
