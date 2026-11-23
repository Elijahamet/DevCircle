import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Radius, Spacing } from '@/constants/theme';
import { ProjectCard } from '@/components/ProjectCard';
import { FilterPills, FilterItem } from '@/components/FilterPills';
import { EmptyState } from '@/components/EmptyState';
import { useDevCircle } from '@/context/DevCircleContext';

const PROJECT_CATEGORIES: FilterItem[] = [
  { id: 'all', label: 'All Projects' },
  { id: 'Mobile Development', label: 'Mobile' },
  { id: 'Backend & Security', label: 'Backend' },
  { id: 'UI/UX & Frontend', label: 'UI/UX & Web' },
  { id: 'AI & Data Science', label: 'AI & ML' },
];

export default function ProjectsScreen() {
  const router = useRouter();
  const { projects, colors } = useDevCircle();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'all') return projects;
    return projects.filter((p) => p.category === selectedCategory);
  }, [projects, selectedCategory]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Project Showcase</Text>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/(tabs)/create')}
          activeOpacity={0.7}>
          <Ionicons name="add" size={20} color={colors.textInverse} />
        </TouchableOpacity>
      </View>

      {/* Banner / Description */}
      <View
        style={[
          styles.introCard,
          {
            backgroundColor: colors.card,
            borderColor: colors.cardBorder,
          },
        ]}>
        <View style={styles.introBadge}>
          <Ionicons name="rocket-outline" size={13} color={colors.primary} />
          <Text style={[styles.introBadgeText, { color: colors.primary }]}>MADE IN GHANA 🇬🇭</Text>
        </View>
        <Text style={[styles.introTitle, { color: colors.text }]}>Showcase Your Engineering Work</Text>
        <Text style={[styles.introText, { color: colors.textSecondary }]}>
          Discover open source applications, libraries, APIs and mobile products built by Ghanaian developers.
        </Text>
      </View>

      {/* Categories */}
      <FilterPills
        items={PROJECT_CATEGORIES}
        selectedId={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* Projects List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <EmptyState
            icon="rocket-outline"
            title="No Projects in this Category"
            description="Be the first to share your project with the DevCircle Ghana community!"
            actionTitle="Share a Project"
            onAction={() => router.push('/(tabs)/create')}
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
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#132235',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#19E68C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  introCard: {
    backgroundColor: '#0F2133',
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginTop: 12,
    marginBottom: 6,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#1D324B',
  },
  introBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  introBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#19E68C',
    letterSpacing: 0.8,
  },
  introTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  introText: {
    fontSize: 12.5,
    color: '#94A3B8',
    lineHeight: 17,
  },
  scrollContent: {
    paddingVertical: 10,
    paddingBottom: 32,
  },
});
