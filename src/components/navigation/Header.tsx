import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../hooks';
import { Icon } from '../ui/Icon';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';

export const Header: React.FC<NativeStackHeaderProps> = ({
  navigation,
  options,
  route,
}) => {
  const insets = useSafeAreaInsets();
  const { colors, typography } = useTheme();

  const canGoBack = navigation.canGoBack();
  const title =
    options.headerTitle !== undefined
      ? options.headerTitle
      : options.title !== undefined
      ? options.title
      : route.name;

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop:
            insets.top + (options.headerStyle as any)?.paddingTop || 20,
          backgroundColor:
            (options.headerStyle as any)?.backgroundColor || 'transparent',
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.leftSection}>
          {canGoBack && (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.iconButton}
            >
              <Icon
                name="arrow-left"
                size={28}
                color={options.headerTintColor || colors.primary}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.titleContainer}>
          <Text
            numberOfLines={1}
            style={[
              styles.title,
              {
                color: options.headerTintColor || colors.text,
                fontFamily: typography.fontFamily.bold,
                fontSize: typography.fontSize.lg,
              },
              options.headerTitleStyle as any,
            ]}
          >
            {typeof title === 'string' ? title : route.name}
          </Text>
        </View>

        <View style={styles.rightSection}>
          {options.headerRight && options.headerRight({ canGoBack })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    zIndex: 100,
  },
  content: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  leftSection: {
    width: 50,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSection: {
    width: 50,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
  },
  iconButton: {
    padding: 5,
  },
});
