import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Platform } from 'react-native';

interface ReactionBurstProps {
  triggerKey: number | string;
  color?: string;
  size?: number;
}

const PARTICLE_ANGLES = [0, 60, 120, 180, 240, 300];

export const ReactionBurst: React.FC<ReactionBurstProps> = ({
  triggerKey,
  color = '#19E68C',
  size = 40,
}) => {
  const [ringScale] = useState(() => new Animated.Value(0.4));
  const [ringOpacity] = useState(() => new Animated.Value(0));
  const [particleDistance] = useState(() => new Animated.Value(0));
  const [particleOpacity] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!triggerKey) {
      return;
    }

    const isNative = Platform.OS !== 'web';

    ringScale.setValue(0.4);
    ringOpacity.setValue(0.85);
    particleDistance.setValue(0);
    particleOpacity.setValue(1);

    Animated.parallel([
      Animated.timing(ringScale, {
        toValue: 2.2,
        duration: 450,
        useNativeDriver: isNative,
      }),
      Animated.timing(ringOpacity, {
        toValue: 0,
        duration: 450,
        useNativeDriver: isNative,
      }),
      Animated.spring(particleDistance, {
        toValue: size * 0.75,
        friction: 5,
        tension: 80,
        useNativeDriver: isNative,
      }),
      Animated.timing(particleOpacity, {
        toValue: 0,
        duration: 450,
        useNativeDriver: isNative,
      }),
    ]).start();
  }, [triggerKey, ringScale, ringOpacity, particleDistance, particleOpacity, size]);

  return (
    <View pointerEvents="none" style={[styles.container, { width: size, height: size }]}>
      {/* Shockwave expanding ring */}
      <Animated.View
        style={[
          styles.ring,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: color,
            opacity: ringOpacity,
            transform: [{ scale: ringScale }],
          },
        ]}
      />

      {/* Orbiting flying spark particles */}
      {PARTICLE_ANGLES.map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);

        const translateX = particleDistance.interpolate({
          inputRange: [0, size],
          outputRange: [0, size * cos],
        });
        const translateY = particleDistance.interpolate({
          inputRange: [0, size],
          outputRange: [0, size * sin],
        });

        const pSize = i % 2 === 0 ? 5 : 3.5;

        return (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                width: pSize,
                height: pSize,
                borderRadius: pSize / 2,
                backgroundColor: color,
                opacity: particleOpacity,
                transform: [{ translateX }, { translateY }],
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
  },
  ring: {
    position: 'absolute',
    borderWidth: 2,
  },
  particle: {
    position: 'absolute',
    shadowColor: '#19E68C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
});
