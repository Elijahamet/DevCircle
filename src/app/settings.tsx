import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Radius, Spacing } from '@/constants/theme';
import { DevCircleLogo } from '@/components/DevCircleLogo';
import { useDevCircle } from '@/context/DevCircleContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { logout, currentUser, themeMode, toggleTheme, setTheme, colors } = useDevCircle();

  const [pushNotifs, setPushNotifs] = useState(true);
  const [mentionNotifs, setMentionNotifs] = useState(true);
  const [oppNotifs, setOppNotifs] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of DevCircle? You will be returned to the introduction landing page.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/onboarding');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.backBtn, { backgroundColor: colors.iconButtonBg }]}
          onPress={() => router.back()}
          activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Appearance Group - Theme Toggle */}
        <Text style={styles.groupLabel}>APPEARANCE & THEME</Text>
        <View style={[styles.groupCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <View style={[styles.itemRow, { borderBottomColor: colors.border }]}>
            <View style={[styles.itemIconWrap, { backgroundColor: colors.backgroundSecondary }]}>
              <Ionicons
                name={themeMode === 'dark' ? 'moon' : 'sunny'}
                size={18}
                color={themeMode === 'dark' ? '#19E68C' : '#F59E0B'}
              />
            </View>
            <View style={styles.itemTextWrap}>
              <Text style={[styles.itemTitle, { color: colors.text }]}>
                {themeMode === 'dark' ? 'Dark Mode (Deep Navy)' : 'White / Light Mode'}
              </Text>
              <Text style={styles.itemSubtitle}>
                {themeMode === 'dark'
                  ? 'Dark background with electric green highlights'
                  : 'Crisp white surfaces with emerald green accents'}
              </Text>
            </View>
            <Switch
              value={themeMode === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: '#CBD5E1', true: '#19E68C' }}
              thumbColor={themeMode === 'dark' ? '#07111F' : '#FFFFFF'}
            />
          </View>

          {/* Explicit Choice Buttons */}
          <View style={styles.themeSelectorRow}>
            <TouchableOpacity
              style={[
                styles.themeBtn,
                themeMode === 'dark' && styles.themeBtnActive,
                { borderColor: themeMode === 'dark' ? '#19E68C' : colors.border },
              ]}
              onPress={() => setTheme('dark')}>
              <Ionicons name="moon" size={16} color={themeMode === 'dark' ? '#19E68C' : '#94A3B8'} />
              <Text style={[styles.themeBtnText, themeMode === 'dark' && { color: '#19E68C', fontWeight: '700' }]}>
                Dark Navy
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.themeBtn,
                themeMode === 'light' && styles.themeBtnActiveLight,
                { borderColor: themeMode === 'light' ? '#059669' : colors.border },
              ]}
              onPress={() => setTheme('light')}>
              <Ionicons name="sunny" size={16} color={themeMode === 'light' ? '#059669' : '#94A3B8'} />
              <Text style={[styles.themeBtnText, themeMode === 'light' && { color: '#059669', fontWeight: '700' }]}>
                Clean White
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Account Group */}
        <Text style={styles.groupLabel}>ACCOUNT & PROFILE</Text>
        <View style={[styles.groupCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <TouchableOpacity
            style={[styles.itemRow, { borderBottomColor: colors.border }]}
            activeOpacity={0.7}
            onPress={() => router.push('/edit-profile')}>
            <View style={[styles.itemIconWrap, { backgroundColor: colors.backgroundSecondary }]}>
              <Ionicons name="person-outline" size={18} color="#19E68C" />
            </View>
            <View style={styles.itemTextWrap}>
              <Text style={[styles.itemTitle, { color: colors.text }]}>Edit Developer Profile</Text>
              <Text style={styles.itemSubtitle}>@{currentUser.username}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#64748B" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.itemRow, { borderBottomWidth: 0 }]}
            activeOpacity={0.7}
            onPress={() => router.push('/bookmarks')}>
            <View style={[styles.itemIconWrap, { backgroundColor: colors.backgroundSecondary }]}>
              <Ionicons name="bookmark-outline" size={18} color="#38BDF8" />
            </View>
            <View style={styles.itemTextWrap}>
              <Text style={[styles.itemTitle, { color: colors.text }]}>Saved Bookmarks</Text>
              <Text style={styles.itemSubtitle}>View your saved code and discussions</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* Notifications Group */}
        <Text style={styles.groupLabel}>NOTIFICATIONS PREFERENCES</Text>
        <View style={[styles.groupCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <View style={[styles.switchRow, { borderBottomColor: colors.border }]}>
            <View style={[styles.itemIconWrap, { backgroundColor: colors.backgroundSecondary }]}>
              <Ionicons name="notifications-outline" size={18} color="#F59E0B" />
            </View>
            <View style={styles.itemTextWrap}>
              <Text style={[styles.itemTitle, { color: colors.text }]}>Push Notifications</Text>
              <Text style={styles.itemSubtitle}>Receive alerts on replies and likes</Text>
            </View>
            <Switch
              value={pushNotifs}
              onValueChange={setPushNotifs}
              trackColor={{ false: '#CBD5E1', true: '#19E68C' }}
              thumbColor={pushNotifs ? '#19E68C' : '#94A3B8'}
            />
          </View>

          <View style={[styles.switchRow, { borderBottomColor: colors.border }]}>
            <View style={[styles.itemIconWrap, { backgroundColor: colors.backgroundSecondary }]}>
              <Ionicons name="at-outline" size={18} color="#A855F7" />
            </View>
            <View style={styles.itemTextWrap}>
              <Text style={[styles.itemTitle, { color: colors.text }]}>Mentions & Tags</Text>
              <Text style={styles.itemSubtitle}>Notify when someone tags you in code</Text>
            </View>
            <Switch
              value={mentionNotifs}
              onValueChange={setMentionNotifs}
              trackColor={{ false: '#CBD5E1', true: '#19E68C' }}
              thumbColor={mentionNotifs ? '#19E68C' : '#94A3B8'}
            />
          </View>

          <View style={[styles.switchRow, { borderBottomWidth: 0 }]}>
            <View style={[styles.itemIconWrap, { backgroundColor: colors.backgroundSecondary }]}>
              <Ionicons name="calendar-outline" size={18} color="#10B981" />
            </View>
            <View style={styles.itemTextWrap}>
              <Text style={[styles.itemTitle, { color: colors.text }]}>Ghana Tech Opportunities</Text>
              <Text style={styles.itemSubtitle}>Alerts for hackathons and tech jobs</Text>
            </View>
            <Switch
              value={oppNotifs}
              onValueChange={setOppNotifs}
              trackColor={{ false: '#CBD5E1', true: '#19E68C' }}
              thumbColor={oppNotifs ? '#19E68C' : '#94A3B8'}
            />
          </View>
        </View>

        {/* Privacy Group */}
        <Text style={styles.groupLabel}>PRIVACY & COMMUNITY</Text>
        <View style={[styles.groupCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <View style={[styles.switchRow, { borderBottomColor: colors.border }]}>
            <View style={[styles.itemIconWrap, { backgroundColor: colors.backgroundSecondary }]}>
              <Ionicons name="eye-outline" size={18} color="#38BDF8" />
            </View>
            <View style={styles.itemTextWrap}>
              <Text style={[styles.itemTitle, { color: colors.text }]}>Public Profile Visibility</Text>
              <Text style={styles.itemSubtitle}>Allow Ghanaian recruiters and developers to find you</Text>
            </View>
            <Switch
              value={publicProfile}
              onValueChange={setPublicProfile}
              trackColor={{ false: '#CBD5E1', true: '#19E68C' }}
              thumbColor={publicProfile ? '#19E68C' : '#94A3B8'}
            />
          </View>

          <TouchableOpacity
            style={[styles.itemRow, { borderBottomWidth: 0 }]}
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert('Blocked Users', 'You currently have zero blocked members.')
            }>
            <View style={[styles.itemIconWrap, { backgroundColor: colors.backgroundSecondary }]}>
              <Ionicons name="shield-outline" size={18} color="#EF4444" />
            </View>
            <View style={styles.itemTextWrap}>
              <Text style={[styles.itemTitle, { color: colors.text }]}>Blocked Users</Text>
              <Text style={styles.itemSubtitle}>Manage muted or blocked accounts</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* Help & Support Group */}
        <Text style={styles.groupLabel}>SUPPORT & COMMUNITY</Text>
        <View style={[styles.groupCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <TouchableOpacity
            style={[styles.itemRow, { borderBottomColor: colors.border }]}
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert(
                'Help & Support',
                'Need assistance? Reach out to the DevCircle Community team at support@devcircle.gh or on our community Slack.'
              )
            }>
            <View style={[styles.itemIconWrap, { backgroundColor: colors.backgroundSecondary }]}>
              <Ionicons name="help-buoy-outline" size={18} color="#19E68C" />
            </View>
            <View style={styles.itemTextWrap}>
              <Text style={[styles.itemTitle, { color: colors.text }]}>Help & Support</Text>
              <Text style={styles.itemSubtitle}>Guidelines, FAQ, and assistance</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#64748B" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.itemRow, { borderBottomWidth: 0 }]}
            activeOpacity={0.7}
            onPress={() =>
              Alert.alert(
                'Community Guidelines',
                'DevCircle Ghana is committed to fostering an inclusive, respectful, and empowering space for all developers.'
              )
            }>
            <View style={[styles.itemIconWrap, { backgroundColor: colors.backgroundSecondary }]}>
              <Ionicons name="document-text-outline" size={18} color="#38BDF8" />
            </View>
            <View style={styles.itemTextWrap}>
              <Text style={[styles.itemTitle, { color: colors.text }]}>Code of Conduct</Text>
              <Text style={styles.itemSubtitle}>Community guidelines & developer etiquette</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* About App */}
        <View style={styles.aboutBox}>
          <DevCircleLogo size="sm" showText={true} />
          <Text style={styles.aboutVersion}>DevCircle Mobile v1.0.0 (Release Build)</Text>
          <Text style={[styles.aboutTagline, { color: colors.primary }]}>Connect. Learn. Share. Grow.</Text>
          <Text style={styles.aboutCopyright}>
            Empowering the Ghanaian Software Developer Community 🇬🇭
          </Text>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          activeOpacity={0.75}
          onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={18} color="#EF4444" />
          <Text style={styles.logoutText}>Sign Out to Landing Page</Text>
        </TouchableOpacity>
      </ScrollView>
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
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 40,
  },
  groupLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginTop: 18,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  groupCard: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
  },
  themeSelectorRow: {
    flexDirection: 'row',
    gap: 10,
    padding: 12,
  },
  themeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    backgroundColor: '#07111F',
  },
  themeBtnActive: {
    backgroundColor: '#0F2236',
  },
  themeBtnActiveLight: {
    backgroundColor: '#F1F5F9',
  },
  themeBtnText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600',
  },
  itemIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  itemTextWrap: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  itemSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  aboutBox: {
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 16,
    padding: Spacing.md,
    gap: 4,
  },
  aboutVersion: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 8,
  },
  aboutTagline: {
    fontSize: 12,
    fontWeight: '600',
  },
  aboutCopyright: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
    borderRadius: Radius.md,
    paddingVertical: 12,
    marginTop: 8,
  },
  logoutText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '700',
  },
});
