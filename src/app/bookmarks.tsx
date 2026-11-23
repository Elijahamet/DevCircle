import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '@/constants/theme';
import { PostCard } from '@/components/PostCard';
import { FilterPills, FilterItem } from '@/components/FilterPills';
import { EmptyState } from '@/components/EmptyState';
import { useDevCircle } from '@/context/DevCircleContext';
import { PostType } from '@/types';

const BOOKMARK_FILTERS: FilterItem[] = [
  { id: 'all', label: 'All Saved' },
  { id: 'code', label: 'Code Snippets' },
  { id: 'project', label: 'Projects' },
  { id: 'discussion', label: 'Discussions' },
];

export default function BookmarksScreen() {
  const router = useRouter();
  const { posts, savedPostIds } = useDevCircle();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const bookmarkedPosts = useMemo(() => {
    const list = posts.filter((p) => p.isBookmarked || savedPostIds.includes(p.id));
    if (selectedFilter === 'all') return list;
    return list.filter((p) => p.type === (selectedFilter as PostType));
  }, [posts, savedPostIds, selectedFilter]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bookmarks</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Filter Tabs */}
      <FilterPills
        items={BOOKMARK_FILTERS}
        selectedId={selectedFilter}
        onSelect={setSelectedFilter}
      />

      {/* List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {bookmarkedPosts.length > 0 ? (
          bookmarkedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <EmptyState
            icon="bookmark-outline"
            title="No Bookmarked Posts"
            description="Save helpful code snippets, discussions, and architectural tips to revisit them anytime."
            actionTitle="Explore Discussions"
            onAction={() => router.push('/(tabs)')}
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
  scrollContent: {
    paddingVertical: 10,
    paddingBottom: 32,
  },
});
