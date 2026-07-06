import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { PrayerTimeEntry } from '../../types/prayer';
import { useUIStore } from '../../store';
import { TRANSLATIONS, Language } from '../../constants/translations';
import { getTranslatedName } from '../../utils/formatters';
import moment from 'moment';

interface PrayerTablesProps {
  prayers: PrayerTimeEntry[];
  currentPrayer?: PrayerTimeEntry | null;
  nextPrayer?: PrayerTimeEntry | null;
}

export default function PrayerTables({
  prayers,
  currentPrayer,
}: PrayerTablesProps) {
  const { colors, typography, borderRadius } = useTheme();
  const { language } = useUIStore();
  const t = TRANSLATIONS[language as Language] || TRANSLATIONS.en;

  const formatIqama = (date?: Date) => {
    if (!date) return '-';
    // Format to HH:mm A
    const m = moment(date).locale('en');
    // language === 'ar' ? 'ar-sa' :
    let formatted = m.format('h:mm A');
    if (language === 'ar') {
      formatted = formatted.replace('AM', 'ص').replace('PM', 'م');
    }
    return formatted;
  };

  return (
    <View
      style={[
        styles.container,
        {
          // backgroundColor:
          //   theme === 'dark' ? colors.surface + 'CC' : colors.surface,
          borderRadius: borderRadius.lg,

          borderColor: 'transparent',
          borderWidth: 1,
        },
        // shadows.sm,
      ]}
    >
      {/* Header Row */}
      <View
        style={[
          styles.row,
          styles.headerRow,
          { borderBottomColor: colors.divider },
        ]}
      >
        <View style={styles.colLeft}>
          <Text
            style={[
              styles.headerText,
              {
                fontSize: typography.fontSize.md,
                color: colors.primary,
                fontFamily: typography.fontFamily.bold,
              },
            ]}
          >
            {getTranslatedName(t, 'adhan')} {/* Reusing Adhan title */}
          </Text>
        </View>
        <View style={styles.colCenter}>
          <Text
            style={[
              styles.headerText,
              {
                fontSize: typography.fontSize.md,
                color: colors.primary,
                fontFamily: typography.fontFamily.bold,
              },
            ]}
          >
            {/* Prayer Name Header - keeping it empty or generic 'Prayer' */}
            {getTranslatedName(t, 'prayer')}
          </Text>
        </View>
        <View style={styles.colRight}>
          <Text
            style={[
              styles.headerText,
              {
                fontSize: typography.fontSize.md,
                color: colors.primary,
                fontFamily: typography.fontFamily.bold,
              },
            ]}
          >
            {getTranslatedName(t, 'iqama')}
          </Text>
        </View>
      </View>

      {/* Data Rows */}
      {prayers.map((prayer, index) => {
        const isCurrent = currentPrayer?.name === prayer.name;
        const rowStyle = isCurrent
          ? { backgroundColor: colors.primary + '15' } // Highlight current
          : {};

        const textStyle = isCurrent
          ? { color: colors.primary, fontFamily: typography.fontFamily.bold }
          : {
              color: colors.textSecondary,
              fontFamily: typography.fontFamily.regular,
            };

        return (
          <View
            key={prayer.name}
            style={[
              styles.row,
              rowStyle,
              index !== prayers.length - 1 && {
                borderBottomColor: colors.divider,
                borderBottomWidth: 0.5,
              },
            ]}
          >
            {/* Col 1: Adhan Time */}
            <View style={styles.colLeft}>
              <Text
                style={[
                  textStyle,
                  {
                    fontSize: typography.fontSize.lg,
                  },
                ]}
              >
                {prayer.formatted}
              </Text>
            </View>

            {/* Col 2: Prayer Name */}
            <View style={styles.colCenter}>
              <Text
                style={[
                  textStyle,
                  {
                    fontSize: typography.fontSize.xl,
                    fontFamily: typography.fontFamily.bold,
                  },
                ]}
              >
                {getTranslatedName(t, prayer.name)}
              </Text>
            </View>

            {/* Col 3: Iqama Time */}
            <View style={styles.colRight}>
              <Text
                style={[
                  textStyle,
                  {
                    // opacity: 0.8,
                    fontSize: typography.fontSize.lg,
                  },
                ]}
              >
                {prayer.name === 'Sunrise' ? '-' : formatIqama(prayer.iqama)}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // marginVertical: 10,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerRow: {
    borderBottomWidth: 1,
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  colLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  colCenter: {
    flex: 1.5,
    alignItems: 'center',
  },
  colRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  headerText: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
