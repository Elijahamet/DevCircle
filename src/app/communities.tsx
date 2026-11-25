import React, { useState, useMemo } from 'react';
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
import { Image } from 'expo-image';
import { Radius, Spacing } from '@/constants/theme';
import { Badge } from '@/components/Badge';
import { EmptyState } from '@/components/EmptyState';
import { CreateCommunityModal } from '@/components/CreateCommunityModal';
import { useDevCircle } from '@/context/DevCircleContext';
import { Community } from '@/types';

const CATEGORY_FILTERS = [
  'All',
  'Frontend & Mobile',
  'Fintech & Payments',
  'AI & Data Science',
  'DevOps & Cloud',
  'Students & Campus',
];

export default function CommunitiesScreen() {
  const router = useRouter();
  const { communities, joinedCommunityIds, toggleJoinCommunity, colors } = useDevCircle();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredCommunities = useMemo(() => {
    return communities.filter((comm) => {
      const matchesCategory =
        selectedCategory === 'All' || comm.category === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        comm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comm.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comm.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [communities, selectedCategory, searchQuery]);

  const handleOpenCommunity = (comm: Community) => {
    router.push(`/community/${comm.id}` as any);
  };

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
          onPress={() => router.back()}
          style={styles.backBtn}
          activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.headerTitleWrap}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Tech Communities</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Ghana Developer Groups
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.createHeaderBtn, { backgroundColor: colors.primary }]}
          onPress={() => setShowCreateModal(true)}
          activeOpacity={0.8}>
          <Ionicons name="add" size={18} color={colors.textInverse} />
          <Text style={[styles.createHeaderBtnText, { color: colors.textInverse }]}>
            Create
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View
            style={[
              styles.searchBox,
              {
                backgroundColor: colors.inputBackground,
                borderColor: colors.inputBorder,
              },
            ]}>
            <Ionicons name="search-outline" size={18} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search groups (e.g. React, Fintech, Python)..."
              placeholderTextColor={colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              clearButtonMode="while-editing"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Category Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}>
          {CATEGORY_FILTERS.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.filterPill,
                  {
                    backgroundColor: isSelected
                      ? colors.primary
                      : colors.inputBackground,
                    borderColor: isSelected
                      ? colors.primary
                      : colors.cardBorder,
                  },
                ]}
                onPress={() => setSelectedCategory(cat)}>
                <Text
                  style={[
                    styles.filterPillText,
                    {
                      color: isSelected
                        ? colors.textInverse
                        : colors.textSecondary,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Results Counter and Create Banner */}
        <View style={styles.statusBar}>
          <Text style={[styles.statusText, { color: colors.textSecondary }]}>
            Showing {filteredCommunities.length} developer groups
          </Text>
          <TouchableOpacity
            style={styles.quickCreateLink}
            onPress={() => setShowCreateModal(true)}>
            <Ionicons name="people-outline" size={14} color={colors.primary} />
            <Text style={[styles.quickCreateText, { color: colors.primary }]}>
              + Start a Group
            </Text>
          </TouchableOpacity>
        </View>

        {/* Community Cards List */}
        {filteredCommunities.length > 0 ? (
          filteredCommunities.map((comm) => {
            const isJoined = joinedCommunityIds.includes(comm.id) || !!comm.isJoined;
            return (
              <TouchableOpacity
                key={comm.id}
                activeOpacity={0.85}
                onPress={() => handleOpenCommunity(comm)}
                style={[
                  styles.communityCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.cardBorder,
                  },
                ]}>
                {/* Header: Avatar, Name, Category, Join Button */}
                <View style={styles.cardHeader}>
                  <Image
                    source={{ uri: comm.avatar }}
                    style={styles.communityAvatar}
                    contentFit="cover"
                    transition={200}
                  />

                  <View style={styles.cardHeaderMeta}>
                    <Text
                      style={[styles.communityName, { color: colors.text }]}
                      numberOfLines={1}>
                      {comm.name}
                    </Text>
                    <View style={styles.categoryBadgeRow}>
                      <Badge label={comm.category} variant="secondary" size="sm" />
                    </View>
                  </View>

                  {/* Join / Joined Button */}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => toggleJoinCommunity(comm.id)}
                    style={[
                      styles.joinBtn,
                      {
                        backgroundColor: isJoined
                          ? colors.inputBackground
                          : colors.primary,
                        borderColor: isJoined
                          ? colors.cardBorder
                          : colors.primary,
                      },
                    ]}>
                    <Ionicons
                      name={isJoined ? 'checkmark-circle' : 'add'}
                      size={15}
                      color={isJoined ? colors.primary : colors.textInverse}
                    />
                    <Text
                      style={[
                        styles.joinBtnText,
                        {
                          color: isJoined
                            ? colors.primary
                            : colors.textInverse,
                        },
                      ]}>
                      {isJoined ? 'Joined' : 'Join'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Description */}
                <Text
                  style={[styles.communityDesc, { color: colors.textSecondary }]}
                  numberOfLines={2}>
                  {comm.description}
                </Text>

                {/* Tags Row */}
                <View style={styles.tagsRow}>
                  {comm.tags.map((tag, tIdx) => (
                    <Text key={tIdx} style={[styles.tagText, { color: colors.primary }]}>
                      #{tag}
                    </Text>
                  ))}
                </View>

                {/* Stats & Creator Footer */}
                <View style={[styles.cardFooter, { borderTopColor: colors.cardBorder }]}>
                  <View style={styles.statsGroup}>
                    <View style={styles.statItem}>
                      <Ionicons name="people-outline" size={14} color={colors.textSecondary} />
                      <Text style={[styles.statValue, { color: colors.text }]}>
                        {comm.membersCount.toLocaleString()} members
                      </Text>
                    </View>
                    <View style={styles.statDot} />
                    <View style={styles.statItem}>
                      <Ionicons name="chatbubbles-outline" size={14} color={colors.textSecondary} />
                      <Text style={[styles.statValue, { color: colors.text }]}>
                        {comm.postsCount} posts
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.creatorText, { color: colors.textTertiary }]}>
                    by @{comm.creator.username}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <EmptyState
            icon="people-outline"
            title="No Communities Found"
            description="No developer groups match your search or filter. Start your own group now!"
            actionTitle="Create Community"
            onAction={() => setShowCreateModal(true)}
          />
        )}
      </ScrollView>

      {/* Create Community Modal */}
      <CreateCommunityModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={(newComm) => {
          handleOpenCommunity(newComm);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleWrap: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  headerSubtitle: {
    fontSize: 11,
  },
  createHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  createHeaderBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  searchSection: {
    marginBottom: Spacing.sm,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
  },
  filterScroll: {
    gap: 8,
    paddingVertical: 8,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  filterPillText: {
    fontSize: 12,
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: Spacing.sm,
  },
  statusText: {
    fontSize: 12,
  },
  quickCreateLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  quickCreateText: {
    fontSize: 12,
    fontWeight: '700',
  },
  communityCard: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  communityAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 10,
  },
  cardHeaderMeta: {
    flex: 1,
    marginRight: 8,
  },
  communityName: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  categoryBadgeRow: {
    flexDirection: 'row',
  },
  joinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  joinBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  communityDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  tagText: {
    fontSize: 11.5,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
  },
  statsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#64748B',
  },
  statValue: {
    fontSize: 12,
    fontWeight: '500',
  },
  creatorText: {
    fontSize: 11,
  },
});
