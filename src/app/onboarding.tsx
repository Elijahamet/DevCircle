import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Radius, Spacing } from '@/constants/theme';
import { DevCircleLogo } from '@/components/DevCircleLogo';
import { Button } from '@/components/Button';
import { useDevCircle } from '@/context/DevCircleContext';

const { width } = Dimensions.get('window');

interface Slide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  accent: string;
  points: { icon: keyof typeof Ionicons.glyphMap; text: string }[];
}

const SLIDES: Slide[] = [
  {
    id: '1',
    badge: 'GHANA DEVELOPER NETWORK',
    title: 'Connect with Ghanaian Developers',
    subtitle:
      'Join thousands of software engineers, designers, and tech students from Accra, Kumasi, Takoradi, and the diaspora.',
    icon: 'people',
    accent: '#19E68C',
    points: [
      { icon: 'shield-checkmark', text: 'Verified Ghanaian tech engineers & mentors' },
      { icon: 'chatbubbles', text: 'Active technical debates & architecture advice' },
      { icon: 'location', text: 'Local tech hubs (MEST, Ashesi, KNUST, UG)' },
    ],
  },
  {
    id: '2',
    badge: 'SHOWCASE & CODE SNIPPETS',
    title: 'Share What You Build',
    subtitle:
      'Showcase open-source projects, post syntax-highlighted code snippets, and solve real production problems.',
    icon: 'code-slash',
    accent: '#38BDF8',
    points: [
      { icon: 'terminal', text: 'Full code editor with TypeScript, Python & Go' },
      { icon: 'rocket', text: 'Showcase repositories with live demos & GitHub' },
      { icon: 'card', text: 'Fintech insights: Paystack, MoMo & Hubtel webhooks' },
    ],
  },
  {
    id: '3',
    badge: 'CAREERS & EVENTS',
    title: 'Discover Tech Opportunities',
    subtitle:
      'Find local Ghanaian hackathons, tech meetups, internships, and high-paying remote roles with global startups.',
    icon: 'trending-up',
    accent: '#A855F7',
    points: [
      { icon: 'calendar', text: 'Accra DevFest, React Accra & Python Ghana' },
      { icon: 'briefcase', text: 'Curated developer jobs and tech internships' },
      { icon: 'school', text: 'Fellowships, mentorships & student communities' },
    ],
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { completeOnboarding, colors, themeMode, toggleTheme } = useDevCircle();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<any>(null);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      scrollRef.current?.scrollTo({
        x: (currentIndex + 1) * width,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      finishOnboarding();
    }
  };

  const finishOnboarding = () => {
    completeOnboarding();
    router.replace('/(tabs)');
  };

  const handleSkip = () => {
    completeOnboarding();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header with Logo, Theme Toggle, and Skip Button */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <DevCircleLogo size="sm" showText={true} />

        <View style={styles.headerRight}>
          {/* Dark / Light Mode Toggle */}
          <TouchableOpacity
            onPress={toggleTheme}
            activeOpacity={0.7}
            style={[
              styles.themeToggleBtn,
              { backgroundColor: colors.iconButtonBg, borderColor: colors.iconButtonBorder },
            ]}>
            <Ionicons
              name={themeMode === 'dark' ? 'sunny-outline' : 'moon-outline'}
              size={18}
              color={themeMode === 'dark' ? '#F59E0B' : colors.text}
            />
          </TouchableOpacity>

          {/* Skip Button */}
          <TouchableOpacity onPress={handleSkip} activeOpacity={0.7} style={styles.skipBtn}>
            <Text style={[styles.skipText, { color: colors.textSecondary }]}>Skip</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 3 Intro Slides */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        style={styles.slidesContainer}>
        {SLIDES.map((slide) => (
          <View key={slide.id} style={[styles.slide, { width }]}>
            {/* Visual Hero Card */}
            <View
              style={[
                styles.illustrationCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.cardBorder,
                },
              ]}>
              <View
                style={[
                  styles.outerCircle,
                  { borderColor: `${slide.accent}35`, backgroundColor: `${slide.accent}0A` },
                ]}>
                <View
                  style={[
                    styles.innerCircle,
                    { borderColor: `${slide.accent}70`, backgroundColor: `${slide.accent}15` },
                  ]}>
                  <Ionicons name={slide.icon} size={64} color={slide.accent} />
                </View>
              </View>

              {/* Badge Pill */}
              <View
                style={[
                  styles.badgePill,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.border,
                  },
                ]}>
                <Ionicons name="sparkles" size={12} color={slide.accent} />
                <Text style={[styles.badgePillText, { color: slide.accent }]}>
                  {slide.badge}
                </Text>
              </View>
            </View>

            {/* Typography */}
            <View style={styles.textContainer}>
              <Text style={[styles.title, { color: colors.text }]}>{slide.title}</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                {slide.subtitle}
              </Text>
            </View>

            {/* Feature Points Checkmarks */}
            <View
              style={[
                styles.pointsCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.cardBorder,
                },
              ]}>
              {slide.points.map((pt, pIdx) => (
                <View key={pIdx} style={styles.pointRow}>
                  <View
                    style={[
                      styles.pointIconBg,
                      { backgroundColor: `${slide.accent}15` },
                    ]}>
                    <Ionicons name={pt.icon} size={14} color={slide.accent} />
                  </View>
                  <Text style={[styles.pointText, { color: colors.text }]}>{pt.text}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        {/* Pagination Dots */}
        <View style={styles.paginationRow}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { backgroundColor: colors.border },
                currentIndex === i && [styles.activeDot, { backgroundColor: colors.primary }],
              ]}
            />
          ))}
        </View>

        {/* Action Button: Next or Get Started */}
        <View style={styles.buttonContainer}>
          <Button
            title={currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
            onPress={handleNext}
            variant="primary"
            size="lg"
            fullWidth={true}
            rightIcon={
              <Ionicons
                name={currentIndex === SLIDES.length - 1 ? 'rocket-outline' : 'arrow-forward'}
                size={18}
                color={themeMode === 'dark' ? '#07111F' : '#FFFFFF'}
              />
            }
          />
        </View>

        {/* Direct Sign In option */}
        <View style={styles.signInRow}>
          <Text style={[styles.haveAccountText, { color: colors.textSecondary }]}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => router.push('/login')} activeOpacity={0.7}>
            <Text style={[styles.signInLink, { color: colors.primary }]}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  themeToggleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  slidesContainer: {
    flex: 1,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  illustrationCard: {
    width: '100%',
    height: 220,
    borderRadius: Radius.xl,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  outerCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: 105,
    height: 105,
    borderRadius: 52.5,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgePill: {
    position: 'absolute',
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  badgePillText: {
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 23,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 29,
  },
  subtitle: {
    fontSize: 13.5,
    textAlign: 'center',
    lineHeight: 20,
  },
  pointsCard: {
    width: '100%',
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    gap: 8,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pointIconBg: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointText: {
    fontSize: 12.5,
    fontWeight: '500',
    flex: 1,
  },
  bottomControls: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
    alignItems: 'center',
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 24,
    height: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    width: '100%',
  },
  signInRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  haveAccountText: {
    fontSize: 13.5,
  },
  signInLink: {
    fontSize: 13.5,
    fontWeight: '700',
  },
});
