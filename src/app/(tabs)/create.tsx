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
import { Image } from 'expo-image';
import { Radius, Spacing } from '@/constants/theme';
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

const PHOTO_PRESETS = [
  {
    label: 'AccraPay UI',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    icon: 'card-outline' as const,
  },
  {
    label: 'Accra DevFest Hackathon',
    url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    icon: 'laptop-outline' as const,
  },
  {
    label: 'Architecture Diagram',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    icon: 'git-network-outline' as const,
  },
  {
    label: 'Trotro Transit App',
    url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
    icon: 'bus-outline' as const,
  },
];

const VIDEO_PRESETS = [
  {
    label: 'Paystack MoMo Webhook Demo',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    duration: '0:48',
  },
  {
    label: 'Trotro GPS Tracking Walkthrough',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
    duration: '1:15',
  },
  {
    label: 'Ghanaian Developer CLI Demo',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    thumbUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    duration: '0:35',
  },
];

export default function CreatePostScreen() {
  const router = useRouter();
  const { currentUser, createPost, communities, colors } = useDevCircle();

  const [selectedType, setSelectedType] = useState<PostType>('discussion');
  const [selectedCategory, setSelectedCategory] = useState<PostCategory>('ghana_tech');
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['GhanaTech']);
  const [imageUrl, setImageUrl] = useState('');
  const [mediaAttachmentType, setMediaAttachmentType] = useState<'none' | 'photo' | 'video'>('none');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoDuration, setVideoDuration] = useState('0:45');

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
      const activeComm = communities.find((c) => c.id === selectedCommunityId);
      createPost({
        type: selectedType,
        category: selectedCategory,
        title: title.trim() || undefined,
        content: content.trim(),
        codeSnippet: snippet,
        imageUrl: mediaAttachmentType !== 'none' ? imageUrl.trim() || undefined : undefined,
        videoUrl: mediaAttachmentType === 'video' ? videoUrl.trim() || undefined : undefined,
        mediaType:
          mediaAttachmentType === 'video'
            ? 'video'
            : mediaAttachmentType === 'photo'
              ? 'image'
              : undefined,
        videoDuration:
          mediaAttachmentType === 'video' ? videoDuration.trim() || '0:45' : undefined,
        projectMeta,
        tags,
        communityId: activeComm?.id,
        communityName: activeComm?.name,
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
    imageUrl: mediaAttachmentType !== 'none' ? imageUrl.trim() || undefined : undefined,
    videoUrl: mediaAttachmentType === 'video' ? videoUrl.trim() || undefined : undefined,
    mediaType:
      mediaAttachmentType === 'video'
        ? 'video'
        : mediaAttachmentType === 'photo'
          ? 'image'
          : undefined,
    videoDuration:
      mediaAttachmentType === 'video' ? videoDuration.trim() || '0:45' : undefined,
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
          style={styles.cancelBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}>
          <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Cancel</Text>
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>Create Post</Text>

        <View style={styles.headerRightActions}>
          <TouchableOpacity
            style={styles.previewIconBtn}
            onPress={() => setShowPreview(true)}
            activeOpacity={0.7}>
            <Ionicons name="eye-outline" size={18} color={colors.primary} />
            <Text style={[styles.previewText, { color: colors.primary }]}>Preview</Text>
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
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>SELECT POST TYPE</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.typesRow}>
          {POST_TYPES.map((pt) => {
            const isSelected = selectedType === pt.type;
            return (
              <TouchableOpacity
                key={pt.type}
                style={[
                  styles.typePill,
                  {
                    backgroundColor: isSelected
                      ? colors.primary
                      : colors.inputBackground,
                    borderColor: isSelected
                      ? colors.primary
                      : colors.cardBorder,
                  },
                ]}
                activeOpacity={0.75}
                onPress={() => setSelectedType(pt.type)}>
                <Ionicons
                  name={pt.icon}
                  size={15}
                  color={isSelected ? colors.textInverse : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.typePillText,
                    {
                      color: isSelected
                        ? colors.textInverse
                        : colors.textSecondary,
                    },
                    isSelected && { fontWeight: '700' },
                  ]}>
                  {pt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Post to Community / Group (Optional) */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          POST TO COMMUNITY / GROUP (OPTIONAL)
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}>
          <TouchableOpacity
            style={[
              styles.catPill,
              {
                backgroundColor: !selectedCommunityId
                  ? colors.primary
                  : colors.inputBackground,
                borderColor: !selectedCommunityId
                  ? colors.primary
                  : colors.cardBorder,
              },
            ]}
            onPress={() => setSelectedCommunityId('')}>
            <Text
              style={[
                styles.catPillText,
                {
                  color: !selectedCommunityId
                    ? colors.textInverse
                    : colors.textSecondary,
                  fontWeight: !selectedCommunityId ? '700' : '500',
                },
              ]}>
              Feed Wide (No Group)
            </Text>
          </TouchableOpacity>
          {communities.map((comm) => {
            const isSelected = selectedCommunityId === comm.id;
            return (
              <TouchableOpacity
                key={comm.id}
                style={[
                  styles.catPill,
                  {
                    backgroundColor: isSelected
                      ? colors.primary
                      : colors.inputBackground,
                    borderColor: isSelected
                      ? colors.primary
                      : colors.cardBorder,
                  },
                ]}
                onPress={() => setSelectedCommunityId(comm.id)}>
                <Text
                  style={[
                    styles.catPillText,
                    {
                      color: isSelected
                        ? colors.textInverse
                        : colors.textSecondary,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}>
                  {comm.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Category Selector */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>CATEGORY</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.catPill,
                  {
                    backgroundColor: isSelected
                      ? colors.primary
                      : colors.inputBackground,
                    borderColor: isSelected
                      ? colors.primary
                      : colors.cardBorder,
                  },
                ]}
                activeOpacity={0.75}
                onPress={() => setSelectedCategory(cat.id)}>
                <Text
                  style={[
                    styles.catPillText,
                    {
                      color: isSelected
                        ? colors.textInverse
                        : colors.textSecondary,
                    },
                    isSelected && { fontWeight: '700' },
                  ]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Title Input */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>TITLE (OPTIONAL)</Text>
        <TextInput
          style={[
            styles.titleInput,
            {
              backgroundColor: colors.inputBackground,
              borderColor: colors.inputBorder,
              color: colors.text,
            },
          ]}
          placeholder="Give your discussion or showcase a title..."
          placeholderTextColor={colors.textTertiary}
          value={title}
          onChangeText={setTitle}
        />

        {/* Main Content Body */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>CONTENT</Text>
        <TextInput
          style={[
            styles.contentInput,
            {
              backgroundColor: colors.inputBackground,
              borderColor: colors.inputBorder,
              color: colors.text,
            },
          ]}
          placeholder="Share your technical question, insight, or announcement with Ghanaian developers..."
          placeholderTextColor={colors.textTertiary}
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
              style={[
                styles.codeFileNameInput,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.cardBorder,
                  color: colors.text,
                },
              ]}
              placeholder="File name (e.g. webhookHandler.ts)"
              placeholderTextColor={colors.textTertiary}
              value={codeFileName}
              onChangeText={setCodeFileName}
            />

            <TextInput
              style={[
                styles.codeContentInput,
                {
                  color: colors.text,
                },
              ]}
              placeholder="// Paste or write your code snippet here..."
              placeholderTextColor={colors.textTertiary}
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
          <View
            style={[
              styles.projectFormBox,
              {
                backgroundColor: colors.card,
                borderColor: colors.cardBorder,
              },
            ]}>
            <Text style={[styles.projectFormTitle, { color: colors.text }]}>Project Details</Text>
            <TextInput
              style={[
                styles.smallInput,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.inputBorder,
                  color: colors.text,
                },
              ]}
              placeholder="Project Name (e.g. Accra Transit)"
              placeholderTextColor={colors.textTertiary}
              value={projectName}
              onChangeText={setProjectName}
            />
            <TextInput
              style={[
                styles.smallInput,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.inputBorder,
                  color: colors.text,
                },
              ]}
              placeholder="GitHub Repository URL"
              placeholderTextColor={colors.textTertiary}
              value={projectRepo}
              onChangeText={setProjectRepo}
              autoCapitalize="none"
            />
            <TextInput
              style={[
                styles.smallInput,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.inputBorder,
                  color: colors.text,
                },
              ]}
              placeholder="Live Demo URL (optional)"
              placeholderTextColor={colors.textTertiary}
              value={projectDemo}
              onChangeText={setProjectDemo}
              autoCapitalize="none"
            />
            <TextInput
              style={[
                styles.smallInput,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.inputBorder,
                  color: colors.text,
                },
              ]}
              placeholder="Technologies (comma separated, e.g. React Native, Go)"
              placeholderTextColor={colors.textTertiary}
              value={projectTechStack}
              onChangeText={setProjectTechStack}
            />
          </View>
        )}

        {/* Media Attachments Section (Picture & Video) */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
          ATTACH MEDIA (PICTURE OR VIDEO)
        </Text>

        {/* Media Type Segmented Pills */}
        <View style={styles.mediaTypeRow}>
          <TouchableOpacity
            style={[
              styles.mediaTypeBtn,
              mediaAttachmentType === 'none' && styles.mediaTypeBtnActive,
              {
                backgroundColor:
                  mediaAttachmentType === 'none'
                    ? colors.primary
                    : colors.inputBackground,
                borderColor:
                  mediaAttachmentType === 'none'
                    ? colors.primary
                    : colors.cardBorder,
              },
            ]}
            onPress={() => {
              setMediaAttachmentType('none');
              setImageUrl('');
              setVideoUrl('');
            }}>
            <Ionicons
              name="close-circle-outline"
              size={15}
              color={
                mediaAttachmentType === 'none'
                  ? colors.textInverse
                  : colors.textSecondary
              }
            />
            <Text
              style={[
                styles.mediaTypeBtnText,
                {
                  color:
                    mediaAttachmentType === 'none'
                      ? colors.textInverse
                      : colors.textSecondary,
                },
              ]}>
              No Media
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.mediaTypeBtn,
              mediaAttachmentType === 'photo' && styles.mediaTypeBtnActive,
              {
                backgroundColor:
                  mediaAttachmentType === 'photo'
                    ? colors.primary
                    : colors.inputBackground,
                borderColor:
                  mediaAttachmentType === 'photo'
                    ? colors.primary
                    : colors.cardBorder,
              },
            ]}
            onPress={() => {
              setMediaAttachmentType('photo');
              if (!imageUrl) setImageUrl(PHOTO_PRESETS[0].url);
            }}>
            <Ionicons
              name="image-outline"
              size={15}
              color={
                mediaAttachmentType === 'photo'
                  ? colors.textInverse
                  : colors.textSecondary
              }
            />
            <Text
              style={[
                styles.mediaTypeBtnText,
                {
                  color:
                    mediaAttachmentType === 'photo'
                      ? colors.textInverse
                      : colors.textSecondary,
                },
              ]}>
              Picture / Photo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.mediaTypeBtn,
              mediaAttachmentType === 'video' && styles.mediaTypeBtnActive,
              {
                backgroundColor:
                  mediaAttachmentType === 'video'
                    ? colors.primary
                    : colors.inputBackground,
                borderColor:
                  mediaAttachmentType === 'video'
                    ? colors.primary
                    : colors.cardBorder,
              },
            ]}
            onPress={() => {
              setMediaAttachmentType('video');
              if (!videoUrl) {
                setVideoUrl(VIDEO_PRESETS[0].videoUrl);
                setImageUrl(VIDEO_PRESETS[0].thumbUrl);
                setVideoDuration(VIDEO_PRESETS[0].duration);
              }
            }}>
            <Ionicons
              name="videocam-outline"
              size={15}
              color={
                mediaAttachmentType === 'video'
                  ? colors.textInverse
                  : colors.textSecondary
              }
            />
            <Text
              style={[
                styles.mediaTypeBtnText,
                {
                  color:
                    mediaAttachmentType === 'video'
                      ? colors.textInverse
                      : colors.textSecondary,
                },
              ]}>
              Video Demo
            </Text>
          </TouchableOpacity>
        </View>

        {/* Photo Presets & Input */}
        {mediaAttachmentType === 'photo' && (
          <View
            style={[
              styles.mediaConfigBox,
              {
                backgroundColor: colors.card,
                borderColor: colors.cardBorder,
              },
            ]}>
            <Text style={[styles.presetHeader, { color: colors.textSecondary }]}>
              QUICK PHOTO PRESETS (TAP TO SELECT)
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.presetScroll}>
              {PHOTO_PRESETS.map((preset, idx) => {
                const isSelected = imageUrl === preset.url;
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.presetChip,
                      {
                        backgroundColor: isSelected
                          ? 'rgba(25, 230, 140, 0.15)'
                          : colors.inputBackground,
                        borderColor: isSelected
                          ? colors.primary
                          : colors.cardBorder,
                      },
                    ]}
                    onPress={() => setImageUrl(preset.url)}>
                    <Ionicons
                      name={preset.icon}
                      size={14}
                      color={isSelected ? colors.primary : colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.presetChipText,
                        {
                          color: isSelected ? colors.primary : colors.text,
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}>
                      {preset.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TextInput
              style={[
                styles.smallInput,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.inputBorder,
                  color: colors.text,
                  marginTop: 10,
                },
              ]}
              placeholder="Or paste custom image URL (https://...)"
              placeholderTextColor={colors.textTertiary}
              value={imageUrl}
              onChangeText={setImageUrl}
              autoCapitalize="none"
            />

            {/* Live Picture Preview Card with Remove Button */}
            {imageUrl ? (
              <View style={styles.mediaPreviewWrap}>
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.mediaPreviewImg}
                  contentFit="cover"
                  transition={250}
                />
                <TouchableOpacity
                  style={styles.removeMediaBtn}
                  onPress={() => {
                    setImageUrl('');
                    setMediaAttachmentType('none');
                  }}>
                  <Ionicons name="trash" size={14} color="#FFFFFF" />
                  <Text style={styles.removeMediaBtnText}>Remove Photo</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        )}

        {/* Video Presets & Input */}
        {mediaAttachmentType === 'video' && (
          <View
            style={[
              styles.mediaConfigBox,
              {
                backgroundColor: colors.card,
                borderColor: colors.cardBorder,
              },
            ]}>
            <Text style={[styles.presetHeader, { color: colors.textSecondary }]}>
              QUICK VIDEO DEMO PRESETS (TAP TO SELECT)
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.presetScroll}>
              {VIDEO_PRESETS.map((preset, idx) => {
                const isSelected = videoUrl === preset.videoUrl;
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.presetChip,
                      {
                        backgroundColor: isSelected
                          ? 'rgba(25, 230, 140, 0.15)'
                          : colors.inputBackground,
                        borderColor: isSelected
                          ? colors.primary
                          : colors.cardBorder,
                      },
                    ]}
                    onPress={() => {
                      setVideoUrl(preset.videoUrl);
                      setImageUrl(preset.thumbUrl);
                      setVideoDuration(preset.duration);
                    }}>
                    <Ionicons
                      name="videocam"
                      size={14}
                      color={isSelected ? colors.primary : colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.presetChipText,
                        {
                          color: isSelected ? colors.primary : colors.text,
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}>
                      {preset.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TextInput
              style={[
                styles.smallInput,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.inputBorder,
                  color: colors.text,
                  marginTop: 10,
                },
              ]}
              placeholder="Custom video URL (.mp4 / stream)"
              placeholderTextColor={colors.textTertiary}
              value={videoUrl}
              onChangeText={setVideoUrl}
              autoCapitalize="none"
            />

            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
              <TextInput
                style={[
                  styles.smallInput,
                  {
                    flex: 1,
                    backgroundColor: colors.inputBackground,
                    borderColor: colors.inputBorder,
                    color: colors.text,
                  },
                ]}
                placeholder="Video Thumbnail Poster URL (optional)"
                placeholderTextColor={colors.textTertiary}
                value={imageUrl}
                onChangeText={setImageUrl}
                autoCapitalize="none"
              />
              <TextInput
                style={[
                  styles.smallInput,
                  {
                    width: 90,
                    backgroundColor: colors.inputBackground,
                    borderColor: colors.inputBorder,
                    color: colors.text,
                    textAlign: 'center',
                  },
                ]}
                placeholder="Duration"
                placeholderTextColor={colors.textTertiary}
                value={videoDuration}
                onChangeText={setVideoDuration}
              />
            </View>

            {/* Live Video Preview Card */}
            {videoUrl ? (
              <View style={styles.mediaPreviewWrap}>
                <Image
                  source={{
                    uri:
                      imageUrl ||
                      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
                  }}
                  style={styles.mediaPreviewImg}
                  contentFit="cover"
                  transition={250}
                />
                <View style={styles.mediaPreviewVideoOverlay} />
                <View style={[styles.playButtonCirclePreview, { backgroundColor: colors.primary }]}>
                  <Ionicons name="play" size={20} color="#07111F" style={{ marginLeft: 2 }} />
                </View>
                <View style={styles.durationPillPreview}>
                  <Text style={styles.durationPillText}>{videoDuration || '0:45'}</Text>
                </View>
                <TouchableOpacity
                  style={styles.removeMediaBtn}
                  onPress={() => {
                    setVideoUrl('');
                    setImageUrl('');
                    setMediaAttachmentType('none');
                  }}>
                  <Ionicons name="trash" size={14} color="#FFFFFF" />
                  <Text style={styles.removeMediaBtnText}>Remove Video</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        )}

        {/* Tags */}
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>COMMUNITY TAGS</Text>
        <View style={styles.tagInputRow}>
          <TextInput
            style={[
              styles.tagInput,
              {
                backgroundColor: colors.inputBackground,
                borderColor: colors.inputBorder,
                color: colors.text,
              },
            ]}
            placeholder="Add tag (e.g. MoMo, Paystack, AI)"
            placeholderTextColor={colors.textTertiary}
            value={tagInput}
            onChangeText={setTagInput}
            onSubmitEditing={handleAddTag}
          />
          <TouchableOpacity
            style={[styles.addTagBtn, { backgroundColor: colors.primary }]}
            onPress={handleAddTag}>
            <Text style={[styles.addTagBtnText, { color: colors.textInverse }]}>Add</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tagsContainer}>
          {tags.map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => handleRemoveTag(t)}
              style={[
                styles.tagPill,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.cardBorder,
                },
              ]}>
              <Text style={[styles.tagText, { color: colors.primary }]}>#{t}</Text>
              <Ionicons name="close" size={13} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Live Preview Modal */}
      <Modal visible={showPreview} animationType="slide" transparent={false}>
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View
            style={[
              styles.modalHeader,
              {
                backgroundColor: colors.headerBg,
                borderBottomColor: colors.headerBorder,
              },
            ]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Post Preview</Text>
            <TouchableOpacity
              onPress={() => setShowPreview(false)}
              style={styles.closeModalBtn}>
              <Ionicons name="close" size={22} color={colors.text} />
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
  mediaTypeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  mediaTypeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  mediaTypeBtnActive: {
    shadowColor: '#19E68C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  mediaTypeBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
  mediaConfigBox: {
    padding: 12,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginBottom: 14,
  },
  presetHeader: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  presetScroll: {
    gap: 8,
    paddingBottom: 4,
  },
  presetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  presetChipText: {
    fontSize: 12,
  },
  mediaPreviewWrap: {
    marginTop: 12,
    borderRadius: Radius.md,
    overflow: 'hidden',
    height: 180,
    position: 'relative',
    backgroundColor: '#0D1724',
    borderWidth: 1,
    borderColor: '#263548',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaPreviewImg: {
    width: '100%',
    height: '100%',
  },
  mediaPreviewVideoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(7, 17, 31, 0.45)',
  },
  playButtonCirclePreview: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#19E68C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  durationPillPreview: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(7, 17, 31, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  removeMediaBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
  },
  removeMediaBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
