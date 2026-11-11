import { AppState } from 'react-native';
import { Event, EventType } from '@notifee/react-native';

import { useUIStore } from '../store';
import { usePrayerStore } from '../store/prayerStore';
import {
  PrayerDiagnosticType,
  recordPrayerDiagnostic,
} from './prayerDiagnostics';
import { syncPrayerSchedule } from './prayerRuntime';

function getDiagnosticType(eventType: EventType): PrayerDiagnosticType | null {
  switch (eventType) {
    case EventType.DELIVERED:
      return 'notification-delivered';
    case EventType.PRESS:
    case EventType.ACTION_PRESS:
      return 'notification-pressed';
    case EventType.DISMISSED:
      return 'notification-dismissed';
    default:
      return null;
  }
}

function parseScheduledAt(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

export async function handlePrayerNotificationEvent(
  event: Event,
): Promise<void> {
  const notification = event.detail.notification;

  if (notification?.data?.prayerNotification !== 'true') {
    return;
  }

  const diagnosticType = getDiagnosticType(event.type);

  if (diagnosticType) {
    const scheduledAt = parseScheduledAt(notification.data?.scheduledAt);

    recordPrayerDiagnostic({
      type: diagnosticType,
      notificationId: notification.id,
      scheduledAt,
      delayMs: scheduledAt === undefined ? undefined : Date.now() - scheduledAt,
      appState: AppState.currentState,
    });
  }

  if (event.type !== EventType.DELIVERED) {
    return;
  }

  try {
    const { location, settings } = usePrayerStore.getState();
    const { language } = useUIStore.getState();

    await syncPrayerSchedule({
      location,
      settings,
      language,
      requestPermission: false,
    });

    recordPrayerDiagnostic({
      type: 'schedule-renewed',
      notificationId: notification.id,
      appState: AppState.currentState,
    });
  } catch (error) {
    recordPrayerDiagnostic({
      type: 'schedule-renewal-failed',
      notificationId: notification.id,
      message: error instanceof Error ? error.message : String(error),
      appState: AppState.currentState,
    });
  }
}
