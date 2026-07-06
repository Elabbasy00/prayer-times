import { useUIStore } from '../../store';
import { useTheme } from '../../hooks';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';

export default function Clock() {
  const [date, setDate] = useState(new Date());
  const { colors, typography, textAlign } = useTheme();
  const { language } = useUIStore();

  useEffect(() => {
    const timerID = setInterval(() => tick(), 1000);
    return () => clearInterval(timerID);
  }, []);

  const tick = useCallback(() => {
    setDate(new Date());
  }, []);

  const options: any = { hour: '2-digit', minute: '2-digit', hour12: true };
  const timeString = useMemo(
    () =>
      language == 'ar'
        ? date
            .toLocaleTimeString('en-GB', options)
            .toLocaleLowerCase()
            .replace('am', 'ص')
            .replace('pm', 'م')
        : date.toLocaleTimeString('en-GB', options).toLocaleLowerCase(),
    [date, language],
  );

  return (
    <View style={styles.container}>
      <Text
        numberOfLines={1}
        ellipsizeMode="clip"
        style={[
          {
            color: colors.primary,
            fontSize: typography.fontSize.display,
            fontFamily: typography.fontFamily.bold,
            textAlign,
          },
        ]}
      >
        {timeString}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
});
