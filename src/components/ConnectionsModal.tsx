import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Radius, Spacing } from '@/constants/theme';
import { Avatar } from './Avatar';
import { Badge } from './Badge';
import { useDevCircle } from '@/context/DevCircleContext';
import { User } from '@/types';

interface ConnectionsModalProps {
  visible: boolean;
  onClose: () => void;
  initialTab?: 'followers' | 'following';
  userName?: string;
  followersList?: User[];
  followingList?: User[];
}

export const ConnectionsModal: React.FC<ConnectionsModalProps> = ({
  visible,
  onClose,
  initialTab = 'followers',
  userName = 'Developer',
  followersList,
  followingList,
}) => {
  const router = useRouter();
  const {
    currentUser,
    users,
    followingUserIds,
    toggleFollowUser,
    colors,
  } = useDevCircle();

  const [selectedTab, setSelectedTab] = useState<'followers' | 'following' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const activeTab = selectedTab ?? initialTab;

  const handleClose = () => {
    setSelectedTab(null);
    setSearchQuery('');
    onClose();
  };

  // Fallback demo users if lists not passed
  const allUsersList = useMemo(() => Object.values(users), [users]);

  // Actual or simulated followers (users following this profile)
  const resolvedFollowers = useMemo(() => {
    if (followersList && followersList.length > 0) return followersList;
    return allUsersList;
  }, [followersList, allUsersList]);

  // Actual or simulated following (users this profile follows)
  const resolvedFollowing = useMemo(() => {
    if (followingList && followingList.length > 0) return followingList;
    return allUsersList.filter(
      (u) => followingUserIds.includes(u.id) || !!u.isFollowing
    );
  }, [followingList, allUsersList, followingUserIds]);

  const activeList = activeTab === 'followers' ? resolvedFollowers : resolvedFollowing;

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return activeList;
    const q = searchQuery.toLowerCase();
    return activeList.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q) ||
        u.skills.some((s) => s.toLowerCase().includes(q))
    );
  }, [activeList, searchQuery]);

  const handleUserPress = (user: User) => {
    handleClose();
    if (user.id === currentUser.id || user.username === currentUser.username) {
      router.push('/(tabs)/profile');
    } else {
      router.push(`/profile/${user.username}`);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View
          style={[
            styles.modalContainer,
            {
              backgroundColor: colors.card,
              borderColor: colors.cardBorder,
            },
          ]}>
          {/* Header */}
          <View
            style={[
              styles.header,
              { borderBottomColor: colors.cardBorder },
            ]}>
            <View>
              <Text style={[styles.headerTitle, { color: colors.text }]}>
                {userName}&apos;s Community
              </Text>
              <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                Connect with Ghanaian developers
              </Text>
            </View>

            <TouchableOpacity
              onPress={handleClose}
              style={[
                styles.closeBtn,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.cardBorder,
                },
              ]}
              activeOpacity={0.7}>
              <Ionicons name="close" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Segmented Tabs: Followers vs Following */}
          <View
            style={[
              styles.tabBar,
              {
                backgroundColor: colors.inputBackground,
                borderColor: colors.cardBorder,
              },
            ]}>
            <TouchableOpacity
              style={[
                styles.tabBtn,
                activeTab === 'followers' && [
                  styles.tabBtnActive,
                  { backgroundColor: colors.card },
                ],
              ]}
              onPress={() => setSelectedTab('followers')}
              activeOpacity={0.8}>
              <Ionicons
                name="people"
                size={16}
                color={activeTab === 'followers' ? colors.primary : colors.textSecondary}
              />
              <Text
                style={[
                  styles.tabText,
                  {
                    color:
                      activeTab === 'followers'
                        ? colors.text
                        : colors.textSecondary,
                    fontWeight: activeTab === 'followers' ? '700' : '500',
                  },
                ]}>
                Followers ({resolvedFollowers.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabBtn,
                activeTab === 'following' && [
                  styles.tabBtnActive,
                  { backgroundColor: colors.card },
                ],
              ]}
              onPress={() => setSelectedTab('following')}
              activeOpacity={0.8}>
              <Ionicons
                name="person-add"
                size={16}
                color={activeTab === 'following' ? colors.primary : colors.textSecondary}
              />
              <Text
                style={[
                  styles.tabText,
                  {
                    color:
                      activeTab === 'following'
                        ? colors.text
                        : colors.textSecondary,
                    fontWeight: activeTab === 'following' ? '700' : '500',
                  },
                ]}>
                Following ({resolvedFollowing.length})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Search bar inside modal */}
          <View style={styles.searchWrapper}>
            <View
              style={[
                styles.searchBox,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.inputBorder,
                },
              ]}>
              <Ionicons
                name="search-outline"
                size={17}
                color={colors.textTertiary}
              />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder={`Search ${activeTab === 'followers' ? 'followers' : 'following'}...`}
                placeholderTextColor={colors.textTertiary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                clearButtonMode="while-editing"
              />
              {searchQuery.length > 0 && Platform.OS !== 'ios' && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons
                    name="close-circle"
                    size={16}
                    color={colors.textTertiary}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* User List */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                const isSelf =
                  user.id === currentUser.id ||
                  user.username === currentUser.username;
                const isCurrentlyFollowing =
                  followingUserIds.includes(user.id) || !!user.isFollowing;

                return (
                  <TouchableOpacity
                    key={user.id}
                    activeOpacity={0.7}
                    onPress={() => handleUserPress(user)}
                    style={[
                      styles.userRow,
                      {
                        borderBottomColor: colors.cardBorder,
                      },
                    ]}>
                    <Avatar
                      url={user.avatar}
                      name={user.name}
                      size={46}
                      isVerified={user.isVerified}
                    />

                    <View style={styles.userMeta}>
                      <View style={styles.userNameRow}>
                        <Text
                          style={[styles.userName, { color: colors.text }]}
                          numberOfLines={1}>
                          {user.name}
                        </Text>
                        <Text
                          style={[
                            styles.userHandle,
                            { color: colors.textSecondary },
                          ]}>
                          @{user.username}
                        </Text>
                      </View>

                      <Text
                        style={[
                          styles.userRole,
                          { color: colors.textSecondary },
                        ]}
                        numberOfLines={1}>
                        {user.role}
                      </Text>

                      <View style={styles.locationRow}>
                        <Ionicons
                          name="location-outline"
                          size={12}
                          color={colors.textTertiary}
                        />
                        <Text
                          style={[
                            styles.userLocation,
                            { color: colors.textTertiary },
                          ]}>
                          {user.location}
                        </Text>
                      </View>

                      {user.skills && user.skills.length > 0 && (
                        <View style={styles.skillsPreview}>
                          {user.skills.slice(0, 3).map((s, idx) => (
                            <Badge
                              key={idx}
                              label={s}
                              size="sm"
                              variant="secondary"
                            />
                          ))}
                        </View>
                      )}
                    </View>

                    {/* Follow Action Button */}
                    {!isSelf && (
                      <TouchableOpacity
                        onPress={() => toggleFollowUser(user.id)}
                        activeOpacity={0.8}
                        style={[
                          styles.followBtn,
                          isCurrentlyFollowing
                            ? [
                                styles.followingBtn,
                                {
                                  borderColor: colors.cardBorder,
                                  backgroundColor: colors.inputBackground,
                                },
                              ]
                            : [
                                styles.followActionBtn,
                                {
                                  backgroundColor: colors.primary,
                                },
                              ],
                        ]}>
                        <Ionicons
                          name={
                            isCurrentlyFollowing
                              ? 'checkmark'
                              : 'person-add-outline'
                          }
                          size={13}
                          color={
                            isCurrentlyFollowing
                              ? colors.textSecondary
                              : '#07111F'
                          }
                        />
                        <Text
                          style={[
                            styles.followBtnText,
                            {
                              color: isCurrentlyFollowing
                                ? colors.textSecondary
                                : '#07111F',
                            },
                          ]}>
                          {isCurrentlyFollowing ? 'Following' : 'Follow'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </TouchableOpacity>
                );
              })
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="search"
                  size={36}
                  color={colors.textTertiary}
                />
                <Text style={[styles.emptyTitle, { color: colors.text }]}>
                  No developers found
                </Text>
                <Text
                  style={[
                    styles.emptySubtitle,
                    { color: colors.textSecondary },
                  ]}>
                  Try a different search term or check back soon.
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    maxHeight: '85%',
    minHeight: '60%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    paddingTop: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.md,
    padding: 3,
    borderRadius: Radius.lg,
    borderWidth: 1,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: Radius.md,
  },
  tabBtnActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 13,
  },
  searchWrapper: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    height: '100%',
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    gap: Spacing.md,
  },
  userMeta: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
  },
  userHandle: {
    fontSize: 12,
  },
  userRole: {
    fontSize: 12,
    marginTop: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  userLocation: {
    fontSize: 11,
  },
  skillsPreview: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 6,
    flexWrap: 'wrap',
  },
  followBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radius.full,
  },
  followingBtn: {
    borderWidth: 1,
  },
  followActionBtn: {},
  followBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
