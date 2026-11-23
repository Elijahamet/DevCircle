import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Radius, Spacing } from '@/constants/theme';
import { Opportunity, OpportunityType } from '@/types';
import { Badge } from './Badge';
import { useDevCircle } from '@/context/DevCircleContext';

interface OpportunityCardProps {
  opportunity: Opportunity;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity }) => {
  const { toggleBookmarkOpportunity, colors } = useDevCircle();

  const getTypeBadge = (type: OpportunityType) => {
    switch (type) {
      case 'hackathon':
        return <Badge label="Hackathon" variant="primary" size="sm" />;
      case 'job':
        return <Badge label="Developer Job" variant="info" size="sm" />;
      case 'internship':
        return <Badge label="Internship" variant="purple" size="sm" />;
      case 'meetup':
        return <Badge label="Tech Meetup" variant="warning" size="sm" />;
      case 'workshop':
        return <Badge label="Workshop" variant="info" size="sm" />;
      case 'scholarship':
      default:
        return <Badge label="Fellowship" variant="ghost" size="sm" />;
    }
  };

  const handleOpen = () => {
    if (opportunity.link) {
      Linking.openURL(opportunity.link).catch(() => {
        Alert.alert('Notice', 'This opportunity listing is part of local demonstration content.');
      });
    } else {
      Alert.alert('Notice', 'This opportunity listing is part of local demonstration content.');
    }
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
        },
      ]}>
      <View style={styles.header}>
        <View style={styles.typeRow}>
          {getTypeBadge(opportunity.type)}
          <View style={styles.locationRow}>
            <Ionicons
              name={opportunity.isOnline ? 'globe-outline' : 'location-outline'}
              size={13}
              color={colors.textSecondary}
            />
            <Text
              style={[styles.locationText, { color: colors.textSecondary }]}
              numberOfLines={1}>
              {opportunity.location}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => toggleBookmarkOpportunity(opportunity.id)}
          activeOpacity={0.7}
          style={styles.bookmarkBtn}>
          <Ionicons
            name={opportunity.isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={18}
            color={opportunity.isBookmarked ? colors.primary : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <Text style={[styles.title, { color: colors.text }]}>{opportunity.title}</Text>
      <Text style={[styles.organization, { color: colors.textSecondary }]}>
        {opportunity.organization}
      </Text>

      <Text
        style={[styles.description, { color: colors.textSecondary }]}
        numberOfLines={2}>
        {opportunity.description}
      </Text>

      {/* Date & Tags row */}
      <View style={styles.footer}>
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={14} color={colors.primary} />
          <Text style={[styles.dateText, { color: colors.primary }]}>
            {opportunity.dateOrDeadline}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.detailsBtn}
          activeOpacity={0.7}
          onPress={handleOpen}>
          <Text style={styles.detailsText}>View Details</Text>
          <Ionicons name="arrow-forward" size={13} color="#07111F" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#182536',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#263548',
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginVertical: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    flex: 1,
  },
  locationText: {
    fontSize: 11,
    color: '#94A3B8',
    flex: 1,
  },
  bookmarkBtn: {
    padding: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
    lineHeight: 22,
    marginBottom: 2,
  },
  organization: {
    fontSize: 13,
    fontWeight: '600',
    color: '#19E68C',
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 18,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#1F3146',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dateText: {
    fontSize: 12,
    color: '#E2E8F0',
    fontWeight: '500',
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#19E68C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.sm,
  },
  detailsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#07111F',
  },
});
