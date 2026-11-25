import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Radius, Spacing } from '@/constants/theme';
import { Button } from './Button';
import { useDevCircle } from '@/context/DevCircleContext';
import { Community } from '@/types';

interface CreateCommunityModalProps {
  visible: boolean;
  onClose: () => void;
  onCreated?: (community: Community) => void;
}

const CATEGORIES = [
  'Frontend & Mobile',
  'Fintech & Payments',
  'AI & Data Science',
  'DevOps & Cloud',
  'Students & Campus',
  'Cybersecurity',
  'General Tech',
];

const AVATAR_PRESETS = [
  {
    label: 'Code Terminal',
    avatar: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Fintech Gold',
    avatar: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'AI Neural',
    avatar: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Cloud Server',
    avatar: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Campus Community',
    avatar: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&auto=format&fit=crop&q=80',
  },
];

export const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({
  visible,
  onClose,
  onCreated,
}) => {
  const { createCommunity, colors } = useDevCircle();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['GhanaTech', 'Community']);
  const [selectedPresetIdx, setSelectedPresetIdx] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleAddTag = () => {
    const clean = tagInput.trim().replace(/^#/, '');
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleCreate = () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter a community name.');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Required', 'Please write a brief description of what this group is about.');
      return;
    }

    setSubmitting(true);
    const chosenPreset = AVATAR_PRESETS[selectedPresetIdx] || AVATAR_PRESETS[0];

    setTimeout(() => {
      const newCommunity = createCommunity({
        name: name.trim(),
        description: description.trim(),
        category: selectedCategory,
        avatar: chosenPreset.avatar,
        bannerUrl: chosenPreset.banner,
        tags,
      });

      setSubmitting(false);
      resetForm();
      onClose();

      Alert.alert(
        'Community Created! 🎉',
        `"${newCommunity.name}" is now live! You are automatically joined as the group creator.`,
        [
          {
            text: 'Open Group',
            onPress: () => {
              if (onCreated) onCreated(newCommunity);
            },
          },
        ]
      );
    }, 350);
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setSelectedCategory(CATEGORIES[0]);
    setTags(['GhanaTech', 'Community']);
    setSelectedPresetIdx(0);
    setTagInput('');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}>
        <View
          style={[
            styles.modalContainer,
            {
              backgroundColor: colors.card,
              borderColor: colors.cardBorder,
            },
          ]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.cardBorder }]}>
            <View>
              <Text style={[styles.title, { color: colors.text }]}>Create a Community</Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Start a developer circle or tech group in Ghana
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={[
                styles.closeBtn,
                { backgroundColor: colors.inputBackground, borderColor: colors.cardBorder },
              ]}>
              <Ionicons name="close" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled">
            {/* Visual Icon / Theme Preset Selector */}
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              COMMUNITY BRAND & BANNER PRESET
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.presetRow}>
              {AVATAR_PRESETS.map((preset, idx) => {
                const isSelected = selectedPresetIdx === idx;
                return (
                  <TouchableOpacity
                    key={idx}
                    activeOpacity={0.8}
                    onPress={() => setSelectedPresetIdx(idx)}
                    style={[
                      styles.presetCard,
                      {
                        backgroundColor: colors.inputBackground,
                        borderColor: isSelected ? colors.primary : colors.cardBorder,
                      },
                    ]}>
                    <Image
                      source={{ uri: preset.avatar }}
                      style={styles.presetAvatar}
                      contentFit="cover"
                      transition={200}
                    />
                    <Text
                      style={[
                        styles.presetLabel,
                        {
                          color: isSelected ? colors.primary : colors.textSecondary,
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}>
                      {preset.label}
                    </Text>
                    {isSelected && (
                      <View style={[styles.checkBadge, { backgroundColor: colors.primary }]}>
                        <Ionicons name="checkmark" size={11} color="#07111F" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Community Name Input */}
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              COMMUNITY NAME *
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.inputBorder,
                  color: colors.text,
                },
              ]}
              placeholder="e.g. Accra Flutter Developers"
              placeholderTextColor={colors.textTertiary}
              value={name}
              onChangeText={setName}
            />

            {/* Category Selector */}
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>CATEGORY *</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.catRow}>
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.catPill,
                      {
                        backgroundColor: isSelected ? colors.primary : colors.inputBackground,
                        borderColor: isSelected ? colors.primary : colors.cardBorder,
                      },
                    ]}
                    onPress={() => setSelectedCategory(cat)}>
                    <Text
                      style={[
                        styles.catPillText,
                        {
                          color: isSelected ? colors.textInverse : colors.textSecondary,
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Description Input */}
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
              ABOUT THIS GROUP / PURPOSE *
            </Text>
            <TextInput
              style={[
                styles.textArea,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.inputBorder,
                  color: colors.text,
                },
              ]}
              placeholder="What will members discuss, share, or build together? (e.g. Weekly code reviews, local meetups, job opportunities in Ghana...)"
              placeholderTextColor={colors.textTertiary}
              value={description}
              onChangeText={setDescription}
              multiline={true}
              numberOfLines={4}
              textAlignVertical="top"
            />

            {/* Topics / Tags */}
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>TOPIC TAGS</Text>
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
                placeholder="Add tag (e.g. Flutter, Dart, Accra)"
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

            {/* Actions */}
            <View style={styles.actionsRow}>
              <Button
                title="Cancel"
                variant="ghost"
                size="md"
                onPress={onClose}
                style={{ flex: 1 }}
              />
              <Button
                title="Create Group"
                variant="primary"
                size="md"
                loading={submitting}
                onPress={handleCreate}
                style={{ flex: 1.5 }}
                rightIcon={
                  <Ionicons name="people" size={16} color={colors.textInverse} />
                }
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 17, 31, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12.5,
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
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginTop: Spacing.md,
    marginBottom: 6,
  },
  presetRow: {
    gap: 10,
    paddingBottom: 4,
  },
  presetCard: {
    width: 100,
    alignItems: 'center',
    padding: 8,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    position: 'relative',
  },
  presetAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 6,
  },
  presetLabel: {
    fontSize: 11,
    textAlign: 'center',
  },
  checkBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  catRow: {
    gap: 8,
    paddingBottom: 4,
  },
  catPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  catPillText: {
    fontSize: 12,
  },
  textArea: {
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    minHeight: 88,
  },
  tagInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tagInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
  },
  addTagBtn: {
    paddingHorizontal: 16,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTagBtnText: {
    fontSize: 13,
    fontWeight: '700',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
    marginBottom: Spacing.lg,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: Spacing.md,
  },
});
