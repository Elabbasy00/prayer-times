import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { PrayerTimeEntry } from '../../types/prayer';
import { useUIStore } from '../../store';
import { TRANSLATIONS, Language } from '../../constants/translations';
import { getTranslatedName } from '../../utils/formatters';

interface SunnahTableProps {
  prayers: PrayerTimeEntry[];
}

export default function SunnahTable({ prayers }: SunnahTableProps) {
  const { colors, typography, borderRadius } = useTheme();
  const { language } = useUIStore();
  const t = TRANSLATIONS[language as Language] || TRANSLATIONS.en;

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
          marginBottom: 10,
        },
        // shadows.sm,
      ]}
    >
      {/* Data Rows */}
      <View
        style={[
          styles.row,
          {
            borderBottomColor: colors.divider,
            borderBottomWidth: 0.5,
          },
        ]}
      >
        <View style={styles.colRight}>
          <Text
            style={[
              {
                color: colors.primary,
                fontFamily: typography.fontFamily.bold,
                fontSize: typography.fontSize.lg,
                textAlign: 'center',
              },
            ]}
          >
            {getTranslatedName(t, prayers?.[0]?.name)}
          </Text>
          <Text
            style={[
              {
                color: colors.primaryLight,
                fontFamily: typography.fontFamily.bold,
                fontSize: typography.fontSize.lg,
              },
            ]}
          >
            {prayers?.[0]?.formatted}
          </Text>
        </View>
        <View style={styles.colLeft}>
          <Text
            style={[
              {
                fontSize: typography.fontSize.lg,
                color: colors.primary,
                fontFamily: typography.fontFamily.bold,
                textAlign: 'center',
              },
            ]}
          >
            {getTranslatedName(t, prayers?.[1]?.name)}
          </Text>
          <Text
            style={[
              {
                color: colors.primaryLight,
                fontFamily: typography.fontFamily.bold,
                fontSize: typography.fontSize.lg,
              },
            ]}
          >
            {prayers?.[1]?.formatted}
          </Text>
        </View>
      </View>
      {/* <View
        style={[
          styles.row,
          {
            borderBottomColor: colors.divider,
            borderBottomWidth: 0.5,
          },
        ]}
      >
        <View style={styles.colRight}>
          <Text
            style={[
              {
                color: colors.text,
                fontFamily: typography.fontFamily.regular,
                fontSize: typography.fontSize.lg,
              },
            ]}
          >
            {prayers?.[0]?.formatted}
          </Text>
        </View>
        <View style={styles.colLeft}>
          <Text
            style={[
              {
                fontSize: typography.fontSize.lg,
                color: colors.text,
                fontFamily: typography.fontFamily.regular,
              },
            ]}
          >
            {prayers?.[1]?.formatted}
          </Text>
        </View>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // marginVertical: 5,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 1,
    paddingHorizontal: 20,
    gap: 100,
  },
  headerRow: {
    borderBottomWidth: 1,
    paddingVertical: 1,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  colLeft: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',
  },
  colRight: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',
  },
});
