import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDevCircle } from '@/context/DevCircleContext';

interface DevCircleLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textSize?: number;
}

export const DevCircleLogo: React.FC<DevCircleLogoProps> = ({
  size = 'md',
  showText = true,
  textSize,
}) => {
  const { colors } = useDevCircle();
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

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.logoBox,
          {
            width: dim.boxSize,
            height: dim.boxSize,
            borderRadius: dim.boxSize * 0.32,
            borderWidth: dim.borderW,
            backgroundColor: colors.inputBackground,
            borderColor: colors.primary,
          },
        ]}>
        {/* Modern code bracket mark */}
        <View style={styles.innerMark}>
          <Ionicons name="code-slash" size={dim.iconSize} color={colors.primary} />
        </View>
        {/* Tech dot highlight */}
        <View
          style={[
            styles.glowDot,
            {
              width: dim.boxSize * 0.22,
              height: dim.boxSize * 0.22,
              borderRadius: (dim.boxSize * 0.22) / 2,
              backgroundColor: colors.primary,
              borderColor: colors.background,
            },
          ]}
        />
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
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
