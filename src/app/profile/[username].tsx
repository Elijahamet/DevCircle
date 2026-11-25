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
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
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

export default function OtherUserProfileScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const router = useRouter();
  const {
    getUserByUsername,
    posts,
    projects,
    followingUserIds,
    toggleFollowUser,
    colors,
    users,
  } = useDevCircle();

  const [activeTab, setActiveTab] = useState<ProfileTab>('posts');

  // Connections modal state
  const [connectionsVisible, setConnectionsVisible] = useState(false);
  const [connectionsTab, setConnectionsTab] = useState<'followers' | 'following'>('followers');

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

  // Posts with images or videos (media side)
  const userMediaPosts = useMemo(() => {
    return userPosts.filter((p) => Boolean(p.imageUrl || p.videoUrl));
  }, [userPosts]);

  const userProjects = useMemo(() => {
    if (!user) return [];
    return projects.filter(
      (p) => p.author.username.toLowerCase() === user.username.toLowerCase()
    );
  }, [projects, user]);

  const openUrl = (url?: string) => {
    if (url) {
      Linking.openURL(url).catch((e) => console.warn('Could not open link', e));
    }
  };

  const handleMessage = () => {
    if (!user) return;
    Alert.alert(
      `Message @${user.username}`,
      `Direct messaging with ${user.name} will be enabled in the upcoming community messaging release.`
    );
  };

  const handleOpenConnections = (tab: 'followers' | 'following') => {
    setConnectionsTab(tab);
    setConnectionsVisible(true);
  };

  if (!user) {
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
          <Text style={[styles.headerTitle, { color: colors.text }]}>Developer Profile</Text>
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header Bar */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.headerBg,
            borderBottomColor: colors.headerBorder,
          },
        ]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>@{user.username}</Text>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => Alert.alert('Share', `Profile link for @${user.username} copied!`)}
          activeOpacity={0.7}>
          <Ionicons name="share-social-outline" size={20} color={colors.text} />
        </TouchableOpacity>
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
              url={user.avatar}
              name={user.name}
              size={76}
              isVerified={user.isVerified}
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
                  {userPosts.length || user.postsCount}
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
                  {user.followersCount}
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
                  {user.followingCount}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Following
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Name & Role */}
          <Text style={[styles.name, { color: colors.text }]}>{user.name}</Text>
          <Text style={[styles.role, { color: colors.primary }]}>{user.role}</Text>

          {/* Location & Join date */}
          <View style={styles.metaRow}>
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>
              📍 {user.location}
            </Text>
            <Text style={[styles.metaDot, { color: colors.textTertiary }]}>•</Text>
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>
              {user.joinedDate}
            </Text>
          </View>

          {/* Bio */}
          <Text style={[styles.bio, { color: colors.textSecondary }]}>{user.bio}</Text>

          {/* Action Buttons: Follow & Message */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[
                styles.followBtn,
                isFollowing
                  ? [
                      styles.followingBtn,
                      {
                        backgroundColor: colors.inputBackground,
                        borderColor: colors.cardBorder,
                      },
                    ]
                  : { backgroundColor: colors.primary },
              ]}
              activeOpacity={0.8}
              onPress={() => toggleFollowUser(user.id)}>
              <Ionicons
                name={isFollowing ? 'checkmark' : 'person-add-outline'}
                size={16}
                color={isFollowing ? colors.textSecondary : colors.textInverse}
              />
              <Text
                style={[
                  styles.followBtnText,
                  {
                    color: isFollowing ? colors.textSecondary : colors.textInverse,
                  },
                ]}>
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.messageBtn,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.cardBorder,
                },
              ]}
              activeOpacity={0.8}
              onPress={handleMessage}>
              <Ionicons name="mail-outline" size={16} color={colors.text} />
              <Text style={[styles.messageBtnText, { color: colors.text }]}>
                Message
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Tabs */}
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

        {/* Tab 1: Posts (Cards) */}
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

        {/* Tab 2: Pictures & Media */}
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
                      source={{ uri: post.imageUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800' }}
                      style={styles.mediaTileImage}
                      contentFit="cover"
                      transition={250}
                    />

                    {(post.videoUrl || post.mediaType === 'video') && (
                      <View style={styles.mediaVideoBadge}>
                        <Ionicons name="videocam" size={12} color="#FFFFFF" />
                      </View>
                    )}

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
                description={`${user.name} hasn't shared any posts with pictures yet.`}
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
                title="No Projects"
                description={`${user.name} hasn't listed any showcase projects yet.`}
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
                {user.skills.map((skill, idx) => (
                  <Badge key={idx} label={skill} variant="primary" size="md" />
                ))}
              </View>
            </View>

            {/* Experience & Background */}
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

              {user.experience && (
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
                    <Text style={[styles.infoValue, { color: colors.text }]}>
                      {user.experience}
                    </Text>
                  </View>
                </View>
              )}

              {user.education && (
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
                    <Text style={[styles.infoValue, { color: colors.text }]}>
                      {user.education}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* Social Links */}
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

              {user.githubUrl && (
                <TouchableOpacity
                  style={styles.linkRow}
                  activeOpacity={0.7}
                  onPress={() => openUrl(user.githubUrl)}>
                  <Ionicons name="logo-github" size={18} color={colors.text} />
                  <Text style={[styles.linkLabel, { color: colors.text }]}>
                    {user.githubUrl}
                  </Text>
                  <Ionicons
                    name="open-outline"
                    size={14}
                    color={colors.textTertiary}
                  />
                </TouchableOpacity>
              )}

              {user.portfolioUrl && (
                <TouchableOpacity
                  style={styles.linkRow}
                  activeOpacity={0.7}
                  onPress={() => openUrl(user.portfolioUrl)}>
                  <Ionicons name="globe-outline" size={18} color="#38BDF8" />
                  <Text style={[styles.linkLabel, { color: colors.text }]}>
                    {user.portfolioUrl}
                  </Text>
                  <Ionicons
                    name="open-outline"
                    size={14}
                    color={colors.textTertiary}
                  />
                </TouchableOpacity>
              )}

              {user.websiteUrl && (
                <TouchableOpacity
                  style={styles.linkRow}
                  activeOpacity={0.7}
                  onPress={() => openUrl(user.websiteUrl)}>
                  <Ionicons name="link-outline" size={18} color="#19E68C" />
                  <Text style={[styles.linkLabel, { color: colors.text }]}>
                    {user.websiteUrl}
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
        userName={user.name}
        followersList={Object.values(users)}
        followingList={Object.values(users).filter((u) => u.id !== user.id)}
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
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  backBtn: {
    padding: 6,
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
  followBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: Radius.md,
  },
  followingBtn: {
    borderWidth: 1,
  },
  followBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  messageBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  messageBtnText: {
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
  mediaVideoBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(7, 17, 31, 0.75)',
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 4,
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
