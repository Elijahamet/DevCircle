import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { AppHeader } from '@/components/AppHeader';
import { FilterPills, FilterItem } from '@/components/FilterPills';
import { PostCard } from '@/components/PostCard';
import { EmptyState } from '@/components/EmptyState';
import { useDevCircle } from '@/context/DevCircleContext';
import { Post, PostCategory } from '@/types';

const FEED_FILTERS: FilterItem[] = [
  { id: 'for_you', label: 'For You' },
  { id: 'following', label: 'Following' },
  { id: 'ghana_tech', label: 'Ghana Tech 🇬🇭' },
  { id: 'web_dev', label: 'Web Dev' },
  { id: 'mobile_dev', label: 'Mobile Dev' },
  { id: 'ai_ml', label: 'AI & ML' },
  { id: 'career_advice', label: 'Career' },
];

export default function HomeFeedScreen() {
  const router = useRouter();
  const { posts, followingUserIds } = useDevCircle();
  const [selectedFilter, setSelectedFilter] = useState<string>('for_you');
  const [refreshing, setRefreshing] = useState(false);
  const [showFeaturedBanner, setShowFeaturedBanner] = useState(true);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  }, []);

  const filteredPosts = useMemo(() => {
    if (selectedFilter === 'for_you') {
      return posts;
    }
    if (selectedFilter === 'following') {
      return posts.filter(
        (p) => followingUserIds.includes(p.author.id) || p.isAuthorSelf
      );
    }
    return posts.filter((p) => p.category === (selectedFilter as PostCategory));
  }, [posts, selectedFilter, followingUserIds]);

  const renderItem = ({ item }: { item: Post }) => {
    return <PostCard post={item} />;
  };

  const ListHeader = () => (
    <View style={styles.listHeaderContainer}>
      {/* Featured Community Banner */}
      {showFeaturedBanner && (
        <View style={styles.featuredCard}>
          <View style={styles.featuredLeft}>
            <View style={styles.featuredBadge}>
              <Ionicons name="sparkles" size={12} color="#19E68C" />
              <Text style={styles.featuredBadgeText}>FEATURED COMMUNITY EVENT</Text>
            </View>
            <Text style={styles.featuredTitle}>Accra DevFest 2026</Text>
            <Text style={styles.featuredSubtitle}>
              Join over 1,500 Ghanaian developers at the Accra Int. Conference Centre!
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push('/events')}
              style={styles.featuredCta}>
              <Text style={styles.featuredCtaText}>Explore Events</Text>
              <Ionicons name="arrow-forward" size={13} color="#07111F" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => setShowFeaturedBanner(false)}
            style={styles.closeBannerBtn}>
            <Ionicons name="close" size={16} color="#64748B" />
          </TouchableOpacity>
        </View>
      )}

      {/* Quick stats or notice */}
      <View style={styles.feedStatusRow}>
        <Text style={styles.feedStatusText}>
          Showing {filteredPosts.length} discussions in Ghana Tech
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/create')}
          style={styles.quickPostRow}>
          <Ionicons name="create-outline" size={14} color="#19E68C" />
          <Text style={styles.quickPostText}>New Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* App Header */}
      <AppHeader />

      {/* Horizontally scrollable content filters */}
      <FilterPills
        items={FEED_FILTERS}
        selectedId={selectedFilter}
        onSelect={setSelectedFilter}
      />

      {/* Main FlashList Feed */}
      <View style={styles.listWrapper}>
        <FlashList
          data={filteredPosts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.electricGreen}
              colors={[Colors.electricGreen]}
              progressBackgroundColor="#182536"
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon="chatbox-ellipses-outline"
              title="No Posts in this Category"
              description="Be the first developer to share insights, code snippets or ask technical questions!"
              actionTitle="Create a Post"
              onAction={() => router.push('/(tabs)/create')}
            />
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07111F',
  },
  listWrapper: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
  },
  listHeaderContainer: {
    paddingTop: 10,
    paddingBottom: 6,
  },
  featuredCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: '#0F2236',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(25, 230, 140, 0.3)',
    marginHorizontal: Spacing.md,
    marginBottom: 12,
    padding: Spacing.md,
    position: 'relative',
  },
  featuredLeft: {
    flex: 1,
    marginRight: 10,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  featuredBadgeText: {
    fontSize: 10,
    color: '#19E68C',
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  featuredSubtitle: {
    fontSize: 12.5,
    color: '#94A3B8',
    lineHeight: 17,
    marginBottom: 10,
  },
  featuredCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#19E68C',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.sm,
  },
  featuredCtaText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#07111F',
  },
  closeBannerBtn: {
    padding: 4,
  },
  feedStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 6,
  },
  feedStatusText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  quickPostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  quickPostText: {
    fontSize: 12,
    color: '#19E68C',
    fontWeight: '600',
  },
});
