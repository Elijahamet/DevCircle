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

export default function SplashScreen() {
  const router = useRouter();
  const { colors } = useDevCircle();

  const [fadeAnim] = useState(() => new Animated.Value(0));
  const [scaleAnim] = useState(() => new Animated.Value(0.85));
  const [pulseAnim] = useState(() => new Animated.Value(1));

  const handleNavigate = useCallback(() => {
    // When the app loads, show the landing pages
    router.replace('/onboarding');
  }, [router]);

  useEffect(() => {
    const isNative = Platform.OS !== 'web';
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

    // Subtle breathing pulse on the logo
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

    // Auto-transition timer
    const timer = setTimeout(() => {
      handleNavigate();
    }, 2200);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, pulseAnim, handleNavigate]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Background ambient glow circles */}
      <View style={styles.ambientGlowTop} />
      <View style={styles.ambientGlowBottom} />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}>
        {/* Animated DevCircle Logo with pulse */}
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <DevCircleLogo size="xl" showText={false} />
        </Animated.View>

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
        <Text style={[styles.tagline, { color: colors.textSecondary }]}>Connect. Learn. Share. Grow.</Text>

        {/* Feature Highlights Pills */}
        <View style={styles.highlightsRow}>
          <View style={[styles.highlightPill, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Ionicons name="code-working" size={14} color={colors.primary} />
            <Text style={[styles.highlightText, { color: colors.text }]}>Code</Text>
          </View>
          <View style={[styles.highlightPill, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Ionicons name="people" size={14} color={colors.primary} />
            <Text style={[styles.highlightText, { color: colors.text }]}>Community</Text>
          </View>
          <View style={[styles.highlightPill, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <Ionicons name="rocket" size={14} color={colors.primary} />
            <Text style={[styles.highlightText, { color: colors.text }]}>Projects</Text>
          </View>
        </View>
      </Animated.View>

      {/* Bottom status and direct tap to enter */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleNavigate}
        style={[styles.bottomTap, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
        <Text style={[styles.bottomTapText, { color: colors.textSecondary }]}>Tap anywhere to continue</Text>
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
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
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
