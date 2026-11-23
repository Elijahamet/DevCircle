import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { Button } from '@/components/Button';
import { PostCard } from '@/components/PostCard';
import { useDevCircle } from '@/context/DevCircleContext';
import { PostType, PostCategory, CodeSnippet, Post } from '@/types';

const POST_TYPES: { type: PostType; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { type: 'discussion', label: 'Discussion', icon: 'chatbubbles-outline' },
  { type: 'question', label: 'Question', icon: 'help-circle-outline' },
  { type: 'code', label: 'Code Snippet', icon: 'code-slash-outline' },
  { type: 'project', label: 'Showcase Project', icon: 'rocket-outline' },
  { type: 'resource', label: 'Resource', icon: 'bookmark-outline' },
];

const CATEGORIES: { id: PostCategory; label: string }[] = [
  { id: 'ghana_tech', label: 'Ghana Tech' },
  { id: 'web_dev', label: 'Web Development' },
  { id: 'mobile_dev', label: 'Mobile Development' },
  { id: 'ai_ml', label: 'AI & ML' },
  { id: 'career_advice', label: 'Career Advice' },
];

const CODE_LANGUAGES: ('typescript' | 'javascript' | 'python' | 'go' | 'java')[] = [
  'typescript',
  'javascript',
  'python',
  'go',
  'java',
];

