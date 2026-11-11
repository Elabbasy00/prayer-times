import { Platform } from 'react-native';
import notifee, {
  AlarmType,
  AndroidCategory,
  AndroidImportance,
  AndroidNotificationSetting,
  AndroidVisibility,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';

import { PrayerTimeEntry } from '../types/prayer';

interface NotificationTranslations {
  adhanTitle: string;
  iqamaTitle: string;
  adhanBody: (name: string) => string;
  iqamaBody: (name: string) => string;
}

interface DesiredPrayerNotification {
  id: string;
  title: string;
  body: string;
  timestamp: Date;
  channelId: string;
  sound: string;
}

const PRAYER_NOTIFICATION_PREFIX = 'prayer-';
const LEGACY_PRAYER_ID_PATTERN = /^(adhan|iqama)-.+-\d{4}$/;

let schedulingQueue: Promise<void> = Promise.resolve();

export interface PrayerNotificationHealth {
  pendingPrayerCount: number;
  coverageUntil?: number;
}

export interface PrayerNotificationDeviceStatus {
  notificationsAuthorized: boolean;
  exactAlarmsAuthorized: boolean;
  pendingPrayerCount: number;
  coverageUntil?: number;
  adhanChannelBlocked: boolean;
  iqamaChannelBlocked: boolean;
  adhanSoundURI?: string;
  iqamaSoundURI?: string;
}

export async function getPrayerNotificationDeviceStatus(): Promise<PrayerNotificationDeviceStatus> {
  const settings = await notifee.getNotificationSettings();
  const health = await getPrayerNotificationHealth();

  const [adhanChannel, iqamaChannel] = await Promise.all([
    notifee.getChannel('adhan-channel-v2'),
    notifee.getChannel('iqama-channel-v2'),
  ]);

  return {
    notificationsAuthorized: settings.authorizationStatus >= 1,
    exactAlarmsAuthorized:
      Platform.OS !== 'android' ||
      settings.android.alarm !== AndroidNotificationSetting.DISABLED,
    pendingPrayerCount: health.pendingPrayerCount,
    coverageUntil: health.coverageUntil,
    adhanChannelBlocked: adhanChannel?.blocked ?? false,
    iqamaChannelBlocked: iqamaChannel?.blocked ?? false,
    adhanSoundURI: adhanChannel?.soundURI,
    iqamaSoundURI: iqamaChannel?.soundURI,
  };
}

export async function openPrayerAlarmSettings(): Promise<void> {
  await notifee.openAlarmPermissionSettings();
}

export async function openPrayerChannelSettings(
  kind: 'adhan' | 'iqama',
): Promise<void> {
  const channelId = kind === 'adhan' ? 'adhan-channel-v2' : 'iqama-channel-v2';

  await notifee.openNotificationSettings(channelId);
}

export async function displayPrayerSoundTest(
  kind: 'adhan' | 'iqama',
  title: string,
  body: string,
): Promise<void> {
  const sound = kind;
  const channelId =
    kind === 'adhan'
      ? await createNotificationChannel(
          'adhan-channel-v2',
          'Adhan Alerts',
          'adhan',
        )
      : await createNotificationChannel(
          'iqama-channel-v2',
          'Iqama Alerts',
          'iqama',
        );

  await notifee.displayNotification({
    id: `prayer-test-${kind}-${Date.now()}`,
    title,
    body,
    android: {
      channelId,
      category: AndroidCategory.ALARM,
      importance: AndroidImportance.HIGH,
      visibility: AndroidVisibility.PUBLIC,
      sound,
      timeoutAfter: 10_000,
      pressAction: {
        id: 'default',
      },
    },
  });
}

export async function getPrayerNotificationHealth(): Promise<PrayerNotificationHealth> {
  const triggers = await notifee.getTriggerNotifications();

  const prayerTriggers = triggers.filter(item =>
    item.notification.id?.startsWith(PRAYER_NOTIFICATION_PREFIX),
  );

  const timestamps = prayerTriggers.flatMap(item =>
    item.trigger.type === TriggerType.TIMESTAMP ? [item.trigger.timestamp] : [],
  );
  return {
    pendingPrayerCount: prayerTriggers.length,
    coverageUntil: timestamps.length > 0 ? Math.max(...timestamps) : undefined,
  };
}

export async function createNotificationChannel(
  id: string,
  name: string,
  sound: string,
): Promise<string> {
  return notifee.createChannel({
    id,
    name,
    importance: AndroidImportance.HIGH,
    visibility: AndroidVisibility.PUBLIC,
    sound,
    vibration: true,
    bypassDnd: true,
  });
}

function formatLocalDate(date: Date): string {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function createNotificationId(
  kind: 'adhan' | 'iqama',
  prayer: PrayerTimeEntry,
  timestamp: Date,
): string {
  const prayerKey = prayer.name.toLowerCase();
  const localDate = formatLocalDate(timestamp);

  return `${PRAYER_NOTIFICATION_PREFIX}${kind}-${localDate}-${prayerKey}`;
}

function createSignature(event: DesiredPrayerNotification): string {
  return [
    event.timestamp.getTime(),
    event.title,
    event.body,
    event.channelId,
    event.sound,
  ].join('|');
}

function isPrayerNotificationId(id: string): boolean {
  return (
    id.startsWith(PRAYER_NOTIFICATION_PREFIX) ||
    LEGACY_PRAYER_ID_PATTERN.test(id)
  );
}

export async function scheduleNotification(
  event: DesiredPrayerNotification,
): Promise<void> {
  if (event.timestamp.getTime() <= Date.now()) {
    return;
  }

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: event.timestamp.getTime(),
    ...(Platform.OS === 'android'
      ? {
          alarmManager: {
            type: AlarmType.SET_EXACT_AND_ALLOW_WHILE_IDLE,
          },
        }
      : {}),
  };

  await notifee.createTriggerNotification(
    {
      id: event.id,
      title: event.title,
      body: event.body,
      data: {
        prayerNotification: 'true',
        scheduledAt: event.timestamp.getTime(),
        scheduleSignature: createSignature(event),
      },
      android: {
        channelId: event.channelId,
        importance: AndroidImportance.HIGH,
        visibility: AndroidVisibility.PUBLIC,
        category: AndroidCategory.ALARM,
        autoCancel: true,
        pressAction: {
          id: 'default',
        },
        sound: event.sound,
      },
      ios: {
        sound: `${event.sound}.wav`,
      },
    },
    trigger,
  );
}

function buildDesiredNotifications(
  prayers: PrayerTimeEntry[],
  translations: NotificationTranslations,
  adhanChannelId: string,
  iqamaChannelId: string,
): DesiredPrayerNotification[] {
  const desired: DesiredPrayerNotification[] = [];

  for (const prayer of prayers) {
    if (prayer.name === 'Sunrise' || prayer.name === 'Duha') {
      continue;
    }

    desired.push({
      id: createNotificationId('adhan', prayer, prayer.time),
      title: translations.adhanTitle,
      body: translations.adhanBody(prayer.name),
      timestamp: prayer.time,
      channelId: adhanChannelId,
      sound: 'adhan',
    });

    if (prayer.iqama) {
      desired.push({
        id: createNotificationId('iqama', prayer, prayer.iqama),
        title: translations.iqamaTitle,
        body: translations.iqamaBody(prayer.name),
        timestamp: prayer.iqama,
        channelId: iqamaChannelId,
        sound: 'iqama',
      });
    }
  }

  return desired;
}

async function assertExactAlarmAccess(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }

  const settings = await notifee.getNotificationSettings();

  if (settings.android.alarm === AndroidNotificationSetting.DISABLED) {
    throw new Error(
      'Exact alarm access is disabled. Enable Alarms & reminders for this app.',
    );
  }
}

