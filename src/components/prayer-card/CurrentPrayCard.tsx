import React, { useEffect, useState } from 'react';
import { hs, vs } from '../../config/theme';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { PrayerTimeEntry } from '../../types/prayer';

import { useUIStore } from '../../store';
import { Language, TRANSLATIONS } from '../../constants/translations';
import { getTranslatedName } from '../../utils/formatters';
import moment from 'moment';

function CurrentPrayCard({
  nextPrayer,
  phase,
  onTimerEnd,
}: {
  nextPrayer: PrayerTimeEntry | null;
  phase: 'waiting' | 'adhan' | 'iqama';
  onTimerEnd?: () => void;
}) {
  const { colors, spacing, borderRadius, typography } = useTheme();
  const { language } = useUIStore();
  const [timeLeft, setTimeLeft] = useState('');
  const t = TRANSLATIONS[language as Language] || TRANSLATIONS.en;

  useEffect(() => {
    if (!nextPrayer) return;

    const targetTime =
      phase === 'iqama' && nextPrayer.iqama
        ? moment(nextPrayer.iqama)
        : moment(nextPrayer.time);

    const interval = setInterval(() => {
      const diff = targetTime.diff(moment());

      if (diff <= 0) {
        setTimeLeft('00:00:00');
        onTimerEnd?.();
        return;
      }

      const d = moment.duration(diff);

      setTimeLeft(
        `${String(d.hours()).padStart(2, '0')}:` +
          `${String(d.minutes()).padStart(2, '0')}:` +
          `${String(d.seconds()).padStart(2, '0')}`,
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [nextPrayer, phase]);

  // Determine label based on phase
  const timerLabel = getTranslatedName(t, 'remaining');

  return (
    <View
      style={[
        styles.card,
        {
          borderRadius: borderRadius.md,
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
        },
      ]}
    >
      {/* Top Section: Next Prayer & Countdown */}
      <View
        style={[
          styles.headerRow,
          {
            flexDirection: 'row',
            gap: spacing.md,
          },
        ]}
      >
        {/* Next Prayer Info */}
        <View
          style={[
            styles.nextPrayerContainer,
            {
              // backgroundColor: colors.primary + '10',
              borderRadius: borderRadius.lg,
            },
          ]}
        >
          <Text
            style={[
              styles.label,
              {
                // color: colors.textSecondary,
                color: colors.primary,
                fontFamily: typography.fontFamily.bold,
                fontSize: typography.fontSize.md,
              },
            ]}
          >
            {phase === 'iqama'
              ? getTranslatedName(t, 'iqama')
              : getTranslatedName(t, 'nextprayer')}
          </Text>
          <Text
            style={[
              {
                fontSize: typography.fontSize.xxl,
                color: colors.primaryLight,
                fontFamily: typography.fontFamily.bold,
              },
            ]}
          >
            {getTranslatedName(t, nextPrayer?.name || '')}
          </Text>
        </View>

        {/* Countdown Timer */}
        <View
          style={[
            styles.timerContainer,
            {
              borderRadius: borderRadius.lg,

              // backgroundColor: colors.primary + '10',
            },
          ]}
        >
          <Text
            style={[
              styles.timerLabel,
              {
                color: colors.primary,
                fontFamily: typography.fontFamily.bold,
                fontSize: typography.fontSize.md,
              },
            ]}
          >
            {timerLabel}
          </Text>
          <Text
            style={[
              styles.timerValue,
              {
                color: colors.primaryLight,
                fontFamily: typography.fontFamily.bold,
                fontSize: typography.fontSize.xxl,
                width: '100%',
                textAlign: 'center',
              },
            ]}
          >
            {timeLeft}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default CurrentPrayCard;

const styles = StyleSheet.create({
  card: {
    marginBottom: 0,
  },
  headerRow: {
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  nextPrayerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: vs(4),
    paddingHorizontal: hs(8),
    flex: 0.5,
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  timerContainer: {
    paddingVertical: vs(4),
    paddingHorizontal: hs(8),
    justifyContent: 'center',
    alignItems: 'center',
    // textAlign: 'center',
    flex: 0.5,
  },
  timerLabel: {
    textTransform: 'uppercase',
  },
  timerValue: {
    fontFamily: Platform.select({
      ios: 'Menlo',
      android: 'monospace',
    }),
  },
});
