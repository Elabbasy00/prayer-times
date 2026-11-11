/**
 * @format
 */

import { AppRegistry } from 'react-native';

import App from './App';
import { name as appName } from './app.json';
import notifee from '@notifee/react-native';
import { handlePrayerNotificationEvent } from './src/services/prayerNotificationEvents';

notifee.onBackgroundEvent(handlePrayerNotificationEvent);
AppRegistry.registerComponent(appName, () => App);
