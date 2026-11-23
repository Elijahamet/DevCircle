import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '@/constants/theme';
import { Avatar } from '@/components/Avatar';
import { FilterPills, FilterItem } from '@/components/FilterPills';
import { EmptyState } from '@/components/EmptyState';
import { useDevCircle } from '@/context/DevCircleContext';
import { Notification, NotificationType } from '@/types';

const NOTIF_FILTERS: FilterItem[] = [
  { id: 'all', label: 'All' },
  { id: 'like', label: 'Likes' },
  { id: 'comment', label: 'Comments' },
  { id: 'follow', label: 'Follows' },
  { id: 'mention', label: 'Mentions' },
  { id: 'opportunity', label: 'Opportunities' },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    unreadNotificationsCount,
  } = useDevCircle();

  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredNotifications = useMemo(() => {
    if (selectedFilter === 'all') return notifications;
    return notifications.filter((n) => n.type === (selectedFilter as NotificationType));
  }, [notifications, selectedFilter]);

  const getNotifIcon = (type: NotificationType) => {
    switch (type) {
      case 'like':
        return <Ionicons name="heart" size={14} color="#EF4444" />;
      case 'comment':
        return <Ionicons name="chatbubble" size={13} color="#38BDF8" />;
      case 'follow':
        return <Ionicons name="person-add" size={13} color="#19E68C" />;
      case 'mention':
        return <Ionicons name="at" size={14} color="#A855F7" />;
      case 'opportunity':
        return <Ionicons name="calendar" size={14} color="#F59E0B" />;
      default:
        return <Ionicons name="notifications" size={14} color="#19E68C" />;
    }
  };

  const handleNotificationPress = (item: Notification) => {
    markNotificationRead(item.id);

    if (item.targetType === 'post' && item.targetId) {
      router.push(`/post/${item.targetId}`);
    } else if (item.targetType === 'profile' && item.actor.username) {
      router.push(`/profile/${item.actor.username}`);
    } else if (item.targetType === 'project') {
      router.push('/projects');
    } else if (item.targetType === 'opportunity') {
      router.push('/events');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadNotificationsCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unreadNotificationsCount} new</Text>
            </View>
          )}
        </View>

        <View style={styles.headerRight}>
          {unreadNotificationsCount > 0 && (
            <TouchableOpacity
              onPress={markAllNotificationsRead}
              activeOpacity={0.7}
              style={styles.markAllBtn}>
              <Text style={styles.markAllText}>Mark all as read</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={() => router.push('/settings')}
            style={styles.settingsIconBtn}>
            <Ionicons name="settings-outline" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Tabs */}
      <FilterPills
        items={NOTIF_FILTERS}
        selectedId={selectedFilter}
        onSelect={setSelectedFilter}
      />

      {/* Notification List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notif) => (
            <TouchableOpacity
              key={notif.id}
              style={[
                styles.notifCard,
                !notif.isRead && styles.notifCardUnread,
              ]}
              activeOpacity={0.75}
              onPress={() => handleNotificationPress(notif)}>
              <View style={styles.avatarWrap}>
                <Avatar
                  url={notif.actor.avatar}
                  name={notif.actor.name}
                  size={42}
                  isVerified={notif.actor.isVerified}
                />
                <View style={styles.typeBadgeWrapper}>
                  {getNotifIcon(notif.type)}
                </View>
              </View>

              <View style={styles.notifContent}>
                <Text style={styles.notifText}>
                  <Text style={styles.actorName}>{notif.actor.name}</Text>{' '}
                  {notif.message}
                </Text>
                <Text style={styles.notifTime}>{notif.createdAt}</Text>
              </View>

              {!notif.isRead && <View style={styles.blueDot} />}
            </TouchableOpacity>
          ))
        ) : (
          <EmptyState
            icon="notifications-off-outline"
            title="All Caught Up!"
            description="You don't have any notifications in this section right now."
          />
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  unreadBadge: {
    backgroundColor: 'rgba(25, 230, 140, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(25, 230, 140, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  unreadBadgeText: {
    fontSize: 11,
    color: '#19E68C',
    fontWeight: '700',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  markAllBtn: {
    paddingVertical: 4,
  },
  markAllText: {
    fontSize: 12,
    color: '#19E68C',
    fontWeight: '600',
  },
  settingsIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#132235',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingVertical: 8,
    paddingBottom: 32,
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#121F30',
    backgroundColor: '#07111F',
  },
  notifCardUnread: {
    backgroundColor: '#0E1A29',
  },
  avatarWrap: {
    position: 'relative',
    marginRight: 12,
  },
  typeBadgeWrapper: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#182536',
    borderWidth: 1.5,
    borderColor: '#07111F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifContent: {
    flex: 1,
    marginRight: 8,
  },
  notifText: {
    fontSize: 13.5,
    color: '#CBD5E1',
    lineHeight: 18,
  },
  actorName: {
    fontWeight: '700',
    color: '#F8FAFC',
  },
  notifTime: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
  },
  blueDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#19E68C',
  },
});
