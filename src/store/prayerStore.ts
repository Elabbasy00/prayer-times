import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Location, PrayerSettings } from '../types/prayer';
import { zustandStorage } from '../utils/mmkv';

interface PrayerState {
  location: Location;
  settings: PrayerSettings;
  // _hasHydrated: boolean;

  // Actions
  // setHasHydrated: (val: boolean) => void;
  setLocation: (location: Location) => void;
  updateSettings: (settings: Partial<PrayerSettings>) => void;
  resetSettings: () => void;
}

const DEFAULT_LOCATION: Location = {
  latitude: 30.5247136, // Mecca
  longitude: 31.0784187,
  city: 'Menofia',
  country: 'Egypt',
  manual: true,
};

const DEFAULT_SETTINGS: PrayerSettings = {
  calculationMethod: 'Egyptian',
  madhab: 'Shafi',
  adjustments: {
    fajr: 0,
    sunrise: 0,
    duha: 0,
    dhuhr: 0,
    asr: 0,
    maghrib: 0,
    isha: 0,
  },
  iqama: {
    fajr: 20,
    dhuhr: 10,
    asr: 10,
    maghrib: 5,
    isha: 15,
  },
  timezoneOffset: 0,
  useManualTimezone: false,
};

export const usePrayerStore = create<PrayerState>()(
  persist(
    set => ({
      location: DEFAULT_LOCATION,
      settings: DEFAULT_SETTINGS,
      // _hasHydrated: false,

      // setHasHydrated: val => set({ _hasHydrated: val }),
      setLocation: location => set({ location }),

      updateSettings: newSettings =>
        set(state => ({
          settings: { ...state.settings, ...newSettings },
        })),

      resetSettings: () => set({ settings: DEFAULT_SETTINGS }),
    }),
    {
      name: 'prayer-storage',
      storage: createJSONStorage(() => zustandStorage),
      version: 1,
      // onRehydrateStorage: () => state => {
      //   state?.setHasHydrated(true);
      // },
    },
  ),
);
