import { useTheme } from '../../hooks';
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Clock from '../clock/Clock';
import { getHijriDate, gregorianDate } from '../../utils/prayer';
import { useUIStore } from '../../store';
import { GregorianDate, HijriDate } from '../../types/prayer';

function DateHeader() {
  const { typography, isRTL, colors, vs } = useTheme();
  const { language } = useUIStore();

  const [hijriDate, setHijriDate] = useState<HijriDate | null>(null);
  const [date, setDate] = useState<GregorianDate | null>(null);

  const [currentDay, setCurrentDay] = React.useState(new Date().getDate());

  const loadData = () => {
    const now = new Date();
    const hijri = getHijriDate(now, 0, language);
    const gDate = gregorianDate(now, language);

    setHijriDate(hijri);
    setDate(gDate);
    setCurrentDay(now.getDate());
  };

  useEffect(() => {
    loadData();

    // Check every 30 seconds if the day has changed (handles midnight rollover)
    const interval = setInterval(() => {
      const nowDay = new Date().getDate();
      if (nowDay !== currentDay) {
        loadData();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [language, currentDay]);

  return (
    <View
      style={[
        styles.container,
        {
          flexDirection: 'column',
          marginTop: vs(10),
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}
    >
      <View
        style={[
          styles.clockContainer,
          { alignItems: isRTL ? 'flex-end' : 'flex-start' },
        ]}
      >
        <Clock />
      </View>
      <View style={[styles.dateInfo]}>
        <Text
          style={[
            {
              color: colors.primaryLight,
              fontSize: typography.fontSize.lg,
              fontFamily: typography.fontFamily.bold,
            },
          ]}
        >
          {date?.dayName}
        </Text>

        <View>
          <Text
            style={[
              {
                color: colors.primaryLight,
                fontSize: typography.fontSize.md,
                fontFamily: typography.fontFamily.bold,
              },
            ]}
          >
            {date?.day} {date?.month}, {date?.year}
          </Text>

          <Text
            style={[
              {
                color: colors.primaryLight,
                fontSize: typography.fontSize.md,
                fontFamily: typography.fontFamily.bold,
              },
            ]}
          >
            {hijriDate?.formatted}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  clockContainer: {
    // No flex 1 to avoid pushing date too far
  },
  dateInfo: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',

    gap: 20,
    display: 'flex',
  },
});

export default DateHeader;
