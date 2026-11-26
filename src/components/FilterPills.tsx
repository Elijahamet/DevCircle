import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  Animated,
  Pressable,
  Platform,
} from 'react-native';
import { Radius, Spacing } from '@/constants/theme';
import { useDevCircle } from '@/context/DevCircleContext';

export interface FilterItem {
  id: string;
  label: string;
  icon?: string;
}

interface FilterPillsProps {
  items: FilterItem[];
  selectedId: string;
  onSelect: (id: string) => void;
}

interface AnimatedPillProps {
  item: FilterItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
  colors: any;
}

const AnimatedPill: React.FC<AnimatedPillProps> = ({
  item,
  isSelected,
  onSelect,
  colors,
}) => {
  const isNative = Platform.OS !== 'web';
  const [scaleAnim] = useState(() => new Animated.Value(1));

  useEffect(() => {
    if (isSelected) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.08,
          duration: 140,
          useNativeDriver: isNative,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 70,
          useNativeDriver: isNative,
        }),
      ]).start();
    }
  }, [isSelected, scaleAnim, isNative]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.92,
      friction: 5,
      tension: 100,
      useNativeDriver: isNative,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 60,
      useNativeDriver: isNative,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={() => onSelect(item.id)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.pill,
          {
            backgroundColor: isSelected
              ? colors.primary
              : colors.inputBackground,
            borderColor: isSelected
              ? colors.primary
              : colors.cardBorder,
            shadowColor: isSelected ? colors.primary : 'transparent',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: isSelected ? 0.35 : 0,
            shadowRadius: 5,
            elevation: isSelected ? 3 : 0,
          },
        ]}>
        <Text
          style={[
            styles.label,
            {
              color: isSelected
                ? colors.textInverse
                : colors.textSecondary,
            },
            isSelected && styles.labelSelected,
          ]}>
          {item.label}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

export const FilterPills: React.FC<FilterPillsProps> = ({
  items,
  selectedId,
  onSelect,
}) => {
  const { colors } = useDevCircle();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderBottomColor: colors.headerBorder,
        },
      ]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {items.map((item) => (
          <AnimatedPill
            key={item.id}
            item={item}
            isSelected={item.id === selectedId}
            onSelect={onSelect}
            colors={colors}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    backgroundColor: '#07111F',
    borderBottomWidth: 1,
    borderBottomColor: '#121F30',
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: '#132235',
    borderWidth: 1,
    borderColor: '#203248',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
  },
  labelSelected: {
    color: '#07111F',
    fontWeight: '700',
  },
});
