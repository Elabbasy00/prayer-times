import { useTheme } from '../../hooks';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from '../ui/Icon';
import { PrayerTimeEntry } from '@/types/prayer';
import { Language, TRANSLATIONS } from '../../constants/translations';
import { getTranslatedName } from '../../utils/formatters';
import { useUIStore } from '../../store';

function PrayerCardFull({
  prayer,
  isNext,
  isCurrent,
}: {
  prayer: PrayerTimeEntry;
  isNext: boolean;
  isCurrent: boolean;
}) {
  const { colors, borderRadius, typography, isRTL } = useTheme();
  const { language } = useUIStore();
  const t = TRANSLATIONS[language as Language] || TRANSLATIONS.en;
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderRadius: borderRadius.md,
          shadowColor: colors.surface,
          flexDirection: isRTL ? 'row-reverse' : 'row',
          ...(isNext && {
            borderColor: colors.primary,
            borderWidth: 3,
          }),
          ...(isCurrent && {
            backgroundColor: colors.primary,
          }),
        },
      ]}
    >
      <Icon
        name={prayer?.name?.toLocaleLowerCase() || ''}
        size={24}
        color={colors.text}
      />
      <View style={styles.cardContent}>
        <Text
          style={[
            {
              color: colors.primary,
              ...(isCurrent && {
                color: colors.text,
              }),
              fontFamily: typography.fontFamily.bold,
              fontSize: typography.fontSize.md,
            },
          ]}
        >
          {getTranslatedName(t, prayer?.name || '')}
        </Text>
        <Text
          style={[
            {
              color: colors.text,
              fontFamily: typography.fontFamily.medium,
              fontSize: typography.fontSize.lg,
            },
          ]}
        >
          {prayer?.formatted}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    gap: 2,

    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
});

export default PrayerCardFull;
