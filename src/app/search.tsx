import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { Avatar } from '@/components/Avatar';
import { PostCard } from '@/components/PostCard';
import { ProjectCard } from '@/components/ProjectCard';
import { OpportunityCard } from '@/components/OpportunityCard';
import { FilterPills, FilterItem } from '@/components/FilterPills';
import { EmptyState } from '@/components/EmptyState';
import { useDevCircle } from '@/context/DevCircleContext';

const SEARCH_TABS: FilterItem[] = [
  { id: 'all', label: 'All Results' },
  { id: 'posts', label: 'Discussions' },
  { id: 'people', label: 'Developers' },
  { id: 'projects', label: 'Projects' },
  { id: 'events', label: 'Opportunities' },
];

const TRENDING_SEARCHES = [
  'Paystack Webhooks',
  'MTN MoMo API',
  'React Native Ghana',
  'Kubernetes Kumasi',
  'Akan NLP Dataset',
  'Remote US Contracts',
];

export default function SearchScreen() {
  const { q } = useLocalSearchParams<{ q?: string }>();
  const router = useRouter();
  const {
    posts,
    users,
    projects,
    opportunities,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    followingUserIds,
    toggleFollowUser,
  } = useDevCircle();

  const [query, setQuery] = useState(q || '');
  const [activeTab, setActiveTab] = useState('all');

  const handleSearchSubmit = () => {
    if (query.trim()) {
      addRecentSearch(query.trim());
    }
  };

  const handleSelectRecent = (term: string) => {
    setQuery(term);
    addRecentSearch(term);
  };

  // Search Results Filtering
  const cleanQ = query.trim().toLowerCase();

  const matchedPeople = useMemo(() => {
    if (!cleanQ) return [];
    return Object.values(users).filter(
      (u) =>
        u.name.toLowerCase().includes(cleanQ) ||
        u.username.toLowerCase().includes(cleanQ) ||
        u.role.toLowerCase().includes(cleanQ) ||
        u.location.toLowerCase().includes(cleanQ) ||
        u.skills.some((s) => s.toLowerCase().includes(cleanQ))
    );
  }, [users, cleanQ]);

  const matchedPosts = useMemo(() => {
    if (!cleanQ) return [];
    return posts.filter(
      (p) =>
        (p.title && p.title.toLowerCase().includes(cleanQ)) ||
        p.content.toLowerCase().includes(cleanQ) ||
        p.tags.some((t) => t.toLowerCase().includes(cleanQ)) ||
        (p.codeSnippet && p.codeSnippet.code.toLowerCase().includes(cleanQ))
    );
  }, [posts, cleanQ]);

  const matchedProjects = useMemo(() => {
    if (!cleanQ) return [];
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(cleanQ) ||
        p.description.toLowerCase().includes(cleanQ) ||
        p.technologies.some((t) => t.toLowerCase().includes(cleanQ))
    );
  }, [projects, cleanQ]);

  const matchedEvents = useMemo(() => {
    if (!cleanQ) return [];
    return opportunities.filter(
      (o) =>
        o.title.toLowerCase().includes(cleanQ) ||
        o.organization.toLowerCase().includes(cleanQ) ||
        o.description.toLowerCase().includes(cleanQ) ||
        o.tags.some((t) => t.toLowerCase().includes(cleanQ))
    );
  }, [opportunities, cleanQ]);

  const totalResultsCount =
    matchedPosts.length +
    matchedPeople.length +
    matchedProjects.length +
    matchedEvents.length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Search Input Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <Ionicons name="search-outline" size={18} color={Colors.mutedGrey} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search code, posts, people, jobs..."
            placeholderTextColor="#64748B"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
            autoFocus={!q}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={18} color="#64748B" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Tabs if we have a query */}
      {cleanQ.length > 0 && (
        <FilterPills
          items={SEARCH_TABS}
          selectedId={activeTab}
          onSelect={setActiveTab}
        />
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        {cleanQ.length === 0 ? (
          /* Recent & Trending Searches */
          <View style={styles.suggestionsContainer}>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <View style={styles.suggestionBlock}>
                <View style={styles.sectionTitleRow}>
                  <Text style={styles.sectionTitle}>Recent Searches</Text>
                  <TouchableOpacity onPress={clearRecentSearches}>
                    <Text style={styles.clearText}>Clear All</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.chipsWrap}>
                  {recentSearches.map((term, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={styles.searchChip}
                      onPress={() => handleSelectRecent(term)}>
                      <Ionicons name="time-outline" size={14} color="#94A3B8" />
                      <Text style={styles.searchChipText}>{term}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Trending Ghanaian Searches */}
            <View style={styles.suggestionBlock}>
              <Text style={styles.sectionTitle}>Trending in Ghana Tech</Text>
              <View style={styles.chipsWrap}>
                {TRENDING_SEARCHES.map((term, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[styles.searchChip, styles.trendingChip]}
                    onPress={() => handleSelectRecent(term)}>
                    <Ionicons name="trending-up" size={14} color="#19E68C" />
                    <Text style={[styles.searchChipText, { color: '#F8FAFC' }]}>
                      {term}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        ) : totalResultsCount === 0 ? (
          /* Empty state for search */
          <EmptyState
            icon="search-outline"
            title="No Results Found"
            description={`We could not find any developers, posts or opportunities matching ${query}.`}
          />
        ) : (
          /* Search Results Display */
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsCountText}>
              Found {totalResultsCount} matching results for {query}
            </Text>

            {/* Developers / People */}
            {(activeTab === 'all' || activeTab === 'people') &&
              matchedPeople.length > 0 && (
                <View style={styles.resultsSection}>
                  <Text style={styles.resultsSectionTitle}>
                    Developers ({matchedPeople.length})
                  </Text>
                  {matchedPeople.map((user) => {
                    const isFollowing = followingUserIds.includes(user.id);
                    return (
                      <View key={user.id} style={styles.userResultRow}>
                        <TouchableOpacity
                          style={styles.userResultLeft}
                          onPress={() => router.push(`/profile/${user.username}`)}>
                          <Avatar
                            url={user.avatar}
                            name={user.name}
                            size={44}
                            isVerified={user.isVerified}
                          />
                          <View style={styles.userResultMeta}>
                            <Text style={styles.userResultName}>{user.name}</Text>
                            <Text style={styles.userResultRole}>{user.role}</Text>
                            <Text style={styles.userResultLoc}>📍 {user.location}</Text>
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={[
                            styles.followBtn,
                            isFollowing && styles.followingBtn,
                          ]}
                          onPress={() => toggleFollowUser(user.id)}>
                          <Text
                            style={[
                              styles.followBtnText,
                              isFollowing && styles.followingBtnText,
                            ]}>
                            {isFollowing ? 'Following' : 'Follow'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              )}

            {/* Discussions & Code Snippets */}
            {(activeTab === 'all' || activeTab === 'posts') &&
              matchedPosts.length > 0 && (
                <View style={styles.resultsSection}>
                  <Text style={styles.resultsSectionTitle}>
                    Discussions & Code ({matchedPosts.length})
                  </Text>
                  {matchedPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </View>
              )}

            {/* Projects */}
            {(activeTab === 'all' || activeTab === 'projects') &&
              matchedProjects.length > 0 && (
                <View style={styles.resultsSection}>
                  <Text style={styles.resultsSectionTitle}>
                    Projects ({matchedProjects.length})
                  </Text>
                  {matchedProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </View>
              )}

            {/* Events */}
            {(activeTab === 'all' || activeTab === 'events') &&
              matchedEvents.length > 0 && (
                <View style={styles.resultsSection}>
                  <Text style={styles.resultsSectionTitle}>
                    Opportunities & Events ({matchedEvents.length})
                  </Text>
                  {matchedEvents.map((opp) => (
                    <OpportunityCard key={opp.id} opportunity={opp} />
                  ))}
                </View>
              )}
          </View>
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
    paddingHorizontal: Spacing.md,
    gap: 10,
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
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#132235',
    borderWidth: 1,
    borderColor: '#203248',
    borderRadius: Radius.lg,
    paddingHorizontal: 12,
    height: 42,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 14,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  suggestionsContainer: {
    padding: Spacing.lg,
    gap: 24,
  },
  suggestionBlock: {
    gap: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  clearText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '600',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  searchChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#132235',
    borderWidth: 1,
    borderColor: '#203248',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.full,
  },
  trendingChip: {
    borderColor: 'rgba(25, 230, 140, 0.3)',
    backgroundColor: '#0F2132',
  },
  searchChipText: {
    fontSize: 13,
    color: '#CBD5E1',
  },
  resultsContainer: {
    paddingVertical: 12,
  },
  resultsCountText: {
    fontSize: 12.5,
    color: '#64748B',
    paddingHorizontal: Spacing.md,
    marginBottom: 10,
  },
  resultsSection: {
    marginBottom: 20,
  },
  resultsSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
    paddingHorizontal: Spacing.md,
    marginBottom: 10,
  },
  userResultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#122033',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#1E324A',
    padding: 12,
    marginHorizontal: Spacing.md,
    marginBottom: 8,
  },
  userResultLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 8,
  },
  userResultMeta: {
    flex: 1,
  },
  userResultName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  userResultRole: {
    fontSize: 12,
    color: '#19E68C',
    marginTop: 2,
  },
  userResultLoc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  followBtn: {
    backgroundColor: '#19E68C',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Radius.sm,
  },
  followingBtn: {
    backgroundColor: '#1A2A3D',
    borderWidth: 1,
    borderColor: '#26384E',
  },
  followBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#07111F',
  },
  followingBtnText: {
    color: '#94A3B8',
  },
});
