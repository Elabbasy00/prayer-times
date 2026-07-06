import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import moment from 'moment';

import { usePrayerStore } from '../store/prayerStore';
import { getPrayerTimes, getNextPrayer } from '../utils/prayer';
import { useUIStore } from '../store';
import { PrayerTimeEntry } from '../types/prayer';
import { TRANSLATIONS, Language } from '../constants/translations';
import { useTheme } from '../hooks/useTheme';
import { useAutoLocation } from '../hooks/useAutoLocation';
import {
  schedulePrayerNotifications,
  requestNotificationPermission,
} from '../services/notifications';
import { getTranslatedName } from '../utils/formatters';

import DateHeader from '../components/date-header/DateHeader';
import PrayerTables from '../components/prayer-tables/PrayerTables';
import CurrentPrayCard from '../components/prayer-card/CurrentPrayCard';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ATHKER_DATA } from '../constants/athker';
import { AthkerMarquee } from '../components/athker-slider/AthkerSlider';
import SunnahTable from '../components/prayer-tables/SunnahTable';
import { NotificationBanner } from '../components/notification-banner/NotificationBanner';

export const PrayerHomeScreen = () => {
  const { language } = useUIStore();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const headerHeight = 60; // 40 (custom header padding) + 56 (content height)
  // const headerHeight = Platform.OS === 'ios' ? 44 : 50;
  const t = TRANSLATIONS[language as Language] || TRANSLATIONS.en;

  const { location, settings } = usePrayerStore();

  // Auto-fetch location on app start if not manual
  useAutoLocation();

  const [prayers, setPrayers] = useState<PrayerTimeEntry[]>([]);
  const [nextPrayer, setNextPrayer] = useState<PrayerTimeEntry | null>(null);
  const [sunnahPrayer, setSunnahPrayer] = useState<PrayerTimeEntry[] | null>(
    null,
  );
  const [currentPrayer, setCurrentPrayer] = useState<PrayerTimeEntry | null>(
    null,
  );
  const [phase, setPhase] = useState<'waiting' | 'adhan' | 'iqama'>('waiting');

  const loadData = async () => {
    const now = new Date();
    const times = getPrayerTimes(now, location, settings, language);
    const sunnahTimes = times.filter(
      item => item.name === 'Duha' || item.name === 'Sunrise',
    );
    const prayers = times.filter(
      item => item.name !== 'Duha' && item.name !== 'Sunrise',
    );
    const next = getNextPrayer(prayers, location, settings, language);

    setPrayers(prayers);
    setSunnahPrayer(sunnahTimes || null);
    setNextPrayer(next?.next || null);
    setCurrentPrayer(next?.current || null);
    setPhase(next?.phase || 'waiting');

    // Schedule notifications for Today AND Tomorrow
    try {
      const hasPermission = await requestNotificationPermission();
      if (hasPermission) {
        // For notifications we need the ORIGINAL un-offset times
        // because Android triggers fire based on system clock.
        // The offset is display-only.
        const notifSettings = {
          ...settings,
          useManualTimezone: false,
        };

        const todayNotifTimes = getPrayerTimes(
          now,
          location,
          notifSettings,
          language,
        );

        // Get tomorrow's times so notifications work across midnight
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowNotifTimes = getPrayerTimes(
          tomorrow,
          location,
          notifSettings,
          language,
        );

        // Schedule notifications for both today and tomorrow
        await schedulePrayerNotifications(
          [...todayNotifTimes, ...tomorrowNotifTimes],
          {
            adhanTitle: t.adhanNotificationTitle,
            iqamaTitle: t.iqamaNotificationTitle,
            adhanBody: (name: string) =>
              `${t.adhanNotificationBody} ${getTranslatedName(t, name)}`,
            iqamaBody: (name: string) =>
              `${t.iqamaNotificationBody} ${getTranslatedName(t, name)}`,
          },
        );
      }
    } catch (error) {
      console.log('Notification scheduling error:', error);
    }
  };

  useEffect(() => {
    loadData();

    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, [location, settings, language]);

  const image = require('../assets/images/bg.png');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ImageBackground
        source={image}
        resizeMode="cover"
        style={{ flex: 1, paddingTop: insets.top + headerHeight }}
      >
        <DateHeader />
        <ScrollView style={{ flex: 1, padding: 5, gap: 5 }}>
          <CurrentPrayCard
            nextPrayer={nextPrayer!}
            phase={phase}
            onTimerEnd={loadData}
          />
          <PrayerTables prayers={prayers} currentPrayer={currentPrayer} />
          <SunnahTable prayers={sunnahPrayer!} />
          <AthkerMarquee data={ATHKER_DATA} />
        </ScrollView>

        {(() => {
          if (phase !== 'waiting' || !currentPrayer?.iqama) return null;

          const now = moment();
          const iqamaTime = moment(currentPrayer.iqama);
          const endTime = moment(currentPrayer.iqama).add(2, 'minutes');

          // Show "Close your phone" if we are in the 15-minute window after iqama
          if (now.isAfter(iqamaTime) && now.isBefore(endTime)) {
            return (
              <NotificationBanner
                visible={true}
                message={t.closeYourPhone}
                icon="phoneOff"
              />
            );
          }
          return null;
        })()}
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
});
