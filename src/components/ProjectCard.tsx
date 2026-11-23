import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { Project } from '@/types';
import { Avatar } from './Avatar';
import { Badge } from './Badge';
import { useDevCircle } from '@/context/DevCircleContext';
import { useRouter } from 'expo-router';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const router = useRouter();
  const { toggleLikeProject, toggleBookmarkProject } = useDevCircle();

  const openUrl = (url?: string) => {
    if (url) {
      Linking.openURL(url).catch((err) => console.warn('Could not open URL', err));
    }
  };

  return (
    <View style={styles.card}>
      {/* Cover Image */}
      <View style={styles.imageWrapper}>
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
          <Text style={styles.title}>{project.title}</Text>
          <View style={styles.rightActions}>
            <TouchableOpacity
              onPress={() => toggleBookmarkProject(project.id)}
              activeOpacity={0.7}
              style={styles.iconBtn}>
              <Ionicons
                name={project.isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={18}
                color={project.isBookmarked ? Colors.electricGreen : Colors.mutedGrey}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => toggleLikeProject(project.id)}
              activeOpacity={0.7}
              style={styles.iconBtn}>
              <Ionicons
                name={project.isLiked ? 'heart' : 'heart-outline'}
                size={18}
                color={project.isLiked ? Colors.danger : Colors.mutedGrey}
              />
              <Text
                style={[
                  styles.likeCount,
                  project.isLiked && { color: Colors.danger, fontWeight: '700' },
                ]}>
                {project.likesCount}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description} numberOfLines={3}>
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
            <Text style={styles.authorName} numberOfLines={1}>
              {project.author.name}
            </Text>
          </TouchableOpacity>

          <View style={styles.linksRow}>
            {project.githubUrl && (
              <TouchableOpacity
                onPress={() => openUrl(project.githubUrl)}
                activeOpacity={0.7}
                style={styles.linkPill}>
                <Ionicons name="logo-github" size={14} color={Colors.white} />
                <Text style={styles.linkText}>Code</Text>
              </TouchableOpacity>
            )}
            {project.demoUrl && (
              <TouchableOpacity
                onPress={() => openUrl(project.demoUrl)}
                activeOpacity={0.7}
                style={[styles.linkPill, styles.demoPill]}>
                <Ionicons name="open-outline" size={13} color={Colors.deepNavy} />
                <Text style={[styles.linkText, { color: Colors.deepNavy }]}>Demo</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
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
