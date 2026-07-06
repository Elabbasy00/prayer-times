import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks';
import { Icon } from '../ui/Icon';
import { hs } from '../../config/theme';

interface NotificationBannerProps {
  message: string;
  icon?: string;
  visible: boolean;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  message,
  icon = 'bell',
  visible,
}) => {
  const insets = useSafeAreaInsets();
  const { colors, spacing, typography } = useTheme();
  const [fadeAnim] = React.useState(new Animated.Value(0));
  const [shakeAnim] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    // Fade in/out
    Animated.timing(fadeAnim, {
      toValue: visible ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Shake animation (flushing)
    if (visible) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shakeAnim, {
            toValue: 10,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: -10,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 10,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnim, {
            toValue: 0,
            duration: 50,
            useNativeDriver: true,
          }),
          Animated.delay(1500), // Shake every 1.5s
        ]),
      ).start();
    } else {
      shakeAnim.setValue(0);
    }
  }, [visible, fadeAnim, shakeAnim]);

  if (!visible && (fadeAnim as any)._value === 0) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.error, // Vibrant Green
          borderTopColor: colors.primaryLight + '40',
          paddingBottom: insets.bottom,
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [100, 0],
              }),
            },
            { translateX: shakeAnim },
          ],
        },
      ]}
    >
      <View style={styles.content}>
        <Icon name={icon as any} size={24} color={colors.textOnPrimary} />
        <Text
          style={[
            styles.text,
            {
              color: colors.textOnPrimary,
              fontFamily: typography.fontFamily.bold,
              fontSize: typography.fontSize.md,
              marginLeft: spacing.sm,
            },
          ]}
        >
          {message}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    zIndex: 1000,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: hs(100),
    paddingHorizontal: 20,
  },
  text: {
    flexShrink: 1,
    textAlign: 'center',
  },
});