export default function CreatePostScreen() {
  const router = useRouter();
  const { currentUser, createPost } = useDevCircle();

  const [selectedType, setSelectedType] = useState<PostType>('discussion');
  const [selectedCategory, setSelectedCategory] = useState<PostCategory>('ghana_tech');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['GhanaTech']);
  const [imageUrl, setImageUrl] = useState('');

  // Code snippet state
  const [codeLanguage, setCodeLanguage] = useState<'typescript' | 'javascript' | 'python' | 'go' | 'java'>('typescript');
  const [codeContent, setCodeContent] = useState('');
  const [codeFileName, setCodeFileName] = useState('');

  // Project meta state
  const [projectName, setProjectName] = useState('');
  const [projectRepo, setProjectRepo] = useState('');
  const [projectDemo, setProjectDemo] = useState('');
  const [projectTechStack, setProjectTechStack] = useState('React Native, TypeScript');

  // Preview Modal
  const [showPreview, setShowPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleAddTag = () => {
    const clean = tagInput.trim().replace(/^#/, '');
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handlePublish = () => {
    if (!content.trim()) {
      Alert.alert('Required Content', 'Please provide post content before publishing.');
      return;
    }

    if (selectedType === 'code' && !codeContent.trim()) {
      Alert.alert('Code Required', 'Please enter your code snippet or change the post type.');
      return;
    }

    setSubmitting(true);

    let snippet: CodeSnippet | undefined = undefined;
    if (selectedType === 'code' && codeContent.trim()) {
      snippet = {
        language: codeLanguage,
        code: codeContent.trim(),
        fileName: codeFileName.trim() || `snippet.${codeLanguage === 'typescript' ? 'ts' : codeLanguage === 'python' ? 'py' : 'js'}`,
      };
    }

    let projectMeta = undefined;
    if (selectedType === 'project' && projectName.trim()) {
      projectMeta = {
        name: projectName.trim(),
        githubUrl: projectRepo.trim() || undefined,
        demoUrl: projectDemo.trim() || undefined,
        techStack: projectTechStack.split(',').map((s) => s.trim()).filter(Boolean),
      };
    }

    setTimeout(() => {
      createPost({
        type: selectedType,
        category: selectedCategory,
        title: title.trim() || undefined,
        content: content.trim(),
        codeSnippet: snippet,
        imageUrl: imageUrl.trim() || undefined,
        projectMeta,
        tags,
      });

      setSubmitting(false);
      Alert.alert('Published!', 'Your post is now live in the DevCircle feed.', [
        {
          text: 'View Feed',
          onPress: () => router.push('/(tabs)'),
        },
      ]);
    }, 400);
  };

  // Construct temp preview post object
  const previewPost: Post = {
    id: 'preview_temp',
    author: currentUser,
    type: selectedType,
    category: selectedCategory,
    title: title.trim() || undefined,
    content: content.trim() || 'Post preview content will appear here...',
    codeSnippet:
      selectedType === 'code' && codeContent.trim()
        ? {
            language: codeLanguage,
            code: codeContent.trim(),
            fileName: codeFileName.trim() || `snippet.${codeLanguage}`,
          }
        : undefined,
    imageUrl: imageUrl.trim() || undefined,
    projectMeta:
      selectedType === 'project' && projectName.trim()
        ? {
            name: projectName.trim(),
            githubUrl: projectRepo.trim(),
            demoUrl: projectDemo.trim(),
            techStack: projectTechStack.split(',').map((s) => s.trim()).filter(Boolean),
          }
        : undefined,
    tags,
    likesCount: 0,
    isLiked: false,
    commentsCount: 0,
    bookmarksCount: 0,
    isBookmarked: false,
    createdAt: 'Preview',
    comments: [],
    isAuthorSelf: true,
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Create Post</Text>

        <View style={styles.headerRightActions}>
          <TouchableOpacity
            style={styles.previewIconBtn}
            onPress={() => setShowPreview(true)}
            activeOpacity={0.7}>
            <Ionicons name="eye-outline" size={18} color="#19E68C" />
            <Text style={styles.previewText}>Preview</Text>
          </TouchableOpacity>

          <Button
            title="Publish"
            onPress={handlePublish}
            variant="primary"
            size="sm"
            loading={submitting}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        {/* Post Type Selector */}
        <Text style={styles.sectionLabel}>SELECT POST TYPE</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.typesRow}>
          {POST_TYPES.map((pt) => {
            const isSelected = selectedType === pt.type;
            return (
              <TouchableOpacity
                key={pt.type}
                style={[styles.typePill, isSelected && styles.typePillActive]}
                activeOpacity={0.75}
                onPress={() => setSelectedType(pt.type)}>
                <Ionicons
                  name={pt.icon}
                  size={15}
                  color={isSelected ? '#07111F' : '#94A3B8'}
                />
                <Text
                  style={[
                    styles.typePillText,
                    isSelected && styles.typePillTextActive,
                  ]}>
                  {pt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Category Selector */}
        <Text style={styles.sectionLabel}>CATEGORY</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[styles.catPill, isSelected && styles.catPillActive]}
                activeOpacity={0.75}
                onPress={() => setSelectedCategory(cat.id)}>
                <Text
                  style={[
                    styles.catPillText,
                    isSelected && styles.catPillTextActive,
                  ]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Title Input */}
        <Text style={styles.sectionLabel}>TITLE (OPTIONAL)</Text>
        <TextInput
          style={styles.titleInput}
          placeholder="Give your discussion or showcase a title..."
          placeholderTextColor="#64748B"
          value={title}
          onChangeText={setTitle}
        />

        {/* Main Content Body */}
        <Text style={styles.sectionLabel}>CONTENT</Text>
        <TextInput
          style={styles.contentInput}
          placeholder="Share your technical question, insight, or announcement with Ghanaian developers..."
          placeholderTextColor="#64748B"
          value={content}
          onChangeText={setContent}
          multiline={true}
          textAlignVertical="top"
        />

        {/* Code Snippet Editor (if selected type is code) */}
        {selectedType === 'code' && (
          <View style={styles.codeEditorContainer}>
            <View style={styles.codeEditorHeader}>
              <View style={styles.codeHeaderLeft}>
                <Ionicons name="code-slash" size={16} color="#38BDF8" />
                <Text style={styles.codeEditorTitle}>Code Editor</Text>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.langList}>
                {CODE_LANGUAGES.map((lang) => (
                  <TouchableOpacity
                    key={lang}
                    onPress={() => setCodeLanguage(lang)}
                    style={[
                      styles.langBtn,
                      codeLanguage === lang && styles.langBtnActive,
                    ]}>
                    <Text
                      style={[
                        styles.langBtnText,
                        codeLanguage === lang && styles.langBtnTextActive,
                      ]}>
                      {lang.toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <TextInput
              style={styles.codeFileNameInput}
              placeholder="File name (e.g. webhookHandler.ts)"
              placeholderTextColor="#64748B"
              value={codeFileName}
              onChangeText={setCodeFileName}
            />

            <TextInput
              style={styles.codeContentInput}
              placeholder="// Paste or write your code snippet here..."
              placeholderTextColor="#475569"
              value={codeContent}
              onChangeText={setCodeContent}
              multiline={true}
              textAlignVertical="top"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        )}

        {/* Project Meta Inputs (if selected type is project) */}
        {selectedType === 'project' && (
          <View style={styles.projectFormBox}>
            <Text style={styles.projectFormTitle}>Project Details</Text>
            <TextInput
              style={styles.smallInput}
              placeholder="Project Name (e.g. Accra Transit)"
              placeholderTextColor="#64748B"
              value={projectName}
              onChangeText={setProjectName}
            />
            <TextInput
              style={styles.smallInput}
              placeholder="GitHub Repository URL"
              placeholderTextColor="#64748B"
              value={projectRepo}
              onChangeText={setProjectRepo}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.smallInput}
              placeholder="Live Demo URL (optional)"
              placeholderTextColor="#64748B"
              value={projectDemo}
              onChangeText={setProjectDemo}
              autoCapitalize="none"
            />
            <TextInput
              style={styles.smallInput}
              placeholder="Technologies (comma separated, e.g. React Native, Go)"
              placeholderTextColor="#64748B"
              value={projectTechStack}
              onChangeText={setProjectTechStack}
            />
          </View>
        )}

        {/* Optional Image URL */}
        <Text style={styles.sectionLabel}>COVER / ATTACHMENT IMAGE URL (OPTIONAL)</Text>
        <TextInput
          style={styles.titleInput}
          placeholder="https://images.unsplash.com/..."
          placeholderTextColor="#64748B"
          value={imageUrl}
          onChangeText={setImageUrl}
          autoCapitalize="none"
        />

        {/* Tags */}
        <Text style={styles.sectionLabel}>COMMUNITY TAGS</Text>
        <View style={styles.tagInputRow}>
          <TextInput
            style={styles.tagInput}
            placeholder="Add tag (e.g. MoMo, Paystack, AI)"
            placeholderTextColor="#64748B"
            value={tagInput}
            onChangeText={setTagInput}
            onSubmitEditing={handleAddTag}
          />
          <TouchableOpacity style={styles.addTagBtn} onPress={handleAddTag}>
            <Text style={styles.addTagBtnText}>Add</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tagsContainer}>
          {tags.map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => handleRemoveTag(t)}
              style={styles.tagPill}>
              <Text style={styles.tagText}>#{t}</Text>
              <Ionicons name="close" size={13} color="#94A3B8" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Live Preview Modal */}
      <Modal visible={showPreview} animationType="slide" transparent={false}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Post Preview</Text>
            <TouchableOpacity
              onPress={() => setShowPreview(false)}
              style={styles.closeModalBtn}>
              <Ionicons name="close" size={22} color={Colors.white} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={{ paddingVertical: 16 }}>
            <PostCard post={previewPost} showFullContent={true} />
            <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
              <Button
                title="Looks Good — Publish Now"
                onPress={() => {
                  setShowPreview(false);
                  handlePublish();
                }}
                variant="primary"
                size="lg"
                fullWidth={true}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
  cancelBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  cancelText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  previewIconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  previewText: {
    fontSize: 13,
    color: '#19E68C',
    fontWeight: '600',
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginTop: 14,
    marginBottom: 8,
  },
  typesRow: {
    gap: 8,
  },
  typePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#122033',
    borderWidth: 1,
    borderColor: '#1E324A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.full,
  },
  typePillActive: {
    backgroundColor: '#19E68C',
    borderColor: '#19E68C',
  },
  typePillText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#94A3B8',
  },
  typePillTextActive: {
    color: '#07111F',
    fontWeight: '700',
  },
  categoriesRow: {
    gap: 8,
  },
  catPill: {
    backgroundColor: '#122033',
    borderWidth: 1,
    borderColor: '#1E324A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.sm,
  },
  catPillActive: {
    borderColor: '#38BDF8',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
  },
  catPillText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  catPillTextActive: {
    color: '#38BDF8',
    fontWeight: '700',
  },
  titleInput: {
    backgroundColor: '#122033',
    borderWidth: 1,
    borderColor: '#1F334E',
    borderRadius: Radius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#F8FAFC',
  },
  contentInput: {
    backgroundColor: '#122033',
    borderWidth: 1,
    borderColor: '#1F334E',
    borderRadius: Radius.md,
    padding: 14,
    fontSize: 14.5,
    color: '#F8FAFC',
    minHeight: 120,
    lineHeight: 21,
  },
  codeEditorContainer: {
    backgroundColor: '#0A1422',
    borderWidth: 1,
    borderColor: '#1D2E45',
    borderRadius: Radius.md,
    marginTop: 12,
    overflow: 'hidden',
  },
  codeEditorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#101F31',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1D2E45',
  },
  codeHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  codeEditorTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#38BDF8',
  },
  langList: {
    gap: 6,
  },
  langBtn: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#16283E',
  },
  langBtnActive: {
    backgroundColor: '#19E68C',
  },
  langBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
  },
  langBtnTextActive: {
    color: '#07111F',
  },
  codeFileNameInput: {
    backgroundColor: '#0F1C2B',
    borderBottomWidth: 1,
    borderBottomColor: '#1A293E',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    color: '#94A3B8',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  codeContentInput: {
    padding: 12,
    fontSize: 13,
    color: '#E2E8F0',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    minHeight: 140,
    lineHeight: 19,
  },
  projectFormBox: {
    backgroundColor: '#102033',
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: '#1E324A',
    padding: 12,
    marginTop: 12,
    gap: 8,
  },
  projectFormTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#19E68C',
    marginBottom: 4,
  },
  smallInput: {
    backgroundColor: '#14253B',
    borderWidth: 1,
    borderColor: '#223854',
    borderRadius: Radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: '#F8FAFC',
  },
  tagInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tagInput: {
    flex: 1,
    backgroundColor: '#122033',
    borderWidth: 1,
    borderColor: '#1F334E',
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#F8FAFC',
  },
  addTagBtn: {
    backgroundColor: '#18273B',
    borderWidth: 1,
    borderColor: '#26384E',
    paddingHorizontal: 16,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTagBtnText: {
    fontSize: 13,
    color: '#19E68C',
    fontWeight: '700',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#132337',
    borderWidth: 1,
    borderColor: '#20344D',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
  },
  tagText: {
    fontSize: 12,
    color: '#38BDF8',
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#07111F',
  },
  modalHeader: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A293E',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  closeModalBtn: {
    padding: 6,
  },
});
