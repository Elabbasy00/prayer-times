export interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
  manual: boolean; // true if manually entered, false if GPS/Auto
}

export type CalculationMethod =
  | 'MuslimWorldLeague'
  | 'Egyptian'
  | 'Karachi'
  | 'UmmAlQura'
  | 'Dubai'
  | 'MoonsightingCommittee'
  | 'NorthAmerica'
  | 'Kuwait'
  | 'Qatar'
  | 'Singapore'
  | 'Tehran'
  | 'Turkey'
  | 'Other';

export type Madhab = 'Shafi' | 'Hanafi';

export interface PrayerAdjustments {
  fajr: number;
  sunrise: number;
  duha: number;
  dhuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
}

export interface PrayerAdjustmentsIqama {
  fajr: number;
  dhuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
}

export interface PrayerSettings {
  calculationMethod: CalculationMethod;
  madhab: Madhab;
  adjustments: PrayerAdjustments;
  iqama: PrayerAdjustmentsIqama;
  timezoneOffset: number; // Manual offset in hours
  useManualTimezone: boolean;
}

export interface PrayerTimeEntry {
  name: string;
  time: Date;
  formatted: string;
  iqama?: Date;
}

export interface HijriDate {
  day: number;
  month: number;
  year: number;
  monthName: string;
  dayName: string;
  formatted: string;
}

export interface GregorianDate {
  day: string;
  dayName: string;
  month: string;
  year: string;
}

// Phases: 'waiting' = before adhan, 'adhan' = adhan time reached, 'iqama' = between adhan and iqama
export type PrayerPhase = 'waiting' | 'adhan' | 'iqama';

export interface PrayerState {
  current: PrayerTimeEntry;
  next: PrayerTimeEntry;
  phase: PrayerPhase;
}
