import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Radius, Spacing } from '@/constants/theme';

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

export const FilterPills: React.FC<FilterPillsProps> = ({
  items,
  selectedId,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {items.map((item) => {
          const isSelected = item.id === selectedId;
          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.75}
              onPress={() => onSelect(item.id)}
              style={[
                styles.pill,
                isSelected && styles.pillSelected,
              ]}>
              <Text
                style={[
                  styles.label,
                  isSelected && styles.labelSelected,
                ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
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
  pillSelected: {
    backgroundColor: '#19E68C',
    borderColor: '#19E68C',
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
