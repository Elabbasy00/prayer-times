import React from 'react';
import { View, ViewStyle, StatusBar } from 'react-native';
import { useTheme } from '../../hooks';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  useSafeArea?: boolean;
  backgroundColor?: string;
}

const Container: React.FC<ContainerProps> = ({
  children,
  style,
  useSafeArea = true,
  backgroundColor,
}) => {
  const { colors, layout } = useTheme();

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: backgroundColor || colors.background,
    paddingHorizontal: layout.containerPadding,
  };

  if (useSafeArea) {
    return (
      <SafeAreaView style={[containerStyle, style]}>
        <StatusBar
          barStyle={
            colors.background === '#FFFFFF' ? 'dark-content' : 'light-content'
          }
          backgroundColor={colors.background}
        />
        {children}
      </SafeAreaView>
    );
  }

  return <View style={[containerStyle, style]}>{children}</View>;
};

export default Container;
