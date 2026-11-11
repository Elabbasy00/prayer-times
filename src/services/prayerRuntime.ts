import { TRANSLATIONS, Language } from '../constants/translations';
import { Location, PrayerSettings, PrayerTimeEntry } from '../types/prayer';
import { getTranslatedName } from '../utils/formatters';
import { getPrayerTimes } from '../utils/prayer';
import {
  getPrayerNotificationHealth,
  hasNotificationPermission,
  requestNotificationPermission,
  schedulePrayerNotifications,
} from './notifications';
import { recordPrayerDiagnostic } from './prayerDiagnostics';

interface SyncPrayerScheduleOptions {
  location: Location;
  settings: PrayerSettings;
  language: string;
  requestPermission?: boolean;
}

export async function syncPrayerSchedule({
  location,
  settings,
  language,
  requestPermission = true,
}: SyncPrayerScheduleOptions): Promise<void> {
  const hasPermission = requestPermission
    ? await requestNotificationPermission()
    : await hasNotificationPermission();

  if (!hasPermission) {
    throw new Error('Notification permission is not granted');
  }

  const translations = TRANSLATIONS[language as Language] ?? TRANSLATIONS.en;

  // Preserve the existing behavior until the manual-timezone meaning is
  // reviewed separately. Calculation still runs entirely in TypeScript.
  const notificationSettings: PrayerSettings = {
    ...settings,
    useManualTimezone: false,
  };

  const notificationTimes: PrayerTimeEntry[] = [];
  const startDate = new Date();

  for (let dayOffset = 0; dayOffset < 3; dayOffset += 1) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + dayOffset);

    notificationTimes.push(
      ...getPrayerTimes(date, location, notificationSettings, language),
    );
  }

  await schedulePrayerNotifications(notificationTimes, {
    adhanTitle: translations.adhanNotificationTitle,
    iqamaTitle: translations.iqamaNotificationTitle,
    adhanBody: name =>
      `${translations.adhanNotificationBody} ${getTranslatedName(
        translations,
        name,
      )}`,
    iqamaBody: name =>
      `${translations.iqamaNotificationBody} ${getTranslatedName(
        translations,
        name,
      )}`,
  });
  const health = await getPrayerNotificationHealth();

  recordPrayerDiagnostic({
    type: 'schedule-sync-succeeded',
    pendingPrayerCount: health.pendingPrayerCount,
    coverageUntil: health.coverageUntil,
  });
}
