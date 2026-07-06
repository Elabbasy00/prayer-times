import React, { useEffect, useState } from 'react';
import { StatusBar, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SplashScreen from 'react-native-splash-screen';

// Navigation
import RootNavigator from './src/navigation';

// Components
import ErrorBoundary from './src/components/ErrorBoundary';

// Toast notifications
import Toast from 'react-native-toast-message';

import KeepAwake from '@sayem314/react-native-keep-awake';

function App() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [isReady, setIsReady] = useState(false);

  const loadLocales = async () => {
    try {
      // Dynamic import for Arabic locale
      await import('moment/locale/ar-sa' as any);
      return true;
    } catch (error) {
      return false;
    }
  };
  useEffect(() => {
    loadLocales();
  }, []);

  useEffect(() => {
    // if (hasHydratedPrayer && hasHydratedUI) {
    // Small timeout to ensure stores are fully ready for consumption
    // const timer = setTimeout(() => {
    setIsReady(true);
    SplashScreen.hide();
    // }, 100);
    // return () => clearTimeout(timer);
    // }
  }, []);

  // DO NOT render the main app structure until hydrated.
  // This prevents components from initializing with default values and
  // potentially triggering logic that overwrites the saved ones.
  if (!isReady) {
    return (
      <View
        style={{ flex: 1, backgroundColor: isDarkMode ? '#000000' : '#FFFFFF' }}
      >
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={isDarkMode ? '#000000' : '#FFFFFF'}
        />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor={isDarkMode ? '#000000' : '#FFFFFF'}
            hidden={true}
          />
          <RootNavigator />
          <Toast />
          <KeepAwake />
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
