import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Linking,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Radius, Spacing } from '@/constants/theme';
import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';
import { PostCard } from '@/components/PostCard';
import { ProjectCard } from '@/components/ProjectCard';
import { EmptyState } from '@/components/EmptyState';
import { ConnectionsModal } from '@/components/ConnectionsModal';
import { useDevCircle } from '@/context/DevCircleContext';

const { width } = Dimensions.get('window');
const MEDIA_GRID_ITEM_WIDTH = (width - Spacing.md * 2 - 10) / 2;

type ProfileTab = 'posts' | 'media' | 'projects' | 'about';

export default function ProfileScreen() {
  const router = useRouter();
  const { currentUser, posts, projects, colors, users, followingUserIds } = useDevCircle();
  const [activeTab, setActiveTab] = useState<ProfileTab>('posts');

  // Connections modal state
  const [connectionsVisible, setConnectionsVisible] = useState(false);
  const [connectionsTab, setConnectionsTab] = useState<'followers' | 'following'>('followers');

  const userPosts = useMemo(() => {
    return posts.filter(
      (p) => p.isAuthorSelf || p.author.username === currentUser.username
    );
  }, [posts, currentUser.username]);

  // Posts with images (pictures side)
  const userMediaPosts = useMemo(() => {
    return userPosts.filter((p) => Boolean(p.imageUrl));
  }, [userPosts]);

  const userProjects = useMemo(() => {
    return projects.filter(
      (p) => p.author.username === currentUser.username
    );
  }, [projects, currentUser.username]);

  // Followers list for current user
  const followersList = useMemo(() => {
    return Object.values(users);
  }, [users]);

  // Following list for current user
  const followingList = useMemo(() => {
    return Object.values(users).filter((u) => followingUserIds.includes(u.id));
  }, [users, followingUserIds]);

  const openUrl = (url?: string) => {
    if (url) {
      Linking.openURL(url).catch((e) => console.warn('Could not open link', e));
    }
  };

  const handleOpenConnections = (tab: 'followers' | 'following') => {
    setConnectionsTab(tab);
    setConnectionsVisible(true);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header bar */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.headerBg,
            borderBottomColor: colors.headerBorder,
          },
        ]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          @{currentUser.username}
        </Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[
              styles.iconBtn,
              {
                backgroundColor: colors.inputBackground,
                borderColor: colors.cardBorder,
              },
            ]}
            onPress={() => router.push('/bookmarks')}
            activeOpacity={0.7}>
            <Ionicons name="bookmark-outline" size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.iconBtn,
              {
                backgroundColor: colors.inputBackground,
                borderColor: colors.cardBorder,
              },
            ]}
            onPress={() => router.push('/settings')}
            activeOpacity={0.7}>
            <Ionicons name="settings-outline" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Profile Card Header */}
        <View
          style={[
            styles.profileHeaderCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.cardBorder,
            },
          ]}>
          <View style={styles.avatarRow}>
            <Avatar
              url={currentUser.avatar}
              name={currentUser.name}
              size={76}
              isVerified={currentUser.isVerified}
              showBorder={true}
            />

            <View
              style={[
                styles.statsRow,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.cardBorder,
                },
              ]}>
              <TouchableOpacity
                style={styles.statItem}
                onPress={() => setActiveTab('posts')}
                activeOpacity={0.7}>
                <Text style={[styles.statNumber, { color: colors.text }]}>
                  {userPosts.length || currentUser.postsCount}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Posts
                </Text>
              </TouchableOpacity>

              <View
                style={[
                  styles.statDivider,
                  { backgroundColor: colors.cardBorder },
                ]}
              />

              <TouchableOpacity
                style={styles.statItem}
                onPress={() => handleOpenConnections('followers')}
                activeOpacity={0.7}>
                <Text style={[styles.statNumber, { color: colors.text }]}>
                  {currentUser.followersCount}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Followers
                </Text>
              </TouchableOpacity>

              <View
                style={[
                  styles.statDivider,
                  { backgroundColor: colors.cardBorder },
                ]}
              />

              <TouchableOpacity
                style={styles.statItem}
                onPress={() => handleOpenConnections('following')}
                activeOpacity={0.7}>
                <Text style={[styles.statNumber, { color: colors.text }]}>
                  {followingList.length || currentUser.followingCount}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Following
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Name & Role */}
          <Text style={[styles.name, { color: colors.text }]}>{currentUser.name}</Text>
          <Text style={[styles.role, { color: colors.primary }]}>{currentUser.role}</Text>

          {/* Location & Join date */}
          <View style={styles.metaRow}>
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>
              📍 {currentUser.location}
            </Text>
            <Text style={[styles.metaDot, { color: colors.textTertiary }]}>•</Text>
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>
              {currentUser.joinedDate}
            </Text>
          </View>

          {/* Bio */}
          <Text style={[styles.bio, { color: colors.textSecondary }]}>{currentUser.bio}</Text>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[
                styles.editProfileBtn,
                { backgroundColor: colors.primary },
              ]}
              activeOpacity={0.8}
              onPress={() => router.push('/edit-profile')}>
              <Ionicons name="create-outline" size={16} color={colors.textInverse} />
              <Text style={[styles.editProfileText, { color: colors.textInverse }]}>
                Edit Profile
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.connectionsQuickBtn,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.cardBorder,
                },
              ]}
              activeOpacity={0.8}
              onPress={() => handleOpenConnections('followers')}>
              <Ionicons name="people-outline" size={16} color={colors.primary} />
              <Text style={[styles.connectionsQuickText, { color: colors.text }]}>
                Community ({currentUser.followersCount})
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Tabs Navigation */}
        <View
          style={[
            styles.tabsContainer,
            {
              backgroundColor: colors.card,
              borderColor: colors.cardBorder,
            },
          ]}>
          <TouchableOpacity
            style={[
              styles.tabBtn,
              activeTab === 'posts' && [
                styles.tabBtnActive,
                { borderBottomColor: colors.primary },
              ],
            ]}
            onPress={() => setActiveTab('posts')}>
            <Ionicons
              name="newspaper-outline"
              size={15}
              color={activeTab === 'posts' ? colors.primary : colors.textSecondary}
            />
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === 'posts'
                      ? colors.primary
                      : colors.textSecondary,
                  fontWeight: activeTab === 'posts' ? '700' : '500',
                },
              ]}>
              Posts ({userPosts.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabBtn,
              activeTab === 'media' && [
                styles.tabBtnActive,
                { borderBottomColor: colors.primary },
              ],
            ]}
            onPress={() => setActiveTab('media')}>
            <Ionicons
              name="images-outline"
              size={15}
              color={activeTab === 'media' ? colors.primary : colors.textSecondary}
            />
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === 'media'
                      ? colors.primary
                      : colors.textSecondary,
                  fontWeight: activeTab === 'media' ? '700' : '500',
                },
              ]}>
              Pictures ({userMediaPosts.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabBtn,
              activeTab === 'projects' && [
                styles.tabBtnActive,
                { borderBottomColor: colors.primary },
              ],
            ]}
            onPress={() => setActiveTab('projects')}>
            <Ionicons
              name="rocket-outline"
              size={15}
              color={activeTab === 'projects' ? colors.primary : colors.textSecondary}
            />
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === 'projects'
                      ? colors.primary
                      : colors.textSecondary,
                  fontWeight: activeTab === 'projects' ? '700' : '500',
                },
              ]}>
              Projects ({userProjects.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabBtn,
              activeTab === 'about' && [
                styles.tabBtnActive,
                { borderBottomColor: colors.primary },
              ],
            ]}
            onPress={() => setActiveTab('about')}>
            <Ionicons
              name="information-circle-outline"
              size={15}
              color={activeTab === 'about' ? colors.primary : colors.textSecondary}
            />
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === 'about'
                      ? colors.primary
                      : colors.textSecondary,
                  fontWeight: activeTab === 'about' ? '700' : '500',
                },
              ]}>
              About
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab 1: Posts (Feed Cards) */}
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

        {/* Tab 2: Pictures & Media Side */}
        {activeTab === 'media' && (
          <View style={styles.mediaContainer}>
            {userMediaPosts.length > 0 ? (
              <View style={styles.mediaGrid}>
                {userMediaPosts.map((post) => (
                  <TouchableOpacity
                    key={post.id}
                    activeOpacity={0.85}
                    onPress={() => router.push(`/post/${post.id}`)}
                    style={[
                      styles.mediaTile,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.cardBorder,
                      },
                    ]}>
                    <Image
                      source={{ uri: post.imageUrl }}
                      style={styles.mediaTileImage}
                      contentFit="cover"
                      transition={250}
                    />

                    {/* Gradient / Title overlay */}
                    <View style={styles.mediaTileOverlay}>
                      <Text
                        style={[styles.mediaTileTitle, { color: '#FFFFFF' }]}
                        numberOfLines={2}>
                        {post.title || post.content}
                      </Text>
                      <View style={styles.mediaTileStats}>
                        <View style={styles.mediaStatItem}>
                          <Ionicons name="heart" size={12} color="#EF4444" />
                          <Text style={styles.mediaStatText}>
                            {post.likesCount}
                          </Text>
                        </View>
                        <View style={styles.mediaStatItem}>
                          <Ionicons
                            name="chatbubble"
                            size={11}
                            color="#38BDF8"
                          />
                          <Text style={styles.mediaStatText}>
                            {post.commentsCount}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <EmptyState
                icon="images-outline"
                title="No Pictures or Media Yet"
                description="Share UI screenshots, architecture diagrams, and developer workstation pictures."
                actionTitle="Create Post with Picture"
                onAction={() => router.push('/(tabs)/create')}
              />
            )}
          </View>
        )}

        {/* Tab 3: Projects */}
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

        {/* Tab 4: About */}
        {activeTab === 'about' && (
          <View style={styles.aboutContainer}>
            {/* Skills */}
            <View
              style={[
                styles.aboutCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.cardBorder,
                },
              ]}>
              <Text style={[styles.aboutSectionTitle, { color: colors.text }]}>
                Technical Skills
              </Text>
              <View style={styles.skillsGrid}>
                {currentUser.skills.map((skill, idx) => (
                  <Badge key={idx} label={skill} variant="primary" size="md" />
                ))}
              </View>
            </View>

            {/* Background & Experience */}
            <View
              style={[
                styles.aboutCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.cardBorder,
                },
              ]}>
              <Text style={[styles.aboutSectionTitle, { color: colors.text }]}>
                Experience & Background
              </Text>

              {currentUser.experience && (
                <View style={styles.infoRow}>
                  <Ionicons name="briefcase-outline" size={18} color="#38BDF8" />
                  <View style={styles.infoTextWrap}>
                    <Text
                      style={[
                        styles.infoLabel,
                        { color: colors.textSecondary },
                      ]}>
                      Experience
                    </Text>
                    <Text
                      style={[styles.infoValue, { color: colors.text }]}>
                      {currentUser.experience}
                    </Text>
                  </View>
                </View>
              )}

              {currentUser.education && (
                <View style={styles.infoRow}>
                  <Ionicons name="school-outline" size={18} color="#19E68C" />
                  <View style={styles.infoTextWrap}>
                    <Text
                      style={[
                        styles.infoLabel,
                        { color: colors.textSecondary },
                      ]}>
                      Education
                    </Text>
                    <Text
                      style={[styles.infoValue, { color: colors.text }]}>
                      {currentUser.education}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* Social & Web Links */}
            <View
              style={[
                styles.aboutCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.cardBorder,
                },
              ]}>
              <Text style={[styles.aboutSectionTitle, { color: colors.text }]}>
                Developer Links
              </Text>

              {currentUser.githubUrl && (
                <TouchableOpacity
                  style={styles.linkRow}
                  activeOpacity={0.7}
                  onPress={() => openUrl(currentUser.githubUrl)}>
                  <Ionicons name="logo-github" size={18} color={colors.text} />
                  <Text style={[styles.linkLabel, { color: colors.text }]}>
                    {currentUser.githubUrl}
                  </Text>
                  <Ionicons
                    name="open-outline"
                    size={14}
                    color={colors.textTertiary}
                  />
                </TouchableOpacity>
              )}

              {currentUser.portfolioUrl && (
                <TouchableOpacity
                  style={styles.linkRow}
                  activeOpacity={0.7}
                  onPress={() => openUrl(currentUser.portfolioUrl)}>
                  <Ionicons name="globe-outline" size={18} color="#38BDF8" />
                  <Text style={[styles.linkLabel, { color: colors.text }]}>
                    {currentUser.portfolioUrl}
                  </Text>
                  <Ionicons
                    name="open-outline"
                    size={14}
                    color={colors.textTertiary}
                  />
                </TouchableOpacity>
              )}

              {currentUser.websiteUrl && (
                <TouchableOpacity
                  style={styles.linkRow}
                  activeOpacity={0.7}
                  onPress={() => openUrl(currentUser.websiteUrl)}>
                  <Ionicons name="link-outline" size={18} color="#19E68C" />
                  <Text style={[styles.linkLabel, { color: colors.text }]}>
                    {currentUser.websiteUrl}
                  </Text>
                  <Ionicons
                    name="open-outline"
                    size={14}
                    color={colors.textTertiary}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Followers & Following Modal */}
      <ConnectionsModal
        visible={connectionsVisible}
        onClose={() => setConnectionsVisible(false)}
        initialTab={connectionsTab}
        userName={currentUser.name}
        followersList={followersList}
        followingList={followingList}
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
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
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  profileHeaderCard: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
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
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  statItem: {
    alignItems: 'center',
    minWidth: 46,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 24,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 2,
  },
  role: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  metaText: {
    fontSize: 12.5,
  },
  metaDot: {
    fontSize: 10,
  },
  bio: {
    fontSize: 13.5,
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  editProfileBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: Radius.md,
  },
  editProfileText: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  connectionsQuickBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  connectionsQuickText: {
    fontSize: 13.5,
    fontWeight: '600',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 13,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 12,
  },
  tabContent: {
    paddingTop: 8,
  },
  mediaContainer: {
    padding: Spacing.md,
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  mediaTile: {
    width: MEDIA_GRID_ITEM_WIDTH,
    height: MEDIA_GRID_ITEM_WIDTH * 1.05,
    borderRadius: Radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    position: 'relative',
  },
  mediaTileImage: {
    width: '100%',
    height: '100%',
  },
  mediaTileOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    backgroundColor: 'rgba(7, 17, 31, 0.75)',
  },
  mediaTileTitle: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 14,
    marginBottom: 4,
  },
  mediaTileStats: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  mediaStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  mediaStatText: {
    fontSize: 10.5,
    color: '#F8FAFC',
    fontWeight: '600',
  },
  aboutContainer: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  aboutCard: {
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  aboutSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: Spacing.md,
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
    fontSize: 12,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 13.5,
    fontWeight: '600',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
  },
  linkLabel: {
    fontSize: 13,
    flex: 1,
  },
});
