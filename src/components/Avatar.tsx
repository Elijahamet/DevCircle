import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useDevCircle } from '@/context/DevCircleContext';

interface AvatarProps {
  url?: string;
  name?: string;
  size?: number;
  isVerified?: boolean;
  onPress?: () => void;
  showBorder?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({
  url,
  name = 'Developer',
  size = 44,
  isVerified = false,
  onPress,
  showBorder = false,
}) => {
  const { colors } = useDevCircle();
  const [imageError, setImageError] = useState(false);

  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return fullName.slice(0, 2).toUpperCase();
  };

  const badgeSize = Math.max(14, Math.round(size * 0.32));

  const content = (
    <View style={[styles.wrapper, { width: size, height: size }]}>
      {url && !imageError ? (
        <Image
          source={{ uri: url }}
          style={[
            styles.image,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: showBorder ? 2 : 0,
              borderColor: colors.primary,
            },
          ]}
          contentFit="cover"
          transition={200}
          onError={() => setImageError(true)}
        />
      ) : (
        <View
          style={[
            styles.fallback,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: showBorder ? 2 : 0,
              borderColor: colors.primary,
              backgroundColor: colors.inputBackground,
            },
          ]}>
          <Text
            style={[
              styles.initials,
              {
                fontSize: Math.max(11, Math.round(size * 0.38)),
                color: colors.text,
              },
            ]}>
            {getInitials(name)}
          </Text>
        </View>
      )}

      {isVerified && (
        <View
          style={[
            styles.verifiedBadge,
            {
              width: badgeSize,
              height: badgeSize,
              borderRadius: badgeSize / 2,
              bottom: 0,
              right: 0,
              backgroundColor: colors.primary,
              borderColor: colors.background,
            },
          ]}>
          <Ionicons name="checkmark" size={Math.round(badgeSize * 0.75)} color="#07111F" />
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  image: {
    backgroundColor: '#182536',
  },
  fallback: {
    backgroundColor: '#1E2F46',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#19E68C',
    fontWeight: '700',
  },
  verifiedBadge: {
    position: 'absolute',
    backgroundColor: '#19E68C',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#07111F',
  },
});
