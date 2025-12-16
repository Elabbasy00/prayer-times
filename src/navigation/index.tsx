import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';

// Types
import type { RootStackParamList, TabParamList } from './types';

// Screens
import { HomeScreen, ProfileScreen, SettingsScreen } from '../screens';
import { LoginScreen, RegisterScreen } from '../screens/auth';
import {
  SearchScreen,
  CreateScreen,
  NotificationsScreen,
  HelpScreen,
  SplashScreen,
  CreatePostScreen,
  ImagePreviewScreen,
  FiltersScreen,
  VideoPlayerScreen,
  MapViewScreen,
  ActionSheetScreen,
} from '../screens';
import { ForgotPasswordScreen } from '../screens/auth';

// Components
import { CustomTabBar } from '../components/navigation/CustomTabBar';
import { CustomDrawerContent } from '../components/navigation/CustomDrawer';
import { Icon } from '../components/ui/Icon';

// Hooks
import { useAuthStore } from '../store/index';
import { navigationRef } from './RootNavigation';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const Drawer = createDrawerNavigator();

// Tab Navigator
function TabNavigator() {
  const theme = useColorScheme();

  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
          borderTopColor: theme === 'dark' ? '#333' : '#e0e0e0',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              name={focused ? 'home' : 'home-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              name={focused ? 'search' : 'search-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Create"
        component={CreateScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              name={focused ? 'add-circle' : 'add-circle-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              name={focused ? 'notifications' : 'notifications-outline'}
              size={size}
              color={color}
            />
          ),
          tabBarBadge: 3, // Example badge
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Icon
              name={focused ? 'person' : 'person-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Drawer Navigator
function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
        drawerStyle: {
          width: '80%',
        },
      }}
    >
      <Drawer.Screen name="MainTabs" component={TabNavigator} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="Help" component={HelpScreen} />
    </Drawer.Navigator>
  );
}

// Root Navigator
export default function RootNavigator() {
  const theme = useColorScheme();
  const { isAuthenticated = false, isLoading = false } = useAuthStore() || {};

  // Handle deep linking
  const linking = {
    prefixes: ['yourapp://', 'https://yourapp.com'],
    config: {
      screens: {
        // Auth Screens (Top Level in RootStackParamList)
        Login: 'login',
        Register: 'register',

        // Main App (Nested via MainDrawer)
        MainDrawer: {
          screens: {
            // Drawer Screens
            Settings: 'settings',

            // Tab Navigator (Nested via MainTabs)
            MainTabs: {
              screens: {
                Home: 'home',
                Profile: 'profile',
              },
            },
          },
        },
      },
    },
  };

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linking}
      theme={theme === 'dark' ? DarkTheme : DefaultTheme}
      onReady={() => {
        // Navigation is ready
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: {
            backgroundColor: theme === 'dark' ? '#000000' : '#ffffff',
          },
        }}
      >
        {/* {!isAuthenticated ? (
          // Auth Stack
          <Stack.Group>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                animationTypeForReplace: isAuthenticated ? 'push' : 'pop',
              }}
            />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
            />
          </Stack.Group>
        ) : ( */}
        {/* // Main App Stack */}
        <>
          <Stack.Screen
            name="MainDrawer"
            component={DrawerNavigator}
            options={{ headerShown: false }}
          />

          {/* Modal Screens */}
          <Stack.Group screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen name="CreatePost" component={CreatePostScreen} />
            <Stack.Screen
              name="ImagePreview"
              component={ImagePreviewScreen}
            />
            <Stack.Screen name="Filters" component={FiltersScreen} />
          </Stack.Group>

          {/* Full Screen Modal */}
          <Stack.Group screenOptions={{ presentation: 'fullScreenModal' }}>
            <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
            <Stack.Screen name="MapView" component={MapViewScreen} />
          </Stack.Group>

          {/* Transparent Modal */}
          <Stack.Group screenOptions={{ presentation: 'transparentModal' }}>
            <Stack.Screen name="ActionSheet" component={ActionSheetScreen} />
          </Stack.Group>
        </>
        {/* )} */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