async function reconcilePrayerNotifications(
  prayers: PrayerTimeEntry[],
  translations: NotificationTranslations,
): Promise<void> {
  await assertExactAlarmAccess();

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

  const desired = buildDesiredNotifications(
    prayers,
    translations,
    adhanChannelId,
    iqamaChannelId,
  );

  const desiredIds = new Set(desired.map(event => event.id));
  const existing = await notifee.getTriggerNotifications();

  const existingById = new Map(
    existing.flatMap(item => {
      const id = item.notification.id;
      return id ? [[id, item] as const] : [];
    }),
  );

  let createdOrUpdated = 0;
  let unchanged = 0;

  for (const event of desired) {
    if (event.timestamp.getTime() <= Date.now()) {
      continue;
    }

    const current = existingById.get(event.id);
    const currentSignature = current?.notification.data?.scheduleSignature;

    const sameTimestamp =
      current?.trigger.type === TriggerType.TIMESTAMP &&
      current.trigger.timestamp === event.timestamp.getTime();

    const sameSignature = currentSignature === createSignature(event);

    if (sameTimestamp && sameSignature) {
      unchanged += 1;
      continue;
    }

    await scheduleNotification(event);
    createdOrUpdated += 1;
  }

  // Remove obsolete prayer alerts only after new/updated alerts exist.
  // Other application notifications are preserved.
  const obsoleteIds = existing
    .map(item => item.notification.id)
    .filter((id): id is string => Boolean(id))
    .filter(id => {
      if (!isPrayerNotificationId(id)) {
        return false;
      }

      if (LEGACY_PRAYER_ID_PATTERN.test(id)) {
        return true;
      }

      return !desiredIds.has(id);
    });

  if (obsoleteIds.length > 0) {
    await notifee.cancelTriggerNotifications(obsoleteIds);
  }

  console.log(
    `[Notifications] ${createdOrUpdated} created/updated, ` +
      `${unchanged} unchanged, ${obsoleteIds.length} obsolete removed`,
  );
}

export function schedulePrayerNotifications(
  prayers: PrayerTimeEntry[],
  translations: NotificationTranslations,
): Promise<void> {
  const operation = () => reconcilePrayerNotifications(prayers, translations);

  schedulingQueue = schedulingQueue.then(operation, operation);

  return schedulingQueue;
}

export async function requestNotificationPermission(): Promise<boolean> {
  const settings = await notifee.requestPermission();
  return settings.authorizationStatus >= 1;
}

export async function hasNotificationPermission(): Promise<boolean> {
  const settings = await notifee.getNotificationSettings();
  return settings.authorizationStatus >= 1;
}
