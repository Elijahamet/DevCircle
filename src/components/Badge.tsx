import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Radius } from '@/constants/theme';
import { useDevCircle } from '@/context/DevCircleContext';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'info' | 'purple' | 'warning' | 'danger' | 'ghost';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'secondary',
  size = 'md',
  icon,
  style,
}) => {
  const { colors, themeMode } = useDevCircle();
  const isLight = themeMode === 'light';

  const getColors = () => {
    switch (variant) {
      case 'primary':
        return {
          bg: isLight ? 'rgba(5, 150, 105, 0.12)' : 'rgba(25, 230, 140, 0.12)',
          text: colors.primary,
          border: isLight ? 'rgba(5, 150, 105, 0.25)' : 'rgba(25, 230, 140, 0.25)',
        };
      case 'info':
        return {
          bg: isLight ? 'rgba(2, 132, 199, 0.12)' : 'rgba(56, 189, 248, 0.12)',
          text: colors.info,
          border: isLight ? 'rgba(2, 132, 199, 0.25)' : 'rgba(56, 189, 248, 0.25)',
        };
      case 'purple':
        return {
          bg: isLight ? 'rgba(147, 51, 234, 0.12)' : 'rgba(168, 85, 247, 0.12)',
          text: colors.purple,
          border: isLight ? 'rgba(147, 51, 234, 0.25)' : 'rgba(168, 85, 247, 0.25)',
        };
      case 'warning':
        return {
          bg: isLight ? 'rgba(217, 119, 6, 0.12)' : 'rgba(245, 158, 11, 0.12)',
          text: colors.warning,
          border: isLight ? 'rgba(217, 119, 6, 0.25)' : 'rgba(245, 158, 11, 0.25)',
        };
      case 'danger':
        return {
          bg: isLight ? 'rgba(220, 38, 38, 0.12)' : 'rgba(239, 68, 68, 0.12)',
          text: colors.danger,
          border: isLight ? 'rgba(220, 38, 38, 0.25)' : 'rgba(239, 68, 68, 0.25)',
        };
      case 'ghost':
        return {
          bg: 'transparent',
          text: colors.textSecondary,
          border: colors.cardBorder,
        };
      case 'secondary':
      default:
        return {
          bg: colors.inputBackground,
          text: colors.text,
          border: colors.cardBorder,
        };
    }
  };

  const c = getColors();
  const isSm = size === 'sm';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: c.bg,
          borderColor: c.border,
          paddingVertical: isSm ? 2 : 4,
          paddingHorizontal: isSm ? 8 : 10,
        },
        style,
      ]}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text style={[styles.text, { color: c.text, fontSize: isSm ? 11 : 12 }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.full,
    borderWidth: 1,
    gap: 4,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
  },
});
