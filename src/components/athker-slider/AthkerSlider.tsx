import { AthkerItem } from '../../constants/athker';
import React from 'react';
import { View, StyleSheet } from 'react-native';

import { Marquee } from '@animatereactnative/marquee';
import { AthkerCard } from './AthkerMarqueeCard';

export const AthkerMarquee = React.memo(({ data }: { data: AthkerItem[] }) => {
  return (
    <Marquee speed={1.8} spacing={10} reverse>
      <View style={styles.row}>
        {data.map((item, index) => (
          <AthkerCard key={index} text={item.ar} />
        ))}
      </View>
    </Marquee>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
