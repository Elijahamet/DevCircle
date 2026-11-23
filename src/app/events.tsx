import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Radius, Spacing } from '@/constants/theme';
import { OpportunityCard } from '@/components/OpportunityCard';
import { FilterPills, FilterItem } from '@/components/FilterPills';
import { EmptyState } from '@/components/EmptyState';
import { useDevCircle } from '@/context/DevCircleContext';
import { OpportunityType } from '@/types';

const OPP_FILTERS: FilterItem[] = [
  { id: 'all', label: 'All Opportunities' },
  { id: 'hackathon', label: 'Hackathons' },
  { id: 'job', label: 'Developer Jobs' },
  { id: 'meetup', label: 'Meetups' },
  { id: 'internship', label: 'Internships' },
  { id: 'workshop', label: 'Workshops' },
  { id: 'scholarship', label: 'Fellowships' },
];

export default function EventsScreen() {
  const router = useRouter();
  const { opportunities, colors } = useDevCircle();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredOpportunities = useMemo(() => {
    if (selectedFilter === 'all') return opportunities;
    return opportunities.filter((o) => o.type === (selectedFilter as OpportunityType));
  }, [opportunities, selectedFilter]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.headerBg,
            borderBottomColor: colors.headerBorder,
          },
        ]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Events & Opportunities</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Demonstration Banner */}
      <View
        style={[
          styles.demoNotice,
          {
            backgroundColor: colors.card,
            borderColor: colors.cardBorder,
          },
        ]}>
        <Ionicons name="information-circle-outline" size={16} color={colors.info} />
        <Text style={[styles.demoNoticeText, { color: colors.textSecondary }]}>
          Demonstration listings for Ghanaian tech events, meetups, internships and developer roles.
        </Text>
      </View>

      {/* Filters */}
      <FilterPills
        items={OPP_FILTERS}
        selectedId={selectedFilter}
        onSelect={setSelectedFilter}
      />

      {/* Opportunities List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {filteredOpportunities.length > 0 ? (
          filteredOpportunities.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))
        ) : (
          <EmptyState
            icon="calendar-outline"
            title="No Opportunities in this Category"
            description="Check back soon or explore other tech meetups and hackathons in Ghana."
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07111F',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#121F30',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#132235',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  demoNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0C1B2A',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    marginHorizontal: Spacing.md,
    marginTop: 10,
    borderRadius: Radius.md,
  },
  demoNoticeText: {
    fontSize: 12,
    color: '#7DD3FC',
    flex: 1,
    lineHeight: 16,
  },
  scrollContent: {
    paddingVertical: 10,
    paddingBottom: 32,
  },
});
