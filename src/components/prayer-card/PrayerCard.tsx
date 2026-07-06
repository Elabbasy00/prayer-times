import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { HijriDate, PrayerTimeEntry } from '../../types/prayer';
import moment from 'moment';
import { useUIStore } from '../../store';
import { Language, TRANSLATIONS } from '../../constants/translations';
import { getTranslatedName } from '../../utils/formatters';

const PrayerCard = ({
  hijri,
  nextPrayer,
  prayers,
  currentPrayer,
}: {
  hijri: HijriDate | null;
  nextPrayer: PrayerTimeEntry | null;
  prayers: PrayerTimeEntry[];
  currentPrayer: PrayerTimeEntry | null;
}) => {
  const { colors, shadows, spacing, borderRadius, typography } = useTheme();
  const { language } = useUIStore();
  const [timeLeft, setTimeLeft] = useState('');
  const t = TRANSLATIONS[language as Language] || TRANSLATIONS.en;

  useEffect(() => {
    if (!nextPrayer) return;

    const updateTimer = () => {
      const now = moment();
      const next = moment(nextPrayer.time);
      const diff = next.diff(now);

      if (diff <= 0) {
        setTimeLeft('00:00:00');
        return;
      }

      const duration = moment.duration(diff);
      const hours = String(duration.hours()).padStart(2, '0');
      const minutes = String(duration.minutes()).padStart(2, '0');
      const seconds = String(duration.seconds()).padStart(2, '0');

      setTimeLeft(`${hours}:${minutes}:${seconds}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [nextPrayer]);

  const isRTL = language === 'ar';

  return (
    <View
      style={[
        styles.card,
        shadows.md,
        {
          backgroundColor: colors.surface,
          borderRadius: borderRadius.md,
          padding: spacing.md,
          borderColor: colors.border,
          borderWidth: 1,
        },
      ]}
    >
      {/* Top Section: Next Prayer & Countdown */}
      <View
        style={[
          styles.headerRow,
          { flexDirection: isRTL ? 'row-reverse' : 'row' },
        ]}
      >
        {/* Next Prayer Info */}
        <View
          style={[
            styles.nextPrayerContainer,
            { alignItems: isRTL ? 'flex-end' : 'flex-start' },
          ]}
        >
          <Text
            style={[
              styles.label,
              {
                color: colors.textSecondary,
                fontFamily: typography.fontFamily.medium,
              },
            ]}
          >
            {getTranslatedName(t, 'nextPrayer')}
          </Text>
          <Text
            style={[
              styles.prayerName,
              { color: colors.primary, fontFamily: typography.fontFamily.bold },
            ]}
          >
            {getTranslatedName(t, nextPrayer?.name || '')}
          </Text>
          <View
            style={[
              styles.timeRow,
              { flexDirection: isRTL ? 'row-reverse' : 'row' },
            ]}
          >
            <Text
              style={[
                styles.prayerTime,
                { color: colors.text, fontFamily: typography.fontFamily.bold },
              ]}
            >
              {nextPrayer?.formatted}
            </Text>
            <Text
              style={[
                styles.dateText,
                {
                  color: colors.textSecondary,
                  fontFamily: typography.fontFamily.regular,
                  marginHorizontal: 8,
                },
              ]}
            >
              • {hijri?.day} {hijri?.monthName}
            </Text>
          </View>
        </View>

        {/* Countdown Timer */}
        <View
          style={[
            styles.timerContainer,
            { backgroundColor: colors.primary + '10' },
          ]}
        >
          <Text
            style={[
              styles.timerLabel,
              {
                color: colors.primary,
                fontFamily: typography.fontFamily.medium,
              },
            ]}
          >
            {getTranslatedName(t, 'remaining')}
          </Text>
          <Text
            style={[
              styles.timerValue,
              { color: colors.primary, fontFamily: typography.fontFamily.bold },
            ]}
          >
            {timeLeft}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* Bottom Section: All Prayers */}
      <View
        style={[
          styles.prayersRow,
          { flexDirection: isRTL ? 'row-reverse' : 'row' },
        ]}
      >
        {prayers.map(item => {
          const isCurrent = currentPrayer?.name === item.name;
          const isNext = nextPrayer?.name === item.name;

          return (
            <View
              key={item.name}
              style={[
                styles.prayerItem,
                isCurrent && { backgroundColor: colors.primary },

                !isCurrent && !isNext && { backgroundColor: 'transparent' },
              ]}
            >
              <Text
                style={[
                  styles.prayerItemName,
                  {
                    color: isCurrent ? '#FFF' : colors.textSecondary,
                    fontFamily:
                      isCurrent || isNext
                        ? typography.fontFamily.bold
                        : typography.fontFamily.regular,
                    fontWeight: 'black',
                  },
                ]}
              >
                {getTranslatedName(t, item.name || '')}
              </Text>
              <Text
                style={[
                  styles.prayerItemTime,
                  {
                    color: isCurrent ? '#FFF' : colors.text,
                    fontFamily: typography.fontFamily.medium,
                  },
                ]}
              >
                {item.formatted}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default PrayerCard;

const styles = StyleSheet.create({
  card: {
    margin: 2,
    marginBottom: 8,
  },
  headerRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  nextPrayerContainer: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  prayerName: {
    fontSize: 28,
    marginBottom: 4,
  },
  timeRow: {
    alignItems: 'center',
  },
  prayerTime: {
    fontSize: 16,
  },
  dateText: {
    fontSize: 14,
  },
  timerContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 100,
  },
  timerLabel: {
    fontSize: 10,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  timerValue: {
    fontSize: 18,
    fontVariant: ['tabular-nums'], // Ensures numbers don't jump width
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: 16,
  },
  prayersRow: {
    justifyContent: 'space-between',
    gap: 2,
  },
  prayerItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },
  prayerItemName: {
    fontSize: 10,
    marginBottom: 4,
  },
  prayerItemTime: {
    fontSize: 12,
  },
});
