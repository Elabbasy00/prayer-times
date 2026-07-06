// src/services/notifications.ts
import notifee, {
  TriggerType,
  TimestampTrigger,
  AndroidImportance,
  AndroidVisibility,
  AndroidCategory,
} from '@notifee/react-native';
import { PrayerTimeEntry } from '../types/prayer';

// Create notification channel for Android
export async function createNotificationChannel(
  id: string,
  name: string,
  sound: string,
): Promise<string> {
  return await notifee.createChannel({
    id,
    name,
    importance: AndroidImportance.HIGH,
    visibility: AndroidVisibility.PUBLIC,
    sound: sound,
    vibration: true,
    bypassDnd: true,
  });
}

// Schedule a notification for a specific time
export async function scheduleNotification(
  id: string,
  title: string,
  body: string,
  timestamp: Date,
  channelId: string,
  notifySound: string,
): Promise<void> {
  // Don't schedule if time is in the past
  if (timestamp.getTime() <= Date.now()) {
    return;
  }

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: timestamp.getTime(),
  };

  await notifee.createTriggerNotification(
    {
      id,
      title,
      body,
      android: {
        channelId,
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC,
        category: AndroidCategory.ALARM,
        autoCancel: true,
        pressAction: {
          id: 'default',
        },
        sound: notifySound,
      },
      ios: {
        sound: notifySound + '.wav',
      },
    },
    trigger,
  );
}

// Cancel all scheduled trigger notifications (preserves active/displayed ones)
export async function cancelAllNotifications(): Promise<void> {
  await notifee.cancelTriggerNotifications();
}

// Schedule notifications for all prayer times
export async function schedulePrayerNotifications(
  prayers: PrayerTimeEntry[],
  translations: {
    adhanTitle: string;
    iqamaTitle: string;
    adhanBody: (name: string) => string;
    iqamaBody: (name: string) => string;
  },
): Promise<void> {
  // Cancel existing scheduled notifications to avoid duplicates
  await cancelAllNotifications();

  // Create channels once (idempotent — Android ignores if already exists with same ID)
  const adhanChannelId = await createNotificationChannel(
    'adhan-channel-v2',
    'Adhan Alerts',
    'adhan',
  );
  const iqamaChannelId = await createNotificationChannel(
    'iqama-channel-v2',
    'Iqama Alerts',
    'iqama',
  );

  let scheduledCount = 0;

  // Schedule notifications for each prayer
  for (const prayer of prayers) {
    // Skip Sunrise and Duha (no adhan for these)
    if (prayer.name === 'Sunrise' || prayer.name === 'Duha') continue;

    // Date suffix for unique IDs (e.g. "0514" for May 14)
    const d = prayer.time;
    const dateSuffix = `${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
    const prayerKey = prayer.name.toLowerCase();

    // Schedule Adhan notification (only if in the future)
    if (prayer.time.getTime() > Date.now()) {
      await scheduleNotification(
        `adhan-${prayerKey}-${dateSuffix}`,
        translations.adhanTitle,
        translations.adhanBody(prayer.name),
        prayer.time,
        adhanChannelId,
        'adhan',
      );
      scheduledCount++;
    }

    // Schedule Iqama notification if available and in the future
    if (prayer.iqama && prayer.iqama.getTime() > Date.now()) {
      await scheduleNotification(
        `iqama-${prayerKey}-${dateSuffix}`,
        translations.iqamaTitle,
        translations.iqamaBody(prayer.name),
        prayer.iqama,
        iqamaChannelId,
        'iqama',
      );
      scheduledCount++;
    }
  }

  console.log(`[Notifications] Scheduled ${scheduledCount} notifications`);
}

// Request notification permissions
export async function requestNotificationPermission(): Promise<boolean> {
  const settings = await notifee.requestPermission();
  return settings.authorizationStatus >= 1; // Authorized or Provisional
}

// Check if we have notification permissions
export async function hasNotificationPermission(): Promise<boolean> {
  const settings = await notifee.getNotificationSettings();
  return settings.authorizationStatus >= 1;
}
