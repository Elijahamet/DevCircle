import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';
import { PostCard } from '@/components/PostCard';
import { ProjectCard } from '@/components/ProjectCard';
import { EmptyState } from '@/components/EmptyState';
import { useDevCircle } from '@/context/DevCircleContext';

type ProfileTab = 'posts' | 'projects' | 'about';

export default function ProfileScreen() {
  const router = useRouter();
  const { currentUser, posts, projects } = useDevCircle();
  const [activeTab, setActiveTab] = useState<ProfileTab>('posts');

  const userPosts = useMemo(() => {
    return posts.filter(
      (p) => p.isAuthorSelf || p.author.username === currentUser.username
    );
  }, [posts, currentUser.username]);

  const userProjects = useMemo(() => {
    return projects.filter(
      (p) => p.author.username === currentUser.username
    );
  }, [projects, currentUser.username]);

  const openUrl = (url?: string) => {
    if (url) {
      Linking.openURL(url).catch((e) => console.warn('Could not open link', e));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header bar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>@{currentUser.username}</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => router.push('/bookmarks')}
            activeOpacity={0.7}>
            <Ionicons name="bookmark-outline" size={20} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => router.push('/settings')}
            activeOpacity={0.7}>
            <Ionicons name="settings-outline" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Profile Card Header */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatarRow}>
            <Avatar
              url={currentUser.avatar}
              name={currentUser.name}
              size={76}
              isVerified={currentUser.isVerified}
              showBorder={true}
            />

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{currentUser.postsCount}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{currentUser.followersCount}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{currentUser.followingCount}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>
          </View>

          {/* Name & Role */}
          <Text style={styles.name}>{currentUser.name}</Text>
          <Text style={styles.role}>{currentUser.role}</Text>

          {/* Location & Join date */}
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>📍 {currentUser.location}</Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaText}>{currentUser.joinedDate}</Text>
          </View>

          {/* Bio */}
          <Text style={styles.bio}>{currentUser.bio}</Text>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.editProfileBtn}
              activeOpacity={0.8}
              onPress={() => router.push('/edit-profile')}>
              <Ionicons name="create-outline" size={16} color="#07111F" />
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.shareProfileBtn}
              activeOpacity={0.8}
              onPress={() => router.push('/bookmarks')}>
              <Ionicons name="bookmark" size={16} color="#19E68C" />
              <Text style={styles.shareProfileText}>Bookmarks</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Tabs Navigation */}
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
                icon="create-outline"
                title="No Posts Yet"
                description="Share code, ask questions, or showcase your projects to the Ghanaian developer community."
                actionTitle="Create First Post"
                onAction={() => router.push('/(tabs)/create')}
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
                title="No Projects Showcase Yet"
                description="Show off web apps, mobile apps, or backend tools you have built."
                actionTitle="Add a Project"
                onAction={() => router.push('/(tabs)/create')}
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
                {currentUser.skills.map((skill, idx) => (
                  <Badge key={idx} label={skill} variant="primary" size="md" />
                ))}
              </View>
            </View>

            {/* Background & Experience */}
            <View style={styles.aboutCard}>
              <Text style={styles.aboutSectionTitle}>Experience & Background</Text>

              {currentUser.experience && (
                <View style={styles.infoRow}>
                  <Ionicons name="briefcase-outline" size={18} color="#38BDF8" />
                  <View style={styles.infoTextWrap}>
                    <Text style={styles.infoLabel}>Experience</Text>
                    <Text style={styles.infoValue}>{currentUser.experience}</Text>
                  </View>
                </View>
              )}

              {currentUser.education && (
                <View style={styles.infoRow}>
                  <Ionicons name="school-outline" size={18} color="#19E68C" />
                  <View style={styles.infoTextWrap}>
                    <Text style={styles.infoLabel}>Education</Text>
                    <Text style={styles.infoValue}>{currentUser.education}</Text>
                  </View>
                </View>
              )}
            </View>

            {/* Social & Web Links */}
            <View style={styles.aboutCard}>
              <Text style={styles.aboutSectionTitle}>Developer Links</Text>

              {currentUser.githubUrl && (
                <TouchableOpacity
                  style={styles.linkRow}
                  activeOpacity={0.7}
                  onPress={() => openUrl(currentUser.githubUrl)}>
                  <Ionicons name="logo-github" size={18} color={Colors.white} />
                  <Text style={styles.linkLabel}>{currentUser.githubUrl}</Text>
                  <Ionicons name="open-outline" size={14} color="#64748B" />
                </TouchableOpacity>
              )}

              {currentUser.portfolioUrl && (
                <TouchableOpacity
                  style={styles.linkRow}
                  activeOpacity={0.7}
                  onPress={() => openUrl(currentUser.portfolioUrl)}>
                  <Ionicons name="globe-outline" size={18} color="#38BDF8" />
                  <Text style={styles.linkLabel}>{currentUser.portfolioUrl}</Text>
                  <Ionicons name="open-outline" size={14} color="#64748B" />
                </TouchableOpacity>
              )}

              {currentUser.websiteUrl && (
                <TouchableOpacity
                  style={styles.linkRow}
                  activeOpacity={0.7}
                  onPress={() => openUrl(currentUser.websiteUrl)}>
                  <Ionicons name="link-outline" size={18} color="#19E68C" />
                  <Text style={styles.linkLabel}>{currentUser.websiteUrl}</Text>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#132235',
    alignItems: 'center',
    justifyContent: 'center',
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
  editProfileBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#19E68C',
    paddingVertical: 10,
    borderRadius: Radius.md,
  },
  editProfileText: {
    color: '#07111F',
    fontSize: 13,
    fontWeight: '700',
  },
  shareProfileBtn: {
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
  shareProfileText: {
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
