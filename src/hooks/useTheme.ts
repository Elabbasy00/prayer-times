import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme, hs, vs, ms } from '../config/theme';
import { useUIStore } from '../store';

export const useTheme = () => {
  const systemColorScheme = useColorScheme();
  const { theme: storeTheme, language } = useUIStore();

  // Determine active theme mode
  const activeMode =
    storeTheme === 'system' ? systemColorScheme || 'light' : storeTheme;

  const baseTheme = activeMode === 'dark' ? darkTheme : lightTheme;

  // Determine RTL based on language
  const isRTL = language === 'ar';

  // RTL overrides
  const textAlign: 'left' | 'right' = isRTL ? 'right' : 'left';
  const flexDirection: 'row' | 'row-reverse' = isRTL ? 'row-reverse' : 'row';

  const fontFamily = isRTL
    ? {
        regular: 'Cairo-Regular',
        medium: 'Cairo-Medium',
        bold: 'Cairo-Bold',
      }
    : {
        regular: 'Poppins-Regular',
        medium: 'Poppins-Medium',
        bold: 'Poppins-Bold',
      };

  // Return theme with overridden typography and RTL info
  return {
    ...baseTheme,
    typography: {
      ...baseTheme.typography,
      fontFamily,
      fontWeight: isRTL
        ? {
            regular: '400',
            medium: '500',
            semibold: '600',
            bold: '700',
          }
        : baseTheme.typography.fontWeight,
    },
    isRTL,
    textAlign,
    flexDirection,
    // Helpers
    hs,
    vs,
    ms,
  };
};

export default useTheme;
