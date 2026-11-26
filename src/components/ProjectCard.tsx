import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Animated, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Radius, Spacing } from '@/constants/theme';
import { Project } from '@/types';
import { Avatar } from './Avatar';
import { Badge } from './Badge';
import { ReactionBurst } from './ReactionBurst';
import { useDevCircle } from '@/context/DevCircleContext';
import { useRouter } from 'expo-router';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const router = useRouter();
  const { toggleLikeProject, toggleBookmarkProject, colors } = useDevCircle();
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
    toggleLikeProject(project.id);
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
    toggleBookmarkProject(project.id);
  };

  const openUrl = (url?: string) => {
    if (url) {
      Linking.openURL(url).catch((err) => console.warn('Could not open URL', err));
    }
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
                outputRange: [14, 0],
              }),
            },
          ],
        },
      ]}>
      {/* Cover Image */}
      <View style={[styles.imageWrapper, { backgroundColor: colors.backgroundSecondary }]}>
        <Image
          source={{ uri: project.coverImage }}
          style={styles.coverImage}
          contentFit="cover"
          transition={250}
        />
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>{project.category}</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Title & Actions */}
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: colors.text }]}>{project.title}</Text>
          <View style={styles.rightActions}>
            <TouchableOpacity
              onPress={handleBookmark}
              activeOpacity={0.7}
              style={styles.iconBtn}>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <ReactionBurst
                  triggerKey={bookmarkBurstTrigger}
                  color={colors.primary}
                  size={32}
                />
                <Animated.View style={{ transform: [{ scale: bookmarkScale }] }}>
                  <Ionicons
                    name={project.isBookmarked ? 'bookmark' : 'bookmark-outline'}
                    size={18}
                    color={project.isBookmarked ? colors.primary : colors.textSecondary}
                  />
                </Animated.View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleLike}
              activeOpacity={0.7}
              style={styles.iconBtn}>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <ReactionBurst
                  triggerKey={likeBurstTrigger}
                  color={colors.danger}
                  size={34}
                />
                <Animated.View style={{ transform: [{ scale: likeScale }] }}>
                  <Ionicons
                    name={project.isLiked ? 'heart' : 'heart-outline'}
                    size={18}
                    color={project.isLiked ? colors.danger : colors.textSecondary}
                  />
                </Animated.View>
              </View>
              <Text
                style={[
                  styles.likeCount,
                  { color: project.isLiked ? colors.danger : colors.textSecondary },
                  project.isLiked && { fontWeight: '700' },
                ]}>
                {project.likesCount}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Description */}
        <Text
          style={[styles.description, { color: colors.textSecondary }]}
          numberOfLines={3}>
          {project.description}
        </Text>

        {/* Technologies tags */}
        <View style={styles.techRow}>
          {project.technologies.map((tech, idx) => (
            <Badge key={idx} label={tech} variant="secondary" size="sm" />
          ))}
        </View>

        {/* Author & External Links */}
        <View style={styles.bottomRow}>
          <TouchableOpacity
            style={styles.authorRow}
            activeOpacity={0.8}
            onPress={() => router.push(`/profile/${project.author.username}`)}>
            <Avatar
              url={project.author.avatar}
              name={project.author.name}
              size={24}
              isVerified={project.author.isVerified}
            />
            <Text
              style={[styles.authorName, { color: colors.text }]}
              numberOfLines={1}>
              {project.author.name}
            </Text>
          </TouchableOpacity>

          <View style={styles.linksRow}>
            {project.githubUrl && (
              <TouchableOpacity
                onPress={() => openUrl(project.githubUrl)}
                activeOpacity={0.7}
                style={[
                  styles.linkPill,
                  {
                    backgroundColor: colors.inputBackground,
                    borderColor: colors.cardBorder,
                  },
                ]}>
                <Ionicons name="logo-github" size={14} color={colors.text} />
                <Text style={[styles.linkText, { color: colors.text }]}>Code</Text>
              </TouchableOpacity>
            )}
            {project.demoUrl && (
              <TouchableOpacity
                onPress={() => openUrl(project.demoUrl)}
                activeOpacity={0.7}
                style={[styles.linkPill, styles.demoPill]}>
                <Ionicons name="open-outline" size={13} color="#07111F" />
                <Text style={[styles.linkText, { color: '#07111F' }]}>Demo</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
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
    overflow: 'hidden',
    marginHorizontal: Spacing.md,
    marginVertical: 8,
  },
  imageWrapper: {
    width: '100%',
    height: 160,
    backgroundColor: '#0D1724',
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(7, 17, 31, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#263548',
  },
  categoryBadgeText: {
    color: '#19E68C',
    fontSize: 11,
    fontWeight: '700',
  },
  content: {
    padding: Spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#F8FAFC',
    flex: 1,
    marginRight: 8,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  likeCount: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  description: {
    fontSize: 13.5,
    color: '#94A3B8',
    lineHeight: 19,
    marginBottom: 10,
  },
  techRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#1F3146',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  authorName: {
    fontSize: 12,
    color: '#CBD5E1',
    fontWeight: '600',
  },
  linksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  linkPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1E2F46',
    borderWidth: 1,
    borderColor: '#263548',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: Radius.sm,
  },
  demoPill: {
    backgroundColor: '#19E68C',
    borderColor: '#19E68C',
  },
  linkText: {
    fontSize: 11,
    color: '#F8FAFC',
    fontWeight: '600',
  },
});
