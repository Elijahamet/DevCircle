import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { Colors, Radius, Spacing } from '@/constants/theme';

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
  const getContainerStyles = (): ViewStyle[] => {
    const list: ViewStyle[] = [
      styles.base,
      styles[variant],
      styles[size],
    ];

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
      styles[`${variant}Text` as keyof typeof styles] as TextStyle,
      styles[`${size}Text` as keyof typeof styles] as TextStyle,
    ];

    if (textStyle) {
      list.push(textStyle);
    }

    return list;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      disabled={disabled || loading}
      style={getContainerStyles()}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? Colors.deepNavy : Colors.electricGreen}
        />
      ) : (
        <>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={getTextStyles()}>{title}</Text>
          {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
        </>
      )}
    </TouchableOpacity>
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
    opacity: 0.6,
  },
  // Variants
  primary: {
    backgroundColor: Colors.electricGreen,
    shadowColor: Colors.electricGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  secondary: {
    backgroundColor: Colors.slate,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.electricGreen,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: Colors.danger,
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
  primaryText: {
    color: Colors.deepNavy,
    fontWeight: '700',
  },
  secondaryText: {
    color: Colors.white,
  },
  outlineText: {
    color: Colors.electricGreen,
    fontWeight: '700',
  },
  ghostText: {
    color: Colors.mutedGrey,
  },
  dangerText: {
    color: Colors.white,
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
