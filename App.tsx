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
import { usePrayerNotificationRuntime } from './src/hooks/usePrayerNotificationRuntime';

function App() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const [isReady, setIsReady] = useState(false);

  usePrayerNotificationRuntime();

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
    setIsReady(true);
    SplashScreen.hide();

    // }
  }, []);

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
