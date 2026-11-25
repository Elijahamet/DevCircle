import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Share,
  Platform,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Radius, Spacing } from '@/constants/theme';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { PostCard } from '@/components/PostCard';
import { EmptyState } from '@/components/EmptyState';
import { useDevCircle } from '@/context/DevCircleContext';

export default function CommunityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const {
    communities,
    joinedCommunityIds,
    toggleJoinCommunity,
    posts,
    colors,
  } = useDevCircle();

  const community = useMemo(() => {
    return communities.find((c) => c.id === id || c.slug === id);
  }, [communities, id]);

  const isJoined = useMemo(() => {
    if (!community) return false;
    return joinedCommunityIds.includes(community.id) || !!community.isJoined;
  }, [community, joinedCommunityIds]);

  // Posts belonging to this community or sharing category/tags
  const communityPosts = useMemo(() => {
    if (!community) return [];
    return posts.filter((p) => {
      if (p.communityId === community.id) return true;
      if (community.category.toLowerCase().includes('frontend') && p.category === 'web_dev') return true;
      if (community.category.toLowerCase().includes('mobile') && p.category === 'mobile_dev') return true;
      if (community.category.toLowerCase().includes('ai') && p.category === 'ai_ml') return true;
      if (community.category.toLowerCase().includes('fintech') && p.tags.some(t => t.toLowerCase().includes('momo') || t.toLowerCase().includes('paystack') || t.toLowerCase().includes('fintech'))) return true;
      return false;
    });
  }, [posts, community]);

  if (!community) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View
          style={[
            styles.header,
            {
              backgroundColor: colors.headerBg,
              borderBottomColor: colors.headerBorder,
            },
          ]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Community</Text>
          <View style={{ width: 36 }} />
        </View>
        <EmptyState
          icon="people-outline"
          title="Community Not Found"
          description="This developer group may have been removed or does not exist."
          actionTitle="Back to Communities"
          onAction={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  const handleShare = async () => {
    const shareUrl = `https://devcircle.gh/community/${community.slug || community.id}`;
    if (Platform.OS === 'web') {
      if (navigator.share) {
        await navigator.share({
          title: community.name,
          text: `Join ${community.name} on DevCircle Ghana: ${community.description}`,
          url: shareUrl,
        });
      } else {
        Alert.alert('Link Copied', 'Community link copied to clipboard!');
      }
    } else {
      await Share.share({
        title: community.name,
        message: `Join ${community.name} on DevCircle Ghana:\n${shareUrl}`,
      });
    }
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

        <Text
          style={[styles.headerTitle, { color: colors.text }]}
          numberOfLines={1}>
          {community.name}
        </Text>

        <TouchableOpacity
          onPress={handleShare}
          style={styles.backBtn}
          activeOpacity={0.7}>
          <Ionicons name="share-social-outline" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Banner with Avatar Overlay */}
        <View style={styles.bannerContainer}>
          <Image
            source={{
              uri:
                community.bannerUrl ||
                'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
            }}
            style={styles.bannerImage}
            contentFit="cover"
            transition={200}
          />
          <View style={styles.bannerOverlay} />

          <View style={styles.avatarOverlapWrap}>
            <Image
              source={{ uri: community.avatar }}
              style={[styles.avatar, { borderColor: colors.background }]}
              contentFit="cover"
              transition={200}
            />
          </View>
        </View>

        {/* Community Info Box */}
        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.cardBorder,
            },
          ]}>
          <View style={styles.nameBadgeRow}>
            <Text style={[styles.communityName, { color: colors.text }]}>
              {community.name}
            </Text>
            <Badge label={community.category} variant="primary" size="sm" />
          </View>

          <Text style={[styles.creatorMeta, { color: colors.textSecondary }]}>
            {community.createdAt} • Created by @{community.creator.username}
          </Text>

          <Text style={[styles.description, { color: colors.text }]}>
            {community.description}
          </Text>

          {/* Tags */}
          <View style={styles.tagsRow}>
            {community.tags.map((tag, idx) => (
              <Text key={idx} style={[styles.tagText, { color: colors.primary }]}>
                #{tag}
              </Text>
            ))}
          </View>

          {/* Stats Bar */}
          <View style={[styles.statsRow, { borderTopColor: colors.cardBorder }]}>
            <View style={styles.statBox}>
              <Text style={[styles.statNumber, { color: colors.text }]}>
                {community.membersCount.toLocaleString()}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Members</Text>
            </View>

            <View style={[styles.statDivider, { backgroundColor: colors.cardBorder }]} />

            <View style={styles.statBox}>
              <Text style={[styles.statNumber, { color: colors.text }]}>
                {community.postsCount || communityPosts.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Discussions</Text>
            </View>

            <View style={[styles.statDivider, { backgroundColor: colors.cardBorder }]} />

            <View style={styles.statBox}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>Active</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Ghana Tech</Text>
            </View>
          </View>

          {/* Join / Leave Button */}
          <View style={styles.actionButtonWrap}>
            <Button
              title={isJoined ? 'Joined Community (Member)' : 'Join Community'}
              variant={isJoined ? 'secondary' : 'primary'}
              size="lg"
              fullWidth={true}
              onPress={() => toggleJoinCommunity(community.id)}
              icon={
                <Ionicons
                  name={isJoined ? 'checkmark-circle' : 'add'}
                  size={18}
                  color={isJoined ? colors.primary : colors.textInverse}
                />
              }
            />
          </View>
        </View>

        {/* Section Title */}
        <View style={styles.discussionsHeader}>
          <Ionicons name="chatbubbles" size={18} color={colors.primary} />
          <Text style={[styles.discussionsTitle, { color: colors.text }]}>
            Group Discussions ({communityPosts.length})
          </Text>
        </View>

        {/* Discussions List */}
        {communityPosts.length > 0 ? (
          communityPosts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <EmptyState
            icon="chatbubbles-outline"
            title="No Discussions Yet"
            description="Be the first to share code or start a conversation in this developer group!"
            actionTitle="Post in Group"
            onAction={() => router.push('/(tabs)/create')}
          />
        )}
      </ScrollView>

      {/* Floating Create Post Button */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        activeOpacity={0.85}
        onPress={() => router.push('/(tabs)/create')}>
        <Ionicons name="create" size={20} color={colors.textInverse} />
        <Text style={[styles.fabText, { color: colors.textInverse }]}>Post in Group</Text>
      </TouchableOpacity>
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
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  bannerContainer: {
    height: 140,
    width: '100%',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(7, 17, 31, 0.4)',
  },
  avatarOverlapWrap: {
    position: 'absolute',
    bottom: -32,
    left: Spacing.xl,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
  },
  infoCard: {
    marginTop: 40,
    marginHorizontal: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.lg,
  },
  nameBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  communityName: {
    fontSize: 20,
    fontWeight: '800',
  },
  creatorMeta: {
    fontSize: 12,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 15,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
  },
  actionButtonWrap: {
    marginTop: 10,
  },
  discussionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: Spacing.xl,
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  discussionsTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: Radius.full,
    shadowColor: '#19E68C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
