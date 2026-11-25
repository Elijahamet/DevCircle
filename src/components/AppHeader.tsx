import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Spacing } from '@/constants/theme';
import { DevCircleLogo } from './DevCircleLogo';
import { Avatar } from './Avatar';
import { useDevCircle } from '@/context/DevCircleContext';

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  showBack = false,
  rightAction,
}) => {
  const router = useRouter();
  const { currentUser, themeMode, toggleTheme, colors } = useDevCircle();

  return (
    <View style={[styles.header, { backgroundColor: colors.headerBg, borderBottomColor: colors.headerBorder }]}>
      <View style={styles.leftContainer}>
        {showBack ? (
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.iconButtonBg, borderColor: colors.iconButtonBorder }]}
            activeOpacity={0.7}
            onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push('/(tabs)')}>
            <DevCircleLogo size="sm" showText={true} textSize={20} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.rightContainer}>
        {rightAction ? (
          rightAction
        ) : (
          <>
            {/* Theme Toggle Button */}
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: colors.iconButtonBg, borderColor: colors.iconButtonBorder }]}
              activeOpacity={0.7}
              onPress={toggleTheme}>
              <Ionicons
                name={themeMode === 'dark' ? 'sunny-outline' : 'moon-outline'}
                size={19}
                color={themeMode === 'dark' ? '#F59E0B' : colors.text}
              />
            </TouchableOpacity>

            {/* Search Button */}
            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: colors.iconButtonBg, borderColor: colors.iconButtonBorder }]}
              activeOpacity={0.7}
              onPress={() => router.push('/search')}>
              <Ionicons name="search-outline" size={20} color={colors.text} />
            </TouchableOpacity>

            {/* User Avatar */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push('/(tabs)/profile')}
              style={styles.avatarWrapper}>
              <Avatar
                url={currentUser.avatar}
                name={currentUser.name}
                size={34}
                showBorder={true}
              />
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarWrapper: {
    marginLeft: 2,
  },
});
