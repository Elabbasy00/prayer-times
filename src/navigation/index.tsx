import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';

// Types
import type { RootStackParamList } from './types';

// Screens
import { PrayerHomeScreen, PrayerSettingsScreen } from '../screens';

// Components
import { Icon } from '../components/ui/Icon';
import { useUIStore } from '../store';
import { useTheme } from '../hooks/useTheme';
import { TouchableOpacity } from 'react-native';

import { navigationRef } from './RootNavigation';
import { getTranslatedName } from '../utils/formatters';
import { Language, TRANSLATIONS } from '../constants/translations';

const Stack = createNativeStackNavigator<RootStackParamList>();
// Root Navigator
export default function RootNavigator() {
  const theme = useColorScheme();
  const { language } = useUIStore();
  const { colors, typography } = useTheme();
  const t = TRANSLATIONS[language as Language] || TRANSLATIONS.en;
  // Handle deep linking
  const linking = {
    prefixes: ['yourapp://', 'https://yourapp.com'],
    config: {
      screens: {
        Home: 'home',
        settings: 'settings',
      },
    },
  };

  return (
    <NavigationContainer
      direction="rtl"
      ref={navigationRef}
      linking={linking}
      theme={theme === 'dark' ? DarkTheme : DefaultTheme}
      onReady={() => {
        // Navigation is ready
      }}
    >
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: theme === 'dark' ? '#fff' : colors.primary,
          headerTitleStyle: {
            fontFamily: typography.fontFamily.bold,
          },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="Home"
          component={PrayerHomeScreen}
          options={({ navigation }) => ({
            title: getTranslatedName(t, 'prayer-times'),
            headerTransparent: true,
            headerStyle: { backgroundColor: 'transparent' },

            headerRight: () => (
              <TouchableOpacity
                onPress={() => navigation.navigate('settings')}
                style={{ marginHorizontal: 10 }}
              >
                <Icon
                  name="settings"
                  size={24}
                  color={theme === 'dark' ? '#fff' : colors.primary}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="settings"
          component={PrayerSettingsScreen}
          options={{
            title: getTranslatedName(t, 'settings'),
            // Default back button will appear
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
