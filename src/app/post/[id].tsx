import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Share,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Radius, Spacing } from '@/constants/theme';
import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';
import { CodeBlock } from '@/components/CodeBlock';
import { EmptyState } from '@/components/EmptyState';
import { useDevCircle } from '@/context/DevCircleContext';
import { Comment } from '@/types';

export default function PostDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const {
    posts,
    currentUser,
    toggleLikePost,
    toggleBookmarkPost,
    addComment,
    deleteComment,
    colors,
  } = useDevCircle();

  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [commentLikes, setCommentLikes] = useState<Record<string, boolean>>({});
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const post = useMemo(() => {
    return posts.find((p) => p.id === id);
  }, [posts, id]);

  const sortedComments = useMemo(() => {
    if (!post) return [];
    const list = [...post.comments];
    if (sortOrder === 'oldest') {
      return list;
    }
    return list.reverse();
  }, [post, sortOrder]);

  if (!post) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post Details</Text>
          <View style={{ width: 36 }} />
        </View>
        <EmptyState
          icon="alert-circle-outline"
          title="Post Not Found"
          description="This post may have been removed or is no longer available."
          actionTitle="Back to Feed"
          onAction={() => router.back()}
        />
      </SafeAreaView>
    );
  }

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
          message: `${post.content.slice(0, 100)}... \n\nDevCircle: ${shareUrl}`,
        });
      }
    } catch (e) {
      console.warn('Share error', e);
    }
  };

  const handleSendComment = () => {
    if (!commentText.trim()) return;

    let finalContent = commentText.trim();
    if (replyingTo) {
      finalContent = `@${replyingTo.author.username} ${finalContent}`;
    }

    addComment(post.id, finalContent, replyingTo?.id);
    setCommentText('');
    setReplyingTo(null);
  };

  const toggleCommentLike = (commentId: string) => {
    setCommentLikes((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const navigateToProfile = (username: string, isAuthorSelf?: boolean) => {
    if (isAuthorSelf || username === currentUser.username) {
      router.push('/(tabs)/profile');
    } else {
      router.push(`/profile/${username}`);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
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
          <Text style={[styles.headerTitle, { color: colors.text }]}>Discussion</Text>
          <TouchableOpacity
            onPress={handleShare}
            style={styles.headerActionBtn}
            activeOpacity={0.7}>
            <Ionicons name="share-social-outline" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          {/* Main Post Container */}
          <View
            style={[
              styles.postCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.cardBorder,
              },
            ]}>
            {/* Author Row */}
            <TouchableOpacity
              style={styles.authorRow}
              activeOpacity={0.8}
              onPress={() => navigateToProfile(post.author.username, post.isAuthorSelf)}>
              <Avatar
                url={post.author.avatar}
                name={post.author.name}
                size={44}
                isVerified={post.author.isVerified}
              />
              <View style={styles.authorMeta}>
                <View style={styles.nameRow}>
                  <Text style={[styles.authorName, { color: colors.text }]}>
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

            {/* Post Title */}
            {post.title && (
              <Text style={[styles.postTitle, { color: colors.text }]}>
                {post.title}
              </Text>
            )}

            {/* Full Post Content */}
            <Text style={[styles.postContent, { color: colors.text }]}>
              {post.content}
            </Text>

            {/* Code Snippet (if any) */}
            {post.codeSnippet && (
              <CodeBlock snippet={post.codeSnippet} showCopy={true} />
            )}

            {/* Image (if any) */}
            {post.imageUrl && (
              <View style={[styles.imageContainer, { borderColor: colors.cardBorder }]}>
                <Image
                  source={{ uri: post.imageUrl }}
                  style={styles.postImage}
                  contentFit="cover"
                  transition={250}
                />
              </View>
            )}

            {/* Project Meta Preview */}
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

            {/* Post Actions Bar */}
            <View style={[styles.actionBar, { borderTopColor: colors.cardBorder }]}>
              <TouchableOpacity
                style={styles.actionBtn}
                activeOpacity={0.7}
                onPress={() => toggleLikePost(post.id)}>
                <Ionicons
                  name={post.isLiked ? 'heart' : 'heart-outline'}
                  size={20}
                  color={post.isLiked ? colors.danger : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.actionCount,
                    { color: post.isLiked ? colors.danger : colors.textSecondary },
                    post.isLiked && { fontWeight: '700' },
                  ]}>
                  {post.likesCount}
                </Text>
              </TouchableOpacity>

              <View style={styles.actionBtn}>
                <Ionicons name="chatbubble-outline" size={19} color={colors.textSecondary} />
                <Text style={[styles.actionCount, { color: colors.textSecondary }]}>
                  {post.commentsCount}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.actionBtn}
                activeOpacity={0.7}
                onPress={() => toggleBookmarkPost(post.id)}>
                <Ionicons
                  name={post.isBookmarked ? 'bookmark' : 'bookmark-outline'}
                  size={19}
                  color={post.isBookmarked ? colors.primary : colors.textSecondary}
                />
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
                <Ionicons name="share-social-outline" size={19} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Comments Header & Sort Filter */}
          <View style={styles.commentsSectionHeader}>
            <Text style={[styles.commentsTitle, { color: colors.text }]}>
              Comments ({post.comments.length})
            </Text>

            <TouchableOpacity
              style={[
                styles.sortBtn,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.cardBorder,
                },
              ]}
              onPress={() =>
                setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')
              }>
              <Ionicons name="swap-vertical" size={14} color={colors.textSecondary} />
              <Text style={[styles.sortText, { color: colors.textSecondary }]}>
                {sortOrder === 'newest' ? 'Newest' : 'Oldest'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Comments List */}
          {sortedComments.length > 0 ? (
            sortedComments.map((comment) => {
              const isLiked = commentLikes[comment.id] || comment.isLiked;
              const likeCount = (comment.likesCount || 0) + (commentLikes[comment.id] && !comment.isLiked ? 1 : 0);

              return (
                <View
                  key={comment.id}
                  style={[
                    styles.commentItem,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.cardBorder,
                    },
                  ]}>
                  <TouchableOpacity
                    onPress={() =>
                      navigateToProfile(comment.author.username, comment.isAuthorSelf)
                    }>
                    <Avatar
                      url={comment.author.avatar}
                      name={comment.author.name}
                      size={36}
                      isVerified={comment.author.isVerified}
                    />
                  </TouchableOpacity>

                  <View style={styles.commentBody}>
                    <View style={styles.commentAuthorRow}>
                      <TouchableOpacity
                        onPress={() =>
                          navigateToProfile(comment.author.username, comment.isAuthorSelf)
                        }>
                        <Text style={[styles.commentAuthorName, { color: colors.text }]}>
                          {comment.author.name}
                        </Text>
                      </TouchableOpacity>
                      <Text style={[styles.commentTime, { color: colors.textTertiary }]}>
                        {comment.createdAt}
                      </Text>
                    </View>

                    <Text style={[styles.commentContent, { color: colors.text }]}>
                      {comment.content}
                    </Text>

                    <View style={styles.commentActionsRow}>
                      <TouchableOpacity
                        style={styles.commentAction}
                        onPress={() => toggleCommentLike(comment.id)}>
                        <Ionicons
                          name={isLiked ? 'heart' : 'heart-outline'}
                          size={15}
                          color={isLiked ? colors.danger : colors.textSecondary}
                        />
                        <Text
                          style={[
                            styles.commentActionText,
                            { color: isLiked ? colors.danger : colors.textSecondary },
                            isLiked && { fontWeight: '700' },
                          ]}>
                          {likeCount > 0 ? likeCount : ''}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.commentAction}
                        onPress={() => setReplyingTo(comment)}>
                        <Text style={[styles.commentActionText, { color: colors.textSecondary }]}>
                          Reply
                        </Text>
                      </TouchableOpacity>

                      {/* If comment authored by current user, show delete */}
                      {(comment.isAuthorSelf ||
                        comment.author.id === currentUser.id) && (
                        <TouchableOpacity
                          style={styles.commentAction}
                          onPress={() => {
                            Alert.alert(
                              'Delete Comment',
                              'Are you sure you want to delete this comment?',
                              [
                                { text: 'Cancel', style: 'cancel' },
                                {
                                  text: 'Delete',
                                  style: 'destructive',
                                  onPress: () => deleteComment(post.id, comment.id),
                                },
                              ]
                            );
                          }}>
                          <Ionicons name="trash-outline" size={13} color="#EF4444" />
                          <Text style={[styles.commentActionText, { color: '#EF4444' }]}>
                            Delete
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyCommentsBox}>
              <Ionicons name="chatbubble-ellipses-outline" size={28} color={colors.textTertiary} />
              <Text style={[styles.emptyCommentsText, { color: colors.textSecondary }]}>
                No comments yet. Start the conversation!
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Reply Indicator Banner */}
        {replyingTo && (
          <View
            style={[
              styles.replyBanner,
              {
                backgroundColor: colors.inputBackground,
                borderTopColor: colors.cardBorder,
              },
            ]}>
            <Text style={[styles.replyBannerText, { color: colors.text }]}>
              Replying to <Text style={{ color: colors.primary }}>@{replyingTo.author.username}</Text>
            </Text>
            <TouchableOpacity onPress={() => setReplyingTo(null)}>
              <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        )}

        {/* Fixed Comment Input Bar */}
        <View
          style={[
            styles.inputBar,
            {
              backgroundColor: colors.headerBg,
              borderTopColor: colors.cardBorder,
            },
          ]}>
          <Avatar
            url={currentUser.avatar}
            name={currentUser.name}
            size={34}
          />
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: colors.inputBackground,
                borderColor: colors.inputBorder,
                color: colors.text,
              },
            ]}
            placeholder={
              replyingTo
                ? `Reply to @${replyingTo.author.username}...`
                : 'Write a technical response...'
            }
            placeholderTextColor={colors.textTertiary}
            value={commentText}
            onChangeText={setCommentText}
            multiline={true}
          />
          <TouchableOpacity
            style={[
              styles.sendBtn,
              commentText.trim().length > 0
                ? { backgroundColor: colors.primary }
                : { backgroundColor: colors.inputBackground },
            ]}
            onPress={handleSendComment}
            disabled={!commentText.trim()}>
            <Ionicons
              name="send"
              size={16}
              color={
                commentText.trim().length > 0 ? colors.textInverse : colors.textTertiary
              }
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  headerActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#132235',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 24,
  },
  postCard: {
    backgroundColor: '#182536',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#263548',
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  authorMeta: {
    marginLeft: Spacing.sm,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  authorName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  authorUsername: {
    fontSize: 13,
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
  postTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 8,
    lineHeight: 24,
  },
  postContent: {
    fontSize: 15,
    color: '#CBD5E1',
    lineHeight: 23,
    marginBottom: Spacing.md,
  },
  imageContainer: {
    borderRadius: Radius.md,
    overflow: 'hidden',
    marginVertical: Spacing.sm,
    maxHeight: 300,
  },
  postImage: {
    width: '100%',
    height: 240,
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
    marginTop: 6,
    marginBottom: Spacing.sm,
  },
  tagText: {
    fontSize: 12,
    color: '#38BDF8',
    fontWeight: '500',
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#1F3146',
    marginTop: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  actionCount: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600',
  },
  commentsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: Spacing.md,
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#122033',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  sortText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  commentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#142234',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#1D2F45',
    padding: 12,
    marginBottom: 10,
    gap: 10,
  },
  commentBody: {
    flex: 1,
  },
  commentAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  commentAuthorName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  commentTime: {
    fontSize: 11,
    color: '#64748B',
  },
  commentContent: {
    fontSize: 13.5,
    color: '#CBD5E1',
    lineHeight: 19,
    marginBottom: 8,
  },
  commentActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  commentAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentActionText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  emptyCommentsBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  emptyCommentsText: {
    fontSize: 13,
    color: '#64748B',
  },
  replyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#112234',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#1B2C42',
  },
  replyBannerText: {
    fontSize: 12,
    color: '#CBD5E1',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0E1A29',
    borderTopWidth: 1,
    borderTopColor: '#1A293E',
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    gap: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#16273C',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#243A56',
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    color: '#F8FAFC',
    maxHeight: 80,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1C2C40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnActive: {
    backgroundColor: '#19E68C',
  },
});
