import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

type Props = {
  compact?: boolean;
};

export default function TypingIndicator({ compact = false }: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(anim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [anim]);

  const translate = (offset: number) => ({
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, -5, 0],
        }),
      },
      {
        translateX: new Animated.Value(offset).interpolate({
          inputRange: [0, 1],
          outputRange: [offset, offset],
        }),
      },
    ],
  });

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: Colors[colorScheme].chatBubbleOther,
          paddingVertical: compact ? 4 : 6,
          paddingHorizontal: compact ? 6 : 8,
        },
      ]}
    >
      <View style={styles.row}>
        <Animated.View
          style={[
            styles.dot,
            translate(0),
            { backgroundColor: Colors[colorScheme].primary },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            translate(10),
            { backgroundColor: Colors[colorScheme].primary },
          ]}
        />
        <Animated.View
          style={[
            styles.dot,
            translate(20),
            { backgroundColor: Colors[colorScheme].primary },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    alignSelf: 'flex-start',
    marginLeft: 12,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
});



