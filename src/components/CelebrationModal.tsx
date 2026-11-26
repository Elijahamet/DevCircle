import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Radius, Spacing } from '@/constants/theme';
import { Button } from './Button';
import { useDevCircle } from '@/context/DevCircleContext';

const { width } = Dimensions.get('window');

interface CelebrationModalProps {
  visible: boolean;
  title: string;
  subtitle: string;
  badgeText?: string;
  buttonText?: string;
  onConfirm: () => void;
}

const CONFETTI_COLORS = [
  '#19E68C',
  '#38BDF8',
  '#F59E0B',
  '#EC4899',
  '#A855F7',
  '#10B981',
];

const PARTICLES = Array.from({ length: 16 }, (_, i) => {
  const angle = (i * 360) / 16;
  const rad = (angle * Math.PI) / 180;
  return {
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    cos: Math.cos(rad),
    sin: Math.sin(rad),
    size: i % 3 === 0 ? 9 : i % 2 === 0 ? 7 : 5,
    isSquare: i % 2 === 0,
    speed: 0.8 + (i % 5) * 0.15,
  };
});

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  visible,
  title,
  subtitle,
  badgeText = 'SUCCESS',
  buttonText = 'Awesome, View Now',
  onConfirm,
}) => {
  const { colors } = useDevCircle();
  const isNative = Platform.OS !== 'web';

  const [backdropOpacity] = useState(() => new Animated.Value(0));
  const [cardScale] = useState(() => new Animated.Value(0.7));
  const [checkmarkScale] = useState(() => new Animated.Value(0));
  const [shockwaveScale] = useState(() => new Animated.Value(0.5));
  const [shockwaveOpacity] = useState(() => new Animated.Value(0));
  const [particleDistance] = useState(() => new Animated.Value(0));
  const [particleOpacity] = useState(() => new Animated.Value(0));
  const [particleRotation] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      backdropOpacity.setValue(0);
      cardScale.setValue(0.7);
      checkmarkScale.setValue(0);
      shockwaveScale.setValue(0.5);
      shockwaveOpacity.setValue(0.9);
      particleDistance.setValue(0);
      particleOpacity.setValue(1);
      particleRotation.setValue(0);

      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: isNative,
        }),
        Animated.spring(cardScale, {
          toValue: 1,
          friction: 6,
          tension: 70,
          useNativeDriver: isNative,
        }),
        Animated.sequence([
          Animated.delay(150),
          Animated.spring(checkmarkScale, {
            toValue: 1,
            friction: 4,
            tension: 80,
            useNativeDriver: isNative,
          }),
        ]),
        Animated.sequence([
          Animated.delay(100),
          Animated.parallel([
            Animated.timing(shockwaveScale, {
              toValue: 2.8,
              duration: 700,
              useNativeDriver: isNative,
            }),
            Animated.timing(shockwaveOpacity, {
              toValue: 0,
              duration: 700,
              useNativeDriver: isNative,
            }),
            Animated.spring(particleDistance, {
              toValue: 90,
              friction: 5,
              tension: 60,
              useNativeDriver: isNative,
            }),
            Animated.timing(particleRotation, {
              toValue: 1,
              duration: 800,
              useNativeDriver: isNative,
            }),
            Animated.sequence([
              Animated.delay(350),
              Animated.timing(particleOpacity, {
                toValue: 0,
                duration: 400,
                useNativeDriver: isNative,
              }),
            ]),
          ]),
        ]),
      ]).start();
    }
  }, [
    visible,
    backdropOpacity,
    cardScale,
    checkmarkScale,
    shockwaveScale,
    shockwaveOpacity,
    particleDistance,
    particleOpacity,
    particleRotation,
    isNative,
  ]);

  if (!visible) return null;

  const spin = particleRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[styles.backdrop, { opacity: backdropOpacity }]}
        />

        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.cardBorder,
              transform: [{ scale: cardScale }],
            },
          ]}>
          {/* Confetti & Shockwave burst area */}
          <View style={styles.burstContainer}>
            {/* Shockwave expanding ring */}
            <Animated.View
              style={[
                styles.shockwaveRing,
                {
                  borderColor: colors.primary,
                  opacity: shockwaveOpacity,
                  transform: [{ scale: shockwaveScale }],
                },
              ]}
            />

            {/* Confetti particles */}
            {PARTICLES.map((p) => {
              const translateX = particleDistance.interpolate({
                inputRange: [0, 90],
                outputRange: [0, 90 * p.cos * p.speed],
              });
              const translateY = particleDistance.interpolate({
                inputRange: [0, 90],
                outputRange: [0, 90 * p.sin * p.speed],
              });

              return (
                <Animated.View
                  key={p.id}
                  style={[
                    styles.particle,
                    {
                      width: p.size,
                      height: p.size,
                      borderRadius: p.isSquare ? 2 : p.size / 2,
                      backgroundColor: p.color,
                      opacity: particleOpacity,
                      transform: [{ translateX }, { translateY }, { rotate: spin }],
                    },
                  ]}
                />
              );
            })}

            {/* Main Checkmark Bubble */}
            <Animated.View
              style={[
                styles.checkmarkCircle,
                {
                  backgroundColor: colors.primary,
                  transform: [{ scale: checkmarkScale }],
                },
              ]}>
              <Ionicons name="checkmark" size={38} color="#07111F" />
            </Animated.View>
          </View>

          {/* Badge */}
          <View style={[styles.badge, { backgroundColor: colors.inputBackground, borderColor: colors.primary }]}>
            <Ionicons name="sparkles" size={13} color={colors.primary} />
            <Text style={[styles.badgeText, { color: colors.primary }]}>
              {badgeText}
            </Text>
          </View>

          {/* Title & Subtitle */}
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>

          {/* Action Button */}
          <View style={styles.btnWrapper}>
            <Button
              title={buttonText}
              onPress={onConfirm}
              variant="primary"
              size="lg"
              fullWidth
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(7, 17, 31, 0.85)',
  },
  card: {
    width: Math.min(width - 40, 380),
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    padding: Spacing.xl,
    alignItems: 'center',
    shadowColor: '#19E68C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 10,
  },
  burstContainer: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    position: 'relative',
  },
  shockwaveRing: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2.5,
  },
  particle: {
    position: 'absolute',
    shadowColor: '#19E68C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
  },
  checkmarkCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#19E68C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
    marginBottom: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  btnWrapper: {
    width: '100%',
  },
});
