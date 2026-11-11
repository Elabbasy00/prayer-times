import { storage } from '../utils/mmkv';

const DIAGNOSTICS_KEY = 'prayer-diagnostics-v1';
const MAX_DIAGNOSTIC_ENTRIES = 200;

export type PrayerDiagnosticType =
  | 'notification-delivered'
  | 'notification-pressed'
  | 'notification-dismissed'
  | 'schedule-renewed'
  | 'schedule-renewal-failed'
  | 'schedule-sync-succeeded'
  | 'schedule-sync-failed';
export interface PrayerDiagnosticEntry {
  id: string;
  type: PrayerDiagnosticType;
  recordedAt: number;
  notificationId?: string;
  scheduledAt?: number;
  delayMs?: number;
  message?: string;
  appState?: string;
  pendingPrayerCount?: number;
  coverageUntil?: number;
}

function readEntries(): PrayerDiagnosticEntry[] {
  const stored = storage.getString(DIAGNOSTICS_KEY);

  if (!stored) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(stored);

    return Array.isArray(parsed) ? (parsed as PrayerDiagnosticEntry[]) : [];
  } catch {
    return [];
  }
}

export function recordPrayerDiagnostic(
  entry: Omit<PrayerDiagnosticEntry, 'id' | 'recordedAt'>,
): void {
  const recordedAt = Date.now();

  const nextEntry: PrayerDiagnosticEntry = {
    ...entry,
    id: `${recordedAt}-${Math.random().toString(36).slice(2, 10)}`,
    recordedAt,
  };

  const entries = readEntries();
  entries.push(nextEntry);

  storage.set(
    DIAGNOSTICS_KEY,
    JSON.stringify(entries.slice(-MAX_DIAGNOSTIC_ENTRIES)),
  );
}

export function getPrayerDiagnostics(): PrayerDiagnosticEntry[] {
  return readEntries();
}
