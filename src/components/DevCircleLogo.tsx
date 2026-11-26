import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDevCircle } from '@/context/DevCircleContext';

interface DevCircleLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textSize?: number;
  interactive?: boolean;
  onPress?: () => void;
}

export const DevCircleLogo: React.FC<DevCircleLogoProps> = ({
  size = 'md',
  showText = true,
  textSize,
  interactive = true,
  onPress,
}) => {
  const { colors } = useDevCircle();
  const isNative = Platform.OS !== 'web';

  const [pulseAnim] = useState(() => new Animated.Value(1));
  const [radarScale] = useState(() => new Animated.Value(1));
  const [radarOpacity] = useState(() => new Animated.Value(0.4));
  const [spinAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    // Breathing pulse for tech dot
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.35,
          duration: 1100,
          useNativeDriver: isNative,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1100,
          useNativeDriver: isNative,
        }),
      ])
    );

    // Continuous expanding radar wave
    const radarLoop = Animated.loop(
      Animated.parallel([
        Animated.timing(radarScale, {
          toValue: 1.6,
          duration: 1800,
          useNativeDriver: isNative,
        }),
        Animated.sequence([
          Animated.timing(radarOpacity, {
            toValue: 0.6,
            duration: 500,
            useNativeDriver: isNative,
          }),
          Animated.timing(radarOpacity, {
            toValue: 0,
            duration: 1300,
            useNativeDriver: isNative,
          }),
        ]),
      ])
    );

    pulseLoop.start();
    radarLoop.start();

    return () => {
      pulseLoop.stop();
      radarLoop.stop();
    };
  }, [pulseAnim, radarScale, radarOpacity, isNative]);

  const handleTap = () => {
    // Spin 360 with a spring overshoot!
    spinAnim.setValue(0);
    Animated.spring(spinAnim, {
      toValue: 1,
      friction: 4,
      tension: 60,
      useNativeDriver: isNative,
    }).start();

    if (onPress) {
      onPress();
    }
  };

  const getDimensions = () => {
    switch (size) {
      case 'sm':
        return { boxSize: 32, iconSize: 18, fontSize: 18, borderW: 1.5 };
      case 'lg':
        return { boxSize: 64, iconSize: 36, fontSize: 30, borderW: 2.5 };
      case 'xl':
        return { boxSize: 96, iconSize: 52, fontSize: 40, borderW: 3 };
      case 'md':
      default:
        return { boxSize: 42, iconSize: 24, fontSize: 22, borderW: 2 };
    }
  };

  const dim = getDimensions();

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const content = (
    <View style={styles.container}>
      <View style={styles.logoWrapper}>
        {/* Radar wave pulse ring */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.radarWave,
            {
              width: dim.boxSize,
              height: dim.boxSize,
              borderRadius: dim.boxSize * 0.35,
              borderColor: colors.primary,
              opacity: radarOpacity,
              transform: [{ scale: radarScale }],
            },
          ]}
        />

        {/* Main Logo Box */}
        <Animated.View
          style={[
            styles.logoBox,
            {
              width: dim.boxSize,
              height: dim.boxSize,
              borderRadius: dim.boxSize * 0.32,
              borderWidth: dim.borderW,
              backgroundColor: colors.inputBackground,
              borderColor: colors.primary,
              transform: [{ rotate: spin }],
            },
          ]}>
          {/* Modern code bracket mark */}
          <View style={styles.innerMark}>
            <Ionicons name="code-slash" size={dim.iconSize} color={colors.primary} />
          </View>

          {/* Pulsing Tech Dot Highlight */}
          <Animated.View
            style={[
              styles.glowDot,
              {
                width: dim.boxSize * 0.22,
                height: dim.boxSize * 0.22,
                borderRadius: (dim.boxSize * 0.22) / 2,
                backgroundColor: colors.primary,
                borderColor: colors.background,
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />
        </Animated.View>
      </View>

      {showText && (
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.brandText,
              { fontSize: textSize || dim.fontSize, color: colors.text },
            ]}>
            Dev<Text style={[styles.greenText, { color: colors.primary }]}>Circle</Text>
          </Text>
        </View>
      )}
    </View>
  );

  if (interactive) {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={handleTap}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarWave: {
    position: 'absolute',
    borderWidth: 1.5,
  },
  logoBox: {
    backgroundColor: '#0F1D30',
    borderColor: '#19E68C',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#19E68C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  innerMark: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#19E68C',
    borderWidth: 2,
    borderColor: '#07111F',
    shadowColor: '#19E68C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  textContainer: {
    justifyContent: 'center',
  },
  brandText: {
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: -0.5,
  },
  greenText: {
    color: '#19E68C',
  },
});
