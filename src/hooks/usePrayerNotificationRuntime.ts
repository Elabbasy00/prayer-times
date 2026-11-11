import { useCallback, useEffect, useState, useRef } from 'react';
import { AppState } from 'react-native';

import { syncPrayerSchedule } from '../services/prayerRuntime';
import { useUIStore } from '../store';
import { usePrayerStore } from '../store/prayerStore';
import notifee from '@notifee/react-native';
import { handlePrayerNotificationEvent } from '../services/prayerNotificationEvents';
import { recordPrayerDiagnostic } from '../services/prayerDiagnostics';

const SCHEDULE_REFRESH_INTERVAL_MS = 6 * 60 * 60 * 1000;

export function usePrayerNotificationRuntime(): void {
  const location = usePrayerStore(state => state.location);
  const settings = usePrayerStore(state => state.settings);
  const language = useUIStore(state => state.language);
  const permissionRequestAttemptedRef = useRef(false);
  const [hasHydrated, setHasHydrated] = useState(
    () =>
      usePrayerStore.persist.hasHydrated() && useUIStore.persist.hasHydrated(),
  );

  useEffect(() => {
    const updateHydrationState = () => {
      setHasHydrated(
        usePrayerStore.persist.hasHydrated() &&
          useUIStore.persist.hasHydrated(),
      );
    };

    const unsubscribePrayer =
      usePrayerStore.persist.onFinishHydration(updateHydrationState);

    const unsubscribeUI =
      useUIStore.persist.onFinishHydration(updateHydrationState);

    updateHydrationState();

    return () => {
      unsubscribePrayer();
      unsubscribeUI();
    };
  }, []);

  useEffect(() => {
    return notifee.onForegroundEvent(event => {
      void handlePrayerNotificationEvent(event);
    });
  }, []);
  const synchronize = useCallback(async () => {
    if (!hasHydrated) {
      return;
    }

    const shouldRequestPermission = !permissionRequestAttemptedRef.current;

    permissionRequestAttemptedRef.current = true;

    try {
      await syncPrayerSchedule({
        location,
        settings,
        language,
        requestPermission: shouldRequestPermission,
      });
    } catch (error) {
      console.log('[PrayerRuntime] Schedule synchronization failed:', error);

      recordPrayerDiagnostic({
        type: 'schedule-sync-failed',
        message: error instanceof Error ? error.message : String(error),
        appState: AppState.currentState,
      });
    }
  }, [hasHydrated, location, settings, language]);
  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    void synchronize();

    const refreshInterval = setInterval(
      () => void synchronize(),
      SCHEDULE_REFRESH_INTERVAL_MS,
    );

    const appStateSubscription = AppState.addEventListener(
      'change',
      nextState => {
        if (nextState === 'active') {
          void synchronize();
        }
      },
    );

    return () => {
      clearInterval(refreshInterval);
      appStateSubscription.remove();
    };
  }, [hasHydrated, synchronize]);
}
