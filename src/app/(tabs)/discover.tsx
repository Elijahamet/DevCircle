import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Radius, Spacing } from '@/constants/theme';
import { AppHeader } from '@/components/AppHeader';
import { Avatar } from '@/components/Avatar';
import { ProjectCard } from '@/components/ProjectCard';
import { useDevCircle } from '@/context/DevCircleContext';
import { CATEGORIES_LIST } from '@/data/mockData';

export default function DiscoverScreen() {
  const router = useRouter();
  const { users, projects, followingUserIds, toggleFollowUser, colors } = useDevCircle();
  const [quickQuery, setQuickQuery] = useState('');

  const trendingTopics = [
    { tag: 'MoMoAPI', count: '142 posts' },
    { tag: 'PaystackGhana', count: '98 posts' },
    { tag: 'ReactAccra', count: '85 posts' },
    { tag: 'TwiNLP', count: '64 posts' },
    { tag: 'KubernetesKumasi', count: '41 posts' },
    { tag: 'CyberSecGH', count: '39 posts' },
  ];

  const popularUsers = Object.values(users);

  const handleSearchSubmit = () => {
    if (quickQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(quickQuery.trim())}`);
    } else {
      router.push('/search');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Search Bar Tap Trigger */}
        <View style={styles.searchContainer}>
          <TouchableOpacity
            style={[
              styles.searchBar,
              {
                backgroundColor: colors.inputBackground,
                borderColor: colors.inputBorder,
              },
            ]}
            activeOpacity={0.85}
            onPress={handleSearchSubmit}>
            <Ionicons name="search-outline" size={18} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search Ghanaian devs, projects, tech stacks..."
              placeholderTextColor={colors.textTertiary}
              value={quickQuery}
              onChangeText={setQuickQuery}
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
            />
            {quickQuery.length > 0 && (
              <TouchableOpacity onPress={() => setQuickQuery('')}>
                <Ionicons name="close-circle" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </View>

        {/* Quick Nav Badges: Projects & Events */}
        <View style={styles.hubNavRow}>
          <TouchableOpacity
            style={[
              styles.hubCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.cardBorder,
              },
            ]}
            activeOpacity={0.8}
            onPress={() => router.push('/projects')}>
            <View style={[styles.hubIconBg, { backgroundColor: 'rgba(25, 230, 140, 0.12)' }]}>
              <Ionicons name="rocket" size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={[styles.hubTitle, { color: colors.text }]}>Project Showcase</Text>
              <Text style={[styles.hubSubtitle, { color: colors.textSecondary }]}>
                Explore what Ghanaian devs build
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.textTertiary}
              style={{ marginLeft: 'auto' }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.hubCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.cardBorder,
              },
            ]}
            activeOpacity={0.8}
            onPress={() => router.push('/events')}>
            <View style={[styles.hubIconBg, { backgroundColor: 'rgba(56, 189, 248, 0.12)' }]}>
              <Ionicons name="calendar" size={20} color={colors.info} />
            </View>
            <View>
              <Text style={[styles.hubTitle, { color: colors.text }]}>Events & Opportunities</Text>
              <Text style={[styles.hubSubtitle, { color: colors.textSecondary }]}>
                Hackathons, meetups & jobs
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.textTertiary}
              style={{ marginLeft: 'auto' }}
            />
          </TouchableOpacity>
        </View>

        {/* Popular Ghanaian Developers to Follow */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Ionicons name="people" size={18} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Suggested Developers
              </Text>
            </View>
            <Text style={[styles.sectionBadge, { color: colors.primary }]}>GHANA TECH</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.usersScroll}>
            {popularUsers.map((user) => {
              const isFollowing = followingUserIds.includes(user.id);
              return (
                <View
                  key={user.id}
                  style={[
                    styles.userCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.cardBorder,
                    },
                  ]}>
                  <TouchableOpacity
                    onPress={() => router.push(`/profile/${user.username}`)}
                    style={styles.userCardAvatar}>
                    <Avatar
                      url={user.avatar}
                      name={user.name}
                      size={54}
                      isVerified={user.isVerified}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => router.push(`/profile/${user.username}`)}>
                    <Text
                      style={[styles.userCardName, { color: colors.text }]}
                      numberOfLines={1}>
                      {user.name}
                    </Text>
                    <Text
                      style={[styles.userCardUsername, { color: colors.textSecondary }]}
                      numberOfLines={1}>
                      @{user.username}
                    </Text>
                  </TouchableOpacity>

                  <Text
                    style={[styles.userCardRole, { color: colors.textSecondary }]}
                    numberOfLines={2}>
                    {user.role}
                  </Text>

                  <Text
                    style={[styles.userCardLocation, { color: colors.textTertiary }]}
                    numberOfLines={1}>
                    📍 {user.location}
                  </Text>

                  <TouchableOpacity
                    style={[
                      styles.followBtn,
                      isFollowing
                        ? [
                            styles.followingBtn,
                            {
                              backgroundColor: colors.inputBackground,
                              borderColor: colors.cardBorder,
                            },
                          ]
                        : { backgroundColor: colors.primary },
                    ]}
                    activeOpacity={0.7}
                    onPress={() => toggleFollowUser(user.id)}>
                    <Text
                      style={[
                        styles.followBtnText,
                        {
                          color: isFollowing
                            ? colors.textSecondary
                            : colors.textInverse,
                        },
                      ]}>
                      {isFollowing ? 'Following' : 'Follow'}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* Trending Ghanaian Topics */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Ionicons name="trending-up" size={18} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Trending in Ghana
              </Text>
            </View>
          </View>

          <View style={styles.trendingGrid}>
            {trendingTopics.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.topicCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.cardBorder,
                  },
                ]}
                activeOpacity={0.7}
                onPress={() => router.push(`/search?q=${item.tag}`)}>
                <View style={styles.topicRow}>
                  <Text style={[styles.topicTag, { color: colors.primary }]}>
                    #{item.tag}
                  </Text>
                  <Text style={[styles.topicCount, { color: colors.textTertiary }]}>
                    {item.count}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Technology Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Ionicons name="grid-outline" size={18} color={colors.purple} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Explore by Category
              </Text>
            </View>
          </View>

          <View style={styles.categoriesGrid}>
            {CATEGORIES_LIST.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.cardBorder,
                  },
                ]}
                activeOpacity={0.8}
                onPress={() => router.push(`/search?q=${encodeURIComponent(cat.name)}`)}>
                <View style={[styles.catIconWrap, { backgroundColor: `${cat.color}18` }]}>
                  <Ionicons name={cat.icon as any} size={22} color={cat.color} />
                </View>
                <Text style={[styles.catName, { color: colors.text }]}>{cat.name}</Text>
                <Text
                  style={[styles.catDesc, { color: colors.textSecondary }]}
                  numberOfLines={2}>
                  {cat.description}
                </Text>
                <View style={styles.catFooter}>
                  <Text style={[styles.catTopics, { color: colors.textTertiary }]}>
                    {cat.topicsCount} discussions
                  </Text>
                  <Ionicons name="arrow-forward" size={12} color={cat.color} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Projects Highlight */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Ionicons name="sparkles" size={18} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Popular Projects
              </Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/projects')}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>
                View All ({projects.length})
              </Text>
            </TouchableOpacity>
          </View>

          {projects.slice(0, 2).map((proj) => (
            <ProjectCard key={proj.id} project={proj} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07111F',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  searchContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#132235',
    borderWidth: 1,
    borderColor: '#203248',
    borderRadius: Radius.lg,
    paddingHorizontal: 14,
    height: 46,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 14,
  },
  hubNavRow: {
    paddingHorizontal: Spacing.md,
    gap: 10,
    marginBottom: Spacing.lg,
  },
  hubCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#122032',
    borderWidth: 1,
    borderColor: '#1F334D',
    borderRadius: Radius.md,
    padding: 12,
    gap: 12,
  },
  hubIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hubTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  hubSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  section: {
    marginTop: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  sectionBadge: {
    fontSize: 10,
    color: '#19E68C',
    fontWeight: '700',
    backgroundColor: 'rgba(25, 230, 140, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(25, 230, 140, 0.25)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  seeAllText: {
    fontSize: 13,
    color: '#19E68C',
    fontWeight: '600',
  },
  usersScroll: {
    paddingHorizontal: Spacing.md,
    gap: 12,
  },
  userCard: {
    width: 160,
    backgroundColor: '#122033',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#1E324A',
    padding: 14,
    alignItems: 'center',
  },
  userCardAvatar: {
    marginBottom: 8,
  },
  userCardName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
    textAlign: 'center',
  },
  userCardUsername: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 6,
  },
  userCardRole: {
    fontSize: 11.5,
    color: '#CBD5E1',
    textAlign: 'center',
    lineHeight: 15,
    height: 30,
    marginBottom: 6,
  },
  userCardLocation: {
    fontSize: 10.5,
    color: '#64748B',
    marginBottom: 10,
  },
  followBtn: {
    backgroundColor: '#19E68C',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: Radius.sm,
    width: '100%',
    alignItems: 'center',
  },
  followingBtn: {
    backgroundColor: '#1A2A3D',
    borderWidth: 1,
    borderColor: '#26384E',
  },
  followBtnText: {
    color: '#07111F',
    fontSize: 12,
    fontWeight: '700',
  },
  followingBtnText: {
    color: '#94A3B8',
  },
  trendingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: Spacing.md,
  },
  topicCard: {
    backgroundColor: '#122032',
    borderWidth: 1,
    borderColor: '#1E3147',
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minWidth: '47%',
    flex: 1,
  },
  topicRow: {
    justifyContent: 'space-between',
  },
  topicTag: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#38BDF8',
    marginBottom: 2,
  },
  topicCount: {
    fontSize: 11,
    color: '#64748B',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: Spacing.md,
  },
  categoryCard: {
    backgroundColor: '#122033',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#1E324A',
    padding: 14,
    width: '48%',
    flexGrow: 1,
  },
  catIconWrap: {
    width: 38,
    height: 38,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  catName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  catDesc: {
    fontSize: 11.5,
    color: '#94A3B8',
    lineHeight: 16,
    marginBottom: 8,
    height: 32,
  },
  catFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  catTopics: {
    fontSize: 10.5,
    color: '#64748B',
  },
});
