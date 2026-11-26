import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useDevCircle } from '@/context/DevCircleContext';
import { DevCircleLogo } from '@/components/DevCircleLogo';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const FLOATING_NODES = [
  { id: 1, top: height * 0.18, left: width * 0.12, size: 7, color: '#19E68C' },
  { id: 2, top: height * 0.24, right: width * 0.15, size: 5, color: '#38BDF8' },
  { id: 3, top: height * 0.68, left: width * 0.16, size: 6, color: '#F59E0B' },
  { id: 4, top: height * 0.74, right: width * 0.14, size: 8, color: '#19E68C' },
];

export default function SplashScreen() {
  const router = useRouter();
  const { colors } = useDevCircle();
  const isNative = Platform.OS !== 'web';

  const [fadeAnim] = useState(() => new Animated.Value(0));
  const [scaleAnim] = useState(() => new Animated.Value(0.85));
  const [pulseAnim] = useState(() => new Animated.Value(1));

  // Multi-tier radar shockwaves
  const [wave1Scale] = useState(() => new Animated.Value(1));
  const [wave1Opacity] = useState(() => new Animated.Value(0.5));
  const [wave2Scale] = useState(() => new Animated.Value(1));
  const [wave2Opacity] = useState(() => new Animated.Value(0.3));

  // Floating tech nodes drift
  const [floatAnim] = useState(() => new Animated.Value(0));

  const handleNavigate = useCallback(() => {
    router.replace('/onboarding');
  }, [router]);

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: isNative,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: isNative,
      }),
    ]).start();

    // Breathing pulse on the logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1200,
          useNativeDriver: isNative,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: isNative,
        }),
      ])
    ).start();

    // Wave 1 loop
    Animated.loop(
      Animated.parallel([
        Animated.timing(wave1Scale, {
          toValue: 2.2,
          duration: 2200,
          useNativeDriver: isNative,
        }),
        Animated.sequence([
          Animated.timing(wave1Opacity, {
            toValue: 0.6,
            duration: 600,
            useNativeDriver: isNative,
          }),
          Animated.timing(wave1Opacity, {
            toValue: 0,
            duration: 1600,
            useNativeDriver: isNative,
          }),
        ]),
      ])
    ).start();

    // Wave 2 loop (staggered)
    const wave2Timer = setTimeout(() => {
      Animated.loop(
        Animated.parallel([
          Animated.timing(wave2Scale, {
            toValue: 2.6,
            duration: 2400,
            useNativeDriver: isNative,
          }),
          Animated.sequence([
            Animated.timing(wave2Opacity, {
              toValue: 0.45,
              duration: 700,
              useNativeDriver: isNative,
            }),
            Animated.timing(wave2Opacity, {
              toValue: 0,
              duration: 1700,
              useNativeDriver: isNative,
            }),
          ]),
        ])
      ).start();
    }, 700);

    // Floating tech nodes drift loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2500,
          useNativeDriver: isNative,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: isNative,
        }),
      ])
    ).start();

    // Auto-transition timer
    const timer = setTimeout(() => {
      handleNavigate();
    }, 2400);

    return () => {
      clearTimeout(timer);
      clearTimeout(wave2Timer);
    };
  }, [
    fadeAnim,
    scaleAnim,
    pulseAnim,
    wave1Scale,
    wave1Opacity,
    wave2Scale,
    wave2Opacity,
    floatAnim,
    handleNavigate,
    isNative,
  ]);

  const floatY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -12],
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Background ambient glow circles */}
      <View style={styles.ambientGlowTop} />
      <View style={styles.ambientGlowBottom} />

      {/* Floating tech nodes */}
      {FLOATING_NODES.map((node) => (
        <Animated.View
          key={node.id}
          pointerEvents="none"
          style={[
            styles.floatingNode,
            {
              top: node.top,
              left: node.left,
              right: node.right,
              width: node.size,
              height: node.size,
              borderRadius: node.size / 2,
              backgroundColor: node.color,
              shadowColor: node.color,
              transform: [{ translateY: floatY }],
            },
          ]}
        />
      ))}

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}>
        {/* Radar shockwaves wrapper */}
        <View style={styles.logoAndRadarWrapper}>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.radarRing,
              {
                borderColor: colors.primary,
                opacity: wave1Opacity,
                transform: [{ scale: wave1Scale }],
              },
            ]}
          />
          <Animated.View
            pointerEvents="none"
            style={[
              styles.radarRing,
              {
                borderColor: colors.primary,
                opacity: wave2Opacity,
                transform: [{ scale: wave2Scale }],
              },
            ]}
          />

          {/* Animated DevCircle Logo with pulse */}
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <DevCircleLogo size="xl" showText={false} />
          </Animated.View>
        </View>

        {/* App Title */}
        <View style={styles.titleContainer}>
          <Text style={[styles.titleText, { color: colors.text }]}>
            Dev<Text style={[styles.greenText, { color: colors.primary }]}>Circle</Text>
          </Text>
          <View style={styles.ghanaBadge}>
            <Text style={styles.ghanaBadgeText}>GHANA TECH COMMUNITY</Text>
          </View>
        </View>

        {/* Tagline */}
        <Text style={[styles.tagline, { color: colors.textSecondary }]}>
          Connect. Learn. Share. Grow.
        </Text>

        {/* Feature Highlights Pills */}
        <View style={styles.highlightsRow}>
          <View
            style={[
              styles.highlightPill,
              { backgroundColor: colors.card, borderColor: colors.cardBorder },
            ]}>
            <Ionicons name="code-working" size={14} color={colors.primary} />
            <Text style={[styles.highlightText, { color: colors.text }]}>Code</Text>
          </View>
          <View
            style={[
              styles.highlightPill,
              { backgroundColor: colors.card, borderColor: colors.cardBorder },
            ]}>
            <Ionicons name="people" size={14} color={colors.primary} />
            <Text style={[styles.highlightText, { color: colors.text }]}>Community</Text>
          </View>
          <View
            style={[
              styles.highlightPill,
              { backgroundColor: colors.card, borderColor: colors.cardBorder },
            ]}>
            <Ionicons name="rocket" size={14} color={colors.primary} />
            <Text style={[styles.highlightText, { color: colors.text }]}>Projects</Text>
          </View>
        </View>
      </Animated.View>

      {/* Bottom status and direct tap to enter */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleNavigate}
        style={[
          styles.bottomTap,
          { backgroundColor: colors.card, borderColor: colors.cardBorder },
        ]}>
        <Text style={[styles.bottomTapText, { color: colors.textSecondary }]}>
          Tap anywhere to continue
        </Text>
        <Ionicons name="chevron-forward" size={14} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07111F',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ambientGlowTop: {
    position: 'absolute',
    top: height * 0.15,
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: (width * 0.7) / 2,
    backgroundColor: 'rgba(25, 230, 140, 0.05)',
  },
  ambientGlowBottom: {
    position: 'absolute',
    bottom: height * 0.1,
    right: -40,
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: (width * 0.6) / 2,
    backgroundColor: 'rgba(56, 189, 248, 0.04)',
  },
  floatingNode: {
    position: 'absolute',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 4,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoAndRadarWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarRing: {
    position: 'absolute',
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 28,
  },
  titleText: {
    fontSize: 38,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: -1,
  },
  greenText: {
    color: '#19E68C',
  },
  ghanaBadge: {
    backgroundColor: 'rgba(25, 230, 140, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(25, 230, 140, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 10,
  },
  ghanaBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#19E68C',
    letterSpacing: 1.2,
  },
  tagline: {
    fontSize: 16,
    color: '#94A3B8',
    marginTop: 16,
    letterSpacing: 0.5,
    fontWeight: '500',
    textAlign: 'center',
  },
  highlightsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 32,
  },
  highlightPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#132235',
    borderWidth: 1,
    borderColor: '#203248',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  highlightText: {
    fontSize: 12,
    color: '#F8FAFC',
    fontWeight: '600',
  },
  bottomTap: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#0E1A29',
    borderWidth: 1,
    borderColor: '#1D2E44',
  },
  bottomTapText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  },
});
