// src/config/env.ts
import { Platform } from 'react-native';

/**
 * Environment configuration
 * 
 * If using react-native-config, uncomment the import below:
 * import Config from 'react-native-config';
 * 
 * For now, this uses fallback values for development
 */

// Fallback environment variables (can be replaced with react-native-config)
const ENV_VARS = {
  APP_NAME: 'MobileStarter',
  APP_ENV: __DEV__ ? 'development' : 'production',
  API_URL_DEV: 'http://10.0.2.2:8000/api',
  API_URL_STAGING: 'https://staging-api.yourdomain.com/api',
  API_URL_PRODUCTION: 'https://api.yourdomain.com/api',
  API_TIMEOUT: '15000',
  ENABLE_ANALYTICS: 'false',
  ENABLE_CRASH_REPORTING: 'false',
  ENABLE_DEBUG_MENU: String(__DEV__),
  DEEP_LINK_SCHEME: 'yourapp',
  DEEP_LINK_HOST: 'yourapp.com',
};

// Type-safe environment config
export const Config = {
  APP_NAME: ENV_VARS.APP_NAME,
  APP_ENV: ENV_VARS.APP_ENV as 'development' | 'staging' | 'production',
  
  // API Configuration
  API_URL: getApiUrl(),
  API_TIMEOUT: parseInt(ENV_VARS.API_TIMEOUT, 10),
  
  // Feature Flags
  ENABLE_ANALYTICS: ENV_VARS.ENABLE_ANALYTICS === 'true',
  ENABLE_CRASH_REPORTING: ENV_VARS.ENABLE_CRASH_REPORTING === 'true',
  ENABLE_DEBUG_MENU: ENV_VARS.ENABLE_DEBUG_MENU === 'true',
  
  // Deep Linking
  DEEP_LINK_SCHEME: ENV_VARS.DEEP_LINK_SCHEME,
  DEEP_LINK_HOST: ENV_VARS.DEEP_LINK_HOST,
  
  // Platform
  IS_IOS: Platform.OS === 'ios',
  IS_ANDROID: Platform.OS === 'android',
  IS_DEV: __DEV__,
};

function getApiUrl(): string {
  const env = ENV_VARS.APP_ENV;
  
  if (env === 'production') {
    return ENV_VARS.API_URL_PRODUCTION;
  }
  
  if (env === 'staging') {
    return ENV_VARS.API_URL_STAGING;
  }
  
  // Development
  return Platform.OS === 'android'
    ? ENV_VARS.API_URL_DEV // Use 10.0.2.2 for Android emulator
    : ENV_VARS.API_URL_DEV.replace('10.0.2.2', 'localhost'); // Use localhost for iOS simulator
}

export default Config;
