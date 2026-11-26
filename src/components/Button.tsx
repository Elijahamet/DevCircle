import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
  Animated,
  Pressable,
  Platform,
} from 'react-native';
import { Radius, Spacing } from '@/constants/theme';
import { useDevCircle } from '@/context/DevCircleContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  rightIcon,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const { colors } = useDevCircle();
  const isNative = Platform.OS !== 'web';
  const [scaleAnim] = useState(() => new Animated.Value(1));

  const handlePressIn = () => {
    if (disabled || loading) return;
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      friction: 5,
      tension: 100,
      useNativeDriver: isNative,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled || loading) return;
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 60,
      useNativeDriver: isNative,
    }).start();
  };

  const getContainerStyles = (): ViewStyle[] => {
    const list: ViewStyle[] = [styles.base, styles[size]];

    if (variant === 'primary') {
      list.push({
        backgroundColor: colors.primary,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.35,
        shadowRadius: 6,
        elevation: 4,
      });
    } else if (variant === 'secondary') {
      list.push({
        backgroundColor: colors.inputBackground,
        borderWidth: 1,
        borderColor: colors.cardBorder,
      });
    } else if (variant === 'outline') {
      list.push({
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: colors.primary,
      });
    } else if (variant === 'danger') {
      list.push({
        backgroundColor: colors.danger,
        shadowColor: colors.danger,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 3,
      });
    } else {
      list.push(styles.ghost);
    }

    if (fullWidth) {
      list.push(styles.fullWidth);
    }

    if (disabled || loading) {
      list.push(styles.disabled);
    }

    if (style) {
      list.push(style);
    }

    return list;
  };

  const getTextStyles = (): TextStyle[] => {
    const list: TextStyle[] = [
      styles.baseText,
      styles[`${size}Text` as keyof typeof styles] as TextStyle,
    ];

    if (variant === 'primary') {
      list.push({ color: colors.textInverse, fontWeight: '700' });
    } else if (variant === 'secondary') {
      list.push({ color: colors.text });
    } else if (variant === 'outline') {
      list.push({ color: colors.primary, fontWeight: '700' });
    } else if (variant === 'danger') {
      list.push({ color: '#FFFFFF', fontWeight: '700' });
    } else {
      list.push({ color: colors.textSecondary });
    }

    if (textStyle) {
      list.push(textStyle);
    }

    return list;
  };

  return (
    <Animated.View
      style={[
        fullWidth && styles.fullWidth,
        { transform: [{ scale: scaleAnim }] },
      ]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        style={({ pressed }) => [
          getContainerStyles(),
          pressed && styles.pressedState,
        ]}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variant === 'primary' ? colors.textInverse : colors.primary}
          />
        ) : (
          <>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <Text style={getTextStyles()}>{title}</Text>
            {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
          </>
        )}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
    gap: Spacing.sm,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.55,
  },
  pressedState: {
    opacity: 0.9,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  // Sizes
  sm: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: Radius.sm,
  },
  md: {
    paddingVertical: 11,
    paddingHorizontal: 18,
  },
  lg: {
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: Radius.lg,
  },
  // Text
  baseText: {
    fontWeight: '600',
  },
  smText: {
    fontSize: 12.5,
  },
  mdText: {
    fontSize: 14,
  },
  lgText: {
    fontSize: 16,
    fontWeight: '700',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
