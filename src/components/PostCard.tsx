import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  Alert,
  Platform,
  Animated,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Radius, Spacing } from '@/constants/theme';
import { Post, PostType } from '@/types';
import { Avatar } from './Avatar';
import { Badge } from './Badge';
import { CodeBlock } from './CodeBlock';
import { ReactionBurst } from './ReactionBurst';
import { useDevCircle } from '@/context/DevCircleContext';

interface PostCardProps {
  post: Post;
  showFullContent?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  showFullContent = false,
}) => {
  const router = useRouter();
  const { currentUser, deletePost, toggleLikePost, toggleBookmarkPost, colors } = useDevCircle();
  const [showOptions, setShowOptions] = useState(false);
  const isNative = Platform.OS !== 'web';

  const [likeBurstTrigger, setLikeBurstTrigger] = useState(0);
  const [bookmarkBurstTrigger, setBookmarkBurstTrigger] = useState(0);
  const [likeScale] = useState(() => new Animated.Value(1));
  const [bookmarkScale] = useState(() => new Animated.Value(1));
  const [cardEntrance] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(cardEntrance, {
      toValue: 1,
      duration: 320,
      useNativeDriver: isNative,
    }).start();
  }, [cardEntrance, isNative]);

  const handleLike = () => {
    setLikeBurstTrigger((prev) => prev + 1);
    Animated.sequence([
      Animated.timing(likeScale, {
        toValue: 1.45,
        duration: 110,
        useNativeDriver: isNative,
      }),
      Animated.spring(likeScale, {
        toValue: 1,
        friction: 3,
        tension: 90,
        useNativeDriver: isNative,
      }),
    ]).start();
    toggleLikePost(post.id);
  };

  const handleBookmark = () => {
    setBookmarkBurstTrigger((prev) => prev + 1);
    Animated.sequence([
      Animated.timing(bookmarkScale, {
        toValue: 1.35,
        duration: 110,
        useNativeDriver: isNative,
      }),
      Animated.spring(bookmarkScale, {
        toValue: 1,
        friction: 4,
        tension: 80,
        useNativeDriver: isNative,
      }),
    ]).start();
    toggleBookmarkPost(post.id);
  };

  const getTypeBadge = (type: PostType) => {
    switch (type) {
      case 'code':
        return <Badge label="Code Snippet" variant="info" size="sm" />;
      case 'project':
        return <Badge label="Project" variant="primary" size="sm" />;
      case 'question':
        return <Badge label="Question" variant="warning" size="sm" />;
      case 'career':
        return <Badge label="Career" variant="purple" size="sm" />;
      case 'resource':
        return <Badge label="Resource" variant="info" size="sm" />;
      case 'discussion':
      default:
        return <Badge label="Discussion" variant="ghost" size="sm" />;
    }
  };

  const handleShare = async () => {
    try {
      const shareUrl = `https://devcircle.gh/post/${post.id}`;
      if (Platform.OS === 'web') {
        if (navigator.share) {
          await navigator.share({
            title: post.title || 'DevCircle Post',
            text: post.content.slice(0, 100),
            url: shareUrl,
          });
        } else {
          Alert.alert('Link Copied', 'Post link copied to clipboard!');
        }
      } else {
        await Share.share({
          title: post.title || 'DevCircle Post',
          message: `${post.content.slice(0, 100)}... \n\nRead more on DevCircle: ${shareUrl}`,
        });
      }
    } catch (e) {
      console.warn('Share error', e);
    }
  };

  const navigateToDetails = () => {
    router.push(`/post/${post.id}`);
  };

  const navigateToProfile = () => {
    if (post.isAuthorSelf || post.author.id === currentUser.id || post.author.username === currentUser.username) {
      router.push('/(tabs)/profile');
    } else {
      router.push(`/profile/${post.author.username}`);
    }
  };

  const handleDeletePost = () => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deletePost(post.id),
        },
      ]
    );
  };

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
          opacity: cardEntrance,
          transform: [
            {
              translateY: cardEntrance.interpolate({
                inputRange: [0, 1],
                outputRange: [12, 0],
              }),
            },
          ],
        },
      ]}>
      {/* Top Author Row */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={navigateToProfile}
          style={styles.authorRow}>
          <Avatar
            url={post.author.avatar}
            name={post.author.name}
            size={40}
            isVerified={post.author.isVerified}
          />
          <View style={styles.authorMeta}>
            <View style={styles.nameRow}>
              <Text style={[styles.authorName, { color: colors.text }]} numberOfLines={1}>
                {post.author.name}
              </Text>
              <Text style={[styles.authorUsername, { color: colors.textSecondary }]}>
                @{post.author.username}
              </Text>
            </View>
            <View style={styles.subMetaRow}>
              <Text style={[styles.metaLocation, { color: colors.textTertiary }]}>
                {post.author.location}
              </Text>
              <Text style={[styles.metaDot, { color: colors.textTertiary }]}>•</Text>
              <Text style={[styles.metaTime, { color: colors.textTertiary }]}>
                {post.createdAt}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.headerRight}>
          {post.communityName && (
            <TouchableOpacity
              onPress={() =>
                router.push(`/community/${post.communityId || post.communityName}` as any)
              }
              style={[
                styles.communityBadgePill,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.cardBorder,
                },
              ]}>
              <Ionicons name="people" size={11} color={colors.primary} />
              <Text
                style={[styles.communityBadgePillText, { color: colors.primary }]}
                numberOfLines={1}>
                {post.communityName}
              </Text>
            </TouchableOpacity>
          )}
          {getTypeBadge(post.type)}
          <TouchableOpacity
            style={styles.moreButton}
            onPress={() => setShowOptions(!showOptions)}
            activeOpacity={0.7}>
            <Ionicons name="ellipsis-horizontal" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Options Menu dropdown */}
      {showOptions && (
        <View
          style={[
            styles.optionsDropdown,
            {
              backgroundColor: colors.card,
              borderColor: colors.cardBorder,
            },
          ]}>
          <TouchableOpacity
            style={[styles.optionItem, { borderBottomColor: colors.cardBorder }]}
            onPress={() => {
              setShowOptions(false);
              handleShare();
            }}>
            <Ionicons name="link-outline" size={16} color={colors.text} />
            <Text style={[styles.optionText, { color: colors.text }]}>Copy Post Link</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.optionItem, { borderBottomColor: colors.cardBorder }]}
            onPress={() => {
              setShowOptions(false);
              navigateToProfile();
            }}>
            <Ionicons name="person-outline" size={16} color={colors.text} />
            <Text style={[styles.optionText, { color: colors.text }]}>View Author Profile</Text>
          </TouchableOpacity>
          {(post.isAuthorSelf || post.author.id === currentUser.id) && (
            <TouchableOpacity
              style={[styles.optionItem, { borderBottomColor: colors.cardBorder }]}
              onPress={() => {
                setShowOptions(false);
                handleDeletePost();
              }}>
              <Ionicons name="trash-outline" size={16} color={colors.danger} />
              <Text style={[styles.optionText, { color: colors.danger, fontWeight: '700' }]}>
                Delete Post
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.optionItem, { borderBottomWidth: 0 }]}
            onPress={() => {
              setShowOptions(false);
              Alert.alert('Reported', 'Thank you. Our community moderators will review this post.');
            }}>
            <Ionicons name="flag-outline" size={16} color={colors.danger} />
            <Text style={[styles.optionText, { color: colors.danger }]}>Report Post</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Title */}
      {post.title && (
        <TouchableOpacity activeOpacity={0.85} onPress={navigateToDetails}>
          <Text style={[styles.postTitle, { color: colors.text }]}>{post.title}</Text>
        </TouchableOpacity>
      )}

      {/* Main Content */}
      <TouchableOpacity activeOpacity={0.85} onPress={navigateToDetails}>
        <Text
          style={[styles.postContent, { color: colors.text }]}
          numberOfLines={showFullContent ? undefined : 4}>
          {post.content}
        </Text>
      </TouchableOpacity>

      {/* Code Snippet (if any) */}
      {post.codeSnippet && (
        <CodeBlock
          snippet={post.codeSnippet}
          maxLines={showFullContent ? undefined : 7}
        />
      )}

      {/* Video Preview (if videoUrl or mediaType === 'video') */}
      {(post.videoUrl || post.mediaType === 'video') && (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={navigateToDetails}
          style={[
            styles.videoContainer,
            { borderColor: colors.cardBorder, backgroundColor: colors.backgroundSecondary },
          ]}>
          <Image
            source={{
              uri:
                post.imageUrl ||
                'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
            }}
            style={styles.videoThumbnail}
            contentFit="cover"
            transition={300}
          />
          {/* Dark scrim overlay */}
          <View style={styles.videoOverlay} />

          {/* Top Video Badge */}
          <View
            style={[
              styles.videoBadgePill,
              {
                backgroundColor: 'rgba(7, 17, 31, 0.85)',
                borderColor: colors.cardBorder,
              },
            ]}>
            <Ionicons name="videocam" size={13} color={colors.primary} />
            <Text style={[styles.videoBadgeText, { color: colors.primary }]}>
              VIDEO DEMO
            </Text>
          </View>

          {/* Center Play Button with glow */}
          <View style={[styles.playButtonCircle, { backgroundColor: colors.primary }]}>
            <Ionicons name="play" size={24} color="#07111F" style={{ marginLeft: 3 }} />
          </View>

          {/* Bottom Duration Badge */}
          <View style={styles.videoDurationPill}>
            <Ionicons name="time-outline" size={12} color="#F8FAFC" />
            <Text style={styles.videoDurationText}>
              {post.videoDuration || '0:45'}
            </Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Post Image (if any and not video) */}
      {post.imageUrl && !post.videoUrl && post.mediaType !== 'video' && (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={navigateToDetails}
          style={[styles.imageContainer, { borderColor: colors.cardBorder }]}>
          <Image
            source={{ uri: post.imageUrl }}
            style={styles.postImage}
            contentFit="cover"
            transition={300}
          />
        </TouchableOpacity>
      )}

      {/* Project Meta Preview (if any) */}
      {post.projectMeta && (
        <View
          style={[
            styles.projectBox,
            {
              backgroundColor: colors.backgroundSecondary,
              borderColor: colors.cardBorder,
            },
          ]}>
          <View style={styles.projectHeader}>
            <Ionicons name="rocket-outline" size={16} color={colors.primary} />
            <Text style={[styles.projectName, { color: colors.primary }]}>
              {post.projectMeta.name}
            </Text>
          </View>
          <View style={styles.techStackRow}>
            {post.projectMeta.techStack.map((tech, idx) => (
              <Badge key={idx} label={tech} variant="secondary" size="sm" />
            ))}
          </View>
        </View>
      )}

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <View style={styles.tagsRow}>
          {post.tags.map((tag, i) => (
            <Text key={i} style={[styles.tagText, { color: colors.primary }]}>
              #{tag}
            </Text>
          ))}
        </View>
      )}

      {/* Action Footer */}
      <View style={[styles.footerRow, { borderTopColor: colors.cardBorder }]}>
        <TouchableOpacity
          style={styles.actionBtn}
          activeOpacity={0.7}
          onPress={handleLike}>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <ReactionBurst
              triggerKey={likeBurstTrigger}
              color={colors.danger}
              size={36}
            />
            <Animated.View style={{ transform: [{ scale: likeScale }] }}>
              <Ionicons
                name={post.isLiked ? 'heart' : 'heart-outline'}
                size={19}
                color={post.isLiked ? colors.danger : colors.textSecondary}
              />
            </Animated.View>
          </View>
          <Text
            style={[
              styles.actionCount,
              { color: post.isLiked ? colors.danger : colors.textSecondary },
              post.isLiked && { fontWeight: '700' },
            ]}>
            {post.likesCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          activeOpacity={0.7}
          onPress={navigateToDetails}>
          <Ionicons name="chatbubble-outline" size={18} color={colors.textSecondary} />
          <Text style={[styles.actionCount, { color: colors.textSecondary }]}>
            {post.commentsCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          activeOpacity={0.7}
          onPress={handleBookmark}>
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <ReactionBurst
              triggerKey={bookmarkBurstTrigger}
              color={colors.primary}
              size={34}
            />
            <Animated.View style={{ transform: [{ scale: bookmarkScale }] }}>
              <Ionicons
                name={post.isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={18}
                color={post.isBookmarked ? colors.primary : colors.textSecondary}
              />
            </Animated.View>
          </View>
          <Text
            style={[
              styles.actionCount,
              { color: post.isBookmarked ? colors.primary : colors.textSecondary },
              post.isBookmarked && { fontWeight: '700' },
            ]}>
            {post.bookmarksCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionBtn}
          activeOpacity={0.7}
          onPress={handleShare}>
          <Ionicons name="share-social-outline" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#182536',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#263548',
    padding: Spacing.lg,
    marginHorizontal: Spacing.md,
    marginVertical: 6,
    position: 'relative',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  authorMeta: {
    marginLeft: Spacing.sm,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  authorName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  authorUsername: {
    fontSize: 12,
    color: '#94A3B8',
  },
  subMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  metaLocation: {
    fontSize: 11,
    color: '#64748B',
  },
  metaDot: {
    fontSize: 10,
    color: '#64748B',
  },
  metaTime: {
    fontSize: 11,
    color: '#64748B',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  communityBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    borderWidth: 1,
    maxWidth: 120,
  },
  communityBadgePillText: {
    fontSize: 10.5,
    fontWeight: '700',
  },
  moreButton: {
    padding: 4,
  },
  optionsDropdown: {
    position: 'absolute',
    top: 50,
    right: 16,
    backgroundColor: '#111E2E',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#263548',
    zIndex: 100,
    minWidth: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1A293E',
  },
  optionText: {
    fontSize: 13,
    color: '#F8FAFC',
    fontWeight: '500',
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 6,
    lineHeight: 22,
  },
  postContent: {
    fontSize: 14.5,
    color: '#CBD5E1',
    lineHeight: 21,
    marginBottom: Spacing.sm,
  },
  imageContainer: {
    borderRadius: Radius.md,
    overflow: 'hidden',
    marginVertical: Spacing.sm,
    backgroundColor: '#0D1724',
    maxHeight: 280,
  },
  postImage: {
    width: '100%',
    height: 220,
  },
  videoContainer: {
    borderRadius: Radius.md,
    overflow: 'hidden',
    marginVertical: Spacing.sm,
    height: 220,
    borderWidth: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(7, 17, 31, 0.45)',
  },
  playButtonCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#19E68C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  videoBadgePill: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  videoBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  videoDurationPill: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(7, 17, 31, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  videoDurationText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  projectBox: {
    backgroundColor: '#122032',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#1F334D',
    padding: 12,
    marginVertical: 8,
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  projectName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#19E68C',
  },
  techStackRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: 6,
  },
  tagText: {
    fontSize: 12,
    color: '#38BDF8',
    fontWeight: '500',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#1F3146',
    marginTop: 4,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  actionCount: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600',
  },
});
