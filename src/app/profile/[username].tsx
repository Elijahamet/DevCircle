import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';
import { PostCard } from '@/components/PostCard';
import { ProjectCard } from '@/components/ProjectCard';
import { EmptyState } from '@/components/EmptyState';
import { useDevCircle } from '@/context/DevCircleContext';

type ProfileTab = 'posts' | 'projects' | 'about';

export default function OtherUserProfileScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const router = useRouter();
  const {
    getUserByUsername,
    posts,
    projects,
    followingUserIds,
    toggleFollowUser,
  } = useDevCircle();

  const [activeTab, setActiveTab] = useState<ProfileTab>('posts');

  const user = useMemo(() => {
    return getUserByUsername(username || '');
  }, [username, getUserByUsername]);

  const isFollowing = useMemo(() => {
    if (!user) return false;
    return followingUserIds.includes(user.id) || !!user.isFollowing;
  }, [user, followingUserIds]);

  const userPosts = useMemo(() => {
    if (!user) return [];
    return posts.filter(
      (p) => p.author.username.toLowerCase() === user.username.toLowerCase()
    );
  }, [posts, user]);

  const userProjects = useMemo(() => {
    if (!user) return [];
    return projects.filter(
      (p) => p.author.username.toLowerCase() === user.username.toLowerCase()
    );
  }, [projects, user]);

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Developer Profile</Text>
          <View style={{ width: 36 }} />
        </View>
        <EmptyState
          icon="person-outline"
          title="User Not Found"
          description="The developer profile you are looking for does not exist."
          actionTitle="Back to Discover"
          onAction={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  const openUrl = (url?: string) => {
    if (url) {
      Linking.openURL(url).catch((e) => console.warn('Could not open link', e));
    }
  };

  const handleMessage = () => {
    Alert.alert(
      `Message @${user.username}`,
      `Direct messaging with ${user.name} will be enabled in the upcoming community messaging release.`
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>@{user.username}</Text>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => Alert.alert('Share', `Profile link for @${user.username} copied!`)}
          activeOpacity={0.7}>
          <Ionicons name="share-social-outline" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Profile Card Header */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatarRow}>
            <Avatar
              url={user.avatar}
              name={user.name}
              size={76}
              isVerified={user.isVerified}
              showBorder={true}
            />

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{user.postsCount}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{user.followersCount}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{user.followingCount}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>
          </View>

          {/* Name & Role */}
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.role}>{user.role}</Text>

          {/* Location & Join date */}
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>📍 {user.location}</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaText}>{user.joinedDate}</Text>
          </View>

          {/* Bio */}
          <Text style={styles.bio}>{user.bio}</Text>

          {/* Action Buttons: Follow & Message */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.followBtn, isFollowing && styles.followingBtn]}
              activeOpacity={0.8}
              onPress={() => toggleFollowUser(user.id)}>
              <Ionicons
                name={isFollowing ? 'checkmark' : 'person-add-outline'}
                size={16}
                color={isFollowing ? '#94A3B8' : '#07111F'}
              />
              <Text
                style={[
                  styles.followBtnText,
                  isFollowing && styles.followingBtnText,
                ]}>
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.messageBtn}
              activeOpacity={0.8}
              onPress={handleMessage}>
              <Ionicons name="mail-outline" size={16} color="#F8FAFC" />
              <Text style={styles.messageBtnText}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'posts' && styles.tabBtnActive]}
            onPress={() => setActiveTab('posts')}>
            <Ionicons
              name="newspaper-outline"
              size={16}
              color={activeTab === 'posts' ? '#19E68C' : '#94A3B8'}
            />
            <Text
              style={[styles.tabText, activeTab === 'posts' && styles.tabTextActive]}>
              Posts ({userPosts.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'projects' && styles.tabBtnActive]}
            onPress={() => setActiveTab('projects')}>
            <Ionicons
              name="rocket-outline"
              size={16}
              color={activeTab === 'projects' ? '#19E68C' : '#94A3B8'}
            />
            <Text
              style={[styles.tabText, activeTab === 'projects' && styles.tabTextActive]}>
              Projects ({userProjects.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'about' && styles.tabBtnActive]}
            onPress={() => setActiveTab('about')}>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color={activeTab === 'about' ? '#19E68C' : '#94A3B8'}
            />
            <Text
              style={[styles.tabText, activeTab === 'about' && styles.tabTextActive]}>
              About
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab 1: Posts */}
        {activeTab === 'posts' && (
          <View style={styles.tabContent}>
            {userPosts.length > 0 ? (
              userPosts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <EmptyState
                icon="newspaper-outline"
                title="No Posts"
                description={`${user.name} hasn't shared any posts yet.`}
              />
            )}
          </View>
        )}

        {/* Tab 2: Projects */}
        {activeTab === 'projects' && (
          <View style={styles.tabContent}>
            {userProjects.length > 0 ? (
              userProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))
            ) : (
              <EmptyState
                icon="rocket-outline"
                title="No Projects"
                description={`${user.name} hasn't listed any showcase projects yet.`}
              />
            )}
          </View>
        )}

        {/* Tab 3: About */}
        {activeTab === 'about' && (
          <View style={styles.aboutContainer}>
            {/* Skills */}
            <View style={styles.aboutCard}>
              <Text style={styles.aboutSectionTitle}>Technical Skills</Text>
              <View style={styles.skillsGrid}>
                {user.skills.map((skill, idx) => (
                  <Badge key={idx} label={skill} variant="primary" size="md" />
                ))}
              </View>
            </View>

            {/* Experience & Education */}
            <View style={styles.aboutCard}>
              <Text style={styles.aboutSectionTitle}>Experience & Background</Text>

              {user.experience && (
                <View style={styles.infoRow}>
                  <Ionicons name="briefcase-outline" size={18} color="#38BDF8" />
                  <View style={styles.infoTextWrap}>
                    <Text style={styles.infoLabel}>Experience</Text>
                    <Text style={styles.infoValue}>{user.experience}</Text>
                  </View>
                </View>
              )}

              {user.education && (
                <View style={styles.infoRow}>
                  <Ionicons name="school-outline" size={18} color="#19E68C" />
                  <View style={styles.infoTextWrap}>
                    <Text style={styles.infoLabel}>Education</Text>
                    <Text style={styles.infoValue}>{user.education}</Text>
                  </View>
                </View>
              )}
            </View>

            {/* Social Links */}
            <View style={styles.aboutCard}>
              <Text style={styles.aboutSectionTitle}>Developer Links</Text>

              {user.githubUrl && (
                <TouchableOpacity
                  style={styles.linkRow}
                  activeOpacity={0.7}
                  onPress={() => openUrl(user.githubUrl)}>
                  <Ionicons name="logo-github" size={18} color={Colors.white} />
                  <Text style={styles.linkLabel}>{user.githubUrl}</Text>
                  <Ionicons name="open-outline" size={14} color="#64748B" />
                </TouchableOpacity>
              )}

              {user.portfolioUrl && (
                <TouchableOpacity
                  style={styles.linkRow}
                  activeOpacity={0.7}
                  onPress={() => openUrl(user.portfolioUrl)}>
                  <Ionicons name="globe-outline" size={18} color="#38BDF8" />
                  <Text style={styles.linkLabel}>{user.portfolioUrl}</Text>
                  <Ionicons name="open-outline" size={14} color="#64748B" />
                </TouchableOpacity>
              )}
            </View>
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
    paddingBottom: 32,
  },
  profileHeaderCard: {
    backgroundColor: '#0F1D2E',
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#1A2C42',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#152438',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#1F334E',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  statLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#263B54',
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 2,
  },
  role: {
    fontSize: 14,
    fontWeight: '600',
    color: '#19E68C',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  metaText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  metaDot: {
    fontSize: 10,
    color: '#64748B',
  },
  bio: {
    fontSize: 14,
    color: '#CBD5E1',
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  followBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#19E68C',
    paddingVertical: 10,
    borderRadius: Radius.md,
  },
  followingBtn: {
    backgroundColor: '#18273B',
    borderWidth: 1,
    borderColor: '#26384E',
  },
  followBtnText: {
    color: '#07111F',
    fontSize: 13,
    fontWeight: '700',
  },
  followingBtnText: {
    color: '#94A3B8',
  },
  messageBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#18273B',
    borderWidth: 1,
    borderColor: '#26384E',
    paddingVertical: 10,
    borderRadius: Radius.md,
  },
  messageBtnText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '600',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#1A2C42',
    backgroundColor: '#0A1524',
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: {
    borderBottomColor: '#19E68C',
    backgroundColor: 'rgba(25, 230, 140, 0.05)',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94A3B8',
  },
  tabTextActive: {
    color: '#19E68C',
    fontWeight: '700',
  },
  tabContent: {
    paddingTop: 10,
  },
  aboutContainer: {
    padding: Spacing.md,
    gap: 12,
  },
  aboutCard: {
    backgroundColor: '#122033',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#1E324A',
    padding: Spacing.md,
  },
  aboutSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 10,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  infoTextWrap: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 13.5,
    color: '#CBD5E1',
    fontWeight: '500',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#16283E',
    padding: 10,
    borderRadius: Radius.sm,
    marginBottom: 8,
  },
  linkLabel: {
    fontSize: 13,
    color: '#38BDF8',
    flex: 1,
  },
});
