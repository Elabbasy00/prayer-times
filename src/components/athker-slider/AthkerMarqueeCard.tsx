import { normalize } from '../../config/theme';
import { useTheme } from '../../hooks';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  text: string;
};

export const AthkerCard: React.FC<Props> = React.memo(({ text }) => {
  const { colors, borderRadius, typography } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          borderRadius: borderRadius.round,
          borderRightWidth: normalize(5),
          borderLeftWidth: normalize(5),
          borderTopWidth: 1,
          borderBottomWidth: 0.5,
          borderLeftColor: colors.primaryLight,
          borderRightColor: colors.primaryLight,
          borderTopColor: colors.primaryLight,
          borderBottomColor: colors.primaryLight,
          padding: 5,
        },
      ]}
    >
      <Text
        numberOfLines={1}
        style={[
          styles.text,
          {
            color: colors.primaryLight,
            fontSize: typography.fontSize.lg,
            // fontWeight: typography.fontWeight.bold, // Removed to prevent crash with custom font
            fontFamily: typography.fontFamily.bold,
          },
        ]}
        // numberOfLines={0}
        // ellipsizeMode="clip"
      >
        {text}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    width: 'auto',
    // height: 64, // Removed fixed height to prevent cropping
    // paddingVertical: 5, // Added padding instead
    paddingHorizontal: 20,
    marginHorizontal: 10,

    justifyContent: 'center',
  },
  text: {},
});
