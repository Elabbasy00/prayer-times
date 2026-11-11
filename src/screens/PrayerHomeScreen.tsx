import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import moment from 'moment';

import { usePrayerStore } from '../store/prayerStore';
import { getPrayerTimes, getNextPrayer } from '../utils/prayer';
import { useUIStore } from '../store';
import { PrayerTimeEntry } from '../types/prayer';
import { TRANSLATIONS, Language } from '../constants/translations';
import { useTheme } from '../hooks/useTheme';
import { useAutoLocation } from '../hooks/useAutoLocation';

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

  const refreshPrayerDisplay = useCallback(() => {
    const now = new Date();
    const times = getPrayerTimes(now, location, settings, language);

    const sunnahTimes = times.filter(
      item => item.name === 'Duha' || item.name === 'Sunrise',
    );

    const dailyPrayers = times.filter(
      item => item.name !== 'Duha' && item.name !== 'Sunrise',
    );

    const next = getNextPrayer(dailyPrayers, location, settings, language);

    setPrayers(dailyPrayers);
    setSunnahPrayer(sunnahTimes);
    setNextPrayer(next?.next ?? null);
    setCurrentPrayer(next?.current ?? null);
    setPhase(next?.phase ?? 'waiting');
  }, [location, settings, language]);

  useEffect(() => {
    refreshPrayerDisplay();

    const displayInterval = setInterval(refreshPrayerDisplay, 60_000);

    return () => clearInterval(displayInterval);
  }, [refreshPrayerDisplay]);

  const isIqamaBannerVisible = (() => {
    if (phase !== 'waiting' || !currentPrayer?.iqama) {
      return false;
    }

    const now = moment();
    const iqamaTime = moment(currentPrayer.iqama);
    const endTime = moment(currentPrayer.iqama).add(2, 'minutes');

    return now.isSameOrAfter(iqamaTime) && now.isBefore(endTime);
  })();

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
            onTimerEnd={refreshPrayerDisplay}
          />
          <PrayerTables prayers={prayers} currentPrayer={currentPrayer} />
          <SunnahTable prayers={sunnahPrayer!} />
          <AthkerMarquee data={ATHKER_DATA} />
        </ScrollView>

        <NotificationBanner
          visible={isIqamaBannerVisible}
          message={t.closeYourPhone}
          icon="phoneOff"
        />
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
