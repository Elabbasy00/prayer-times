import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { hs } from '../../config/theme';
import { useTheme } from '../../hooks';
import { Icon } from '../ui/Icon';

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

  const opacity = useRef(new Animated.Value(0)).current;
  const slideY = useRef(new Animated.Value(100)).current;
  const shakeX = useRef(new Animated.Value(0)).current;
  const shakeLoopRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    opacity.stopAnimation();
    slideY.stopAnimation();
    shakeLoopRef.current?.stop();
    shakeLoopRef.current = null;
    shakeX.setValue(0);

    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
          isInteraction: false,
        }),
        Animated.timing(slideY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
          isInteraction: false,
        }),
      ]).start();

      const shakeLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(shakeX, {
            toValue: 10,
            duration: 50,
            useNativeDriver: true,
            isInteraction: false,
          }),
          Animated.timing(shakeX, {
            toValue: -10,
            duration: 50,
            useNativeDriver: true,
            isInteraction: false,
          }),
          Animated.timing(shakeX, {
            toValue: 10,
            duration: 50,
            useNativeDriver: true,
            isInteraction: false,
          }),
          Animated.timing(shakeX, {
            toValue: 0,
            duration: 50,
            useNativeDriver: true,
            isInteraction: false,
          }),
          Animated.delay(1500),
        ]),
      );

      shakeLoopRef.current = shakeLoop;
      shakeLoop.start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
          isInteraction: false,
        }),
        Animated.timing(slideY, {
          toValue: 100,
          duration: 300,
          useNativeDriver: true,
          isInteraction: false,
        }),
      ]).start();
    }

    return () => {
      opacity.stopAnimation();
      slideY.stopAnimation();
      shakeLoopRef.current?.stop();
      shakeLoopRef.current = null;
      shakeX.stopAnimation();
      shakeX.setValue(0);
    };
  }, [visible, opacity, slideY, shakeX]);

  return (
    <View pointerEvents="none" style={styles.bottomAnchor}>
      <Animated.View
        style={[
          styles.banner,
          {
            backgroundColor: colors.error,
            borderTopColor: `${colors.primaryLight}40`,
            paddingBottom: insets.bottom,
            opacity,
            transform: [{ translateY: slideY }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.content,
            {
              transform: [{ translateX: shakeX }],
            },
          ]}
        >
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
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomAnchor: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 1000,
  },
  banner: {
    width: '100%',
    borderTopWidth: 1,
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
