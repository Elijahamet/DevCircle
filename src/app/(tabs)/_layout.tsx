import React, { useEffect, useState } from 'react';
import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDevCircle } from '@/context/DevCircleContext';

const AnimatedCreateIcon: React.FC<{ primaryColor: string }> = ({ primaryColor }) => {
  const isNative = Platform.OS !== 'web';
  const [pulseAnim] = useState(() => new Animated.Value(1));
  const [glowScale] = useState(() => new Animated.Value(1));
  const [glowOpacity] = useState(() => new Animated.Value(0.4));

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.06,
          duration: 1200,
          useNativeDriver: isNative,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: isNative,
        }),
      ])
    );

    const glowLoop = Animated.loop(
      Animated.parallel([
        Animated.timing(glowScale, {
          toValue: 1.5,
          duration: 1800,
          useNativeDriver: isNative,
        }),
        Animated.sequence([
          Animated.timing(glowOpacity, {
            toValue: 0.55,
            duration: 600,
            useNativeDriver: isNative,
          }),
          Animated.timing(glowOpacity, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: isNative,
          }),
        ]),
      ])
    );

    pulseLoop.start();
    glowLoop.start();

    return () => {
      pulseLoop.stop();
      glowLoop.stop();
    };
  }, [pulseAnim, glowScale, glowOpacity, isNative]);

  return (
    <View style={styles.createIconWrapper}>
      {/* Expanding Pulsing Aura */}
      <Animated.View
        style={[
          styles.glowAura,
          {
            borderColor: primaryColor,
            opacity: glowOpacity,
            transform: [{ scale: glowScale }],
          },
        ]}
      />

      {/* Main Animated Circle */}
      <Animated.View
        style={[
          styles.createIconCircle,
          {
            backgroundColor: primaryColor,
            shadowColor: primaryColor,
            transform: [{ scale: pulseAnim }],
          },
        ]}>
        <Ionicons name="add" size={25} color="#07111F" />
      </Animated.View>
    </View>
  );
};

export default function TabLayout() {
  const { unreadNotificationsCount, colors } = useDevCircle();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabBarBg,
          borderTopWidth: 1,
          borderTopColor: colors.tabBarBorder,
          height: Platform.OS === 'ios' ? 84 : 64,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={22}
              color={color as string}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'compass' : 'compass-outline'}
              size={23}
              color={color as string}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarShowLabel: false,
          tabBarIcon: () => <AnimatedCreateIcon primaryColor={colors.primary} />,
        }}
      />

      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Alerts',
          tabBarBadge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: colors.primary,
            color: '#07111F',
            fontSize: 10,
            fontWeight: '700',
          },
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'notifications' : 'notifications-outline'}
              size={22}
              color={color as string}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={22}
              color={color as string}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  createIconWrapper: {
    top: -8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glowAura: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
  },
  createIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 4,
  },
});
