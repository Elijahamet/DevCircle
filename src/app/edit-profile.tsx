import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '@/constants/theme';
import { Avatar } from '@/components/Avatar';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useDevCircle } from '@/context/DevCircleContext';

export default function EditProfileScreen() {
  const router = useRouter();
  const { currentUser, updateCurrentUser } = useDevCircle();

  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [name, setName] = useState(currentUser.name);
  const [username, setUsername] = useState(currentUser.username);
  const [role, setRole] = useState(currentUser.role);
  const [bio, setBio] = useState(currentUser.bio);
  const [location, setLocation] = useState(currentUser.location);
  const [skills, setSkills] = useState(currentUser.skills.join(', '));
  const [githubUrl, setGithubUrl] = useState(currentUser.githubUrl || '');
  const [portfolioUrl, setPortfolioUrl] = useState(currentUser.portfolioUrl || '');
  const [websiteUrl, setWebsiteUrl] = useState(currentUser.websiteUrl || '');
  const [education, setEducation] = useState(currentUser.education || '');
  const [experience, setExperience] = useState(currentUser.experience || '');
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Full name cannot be empty');
      return;
    }
    if (!username.trim()) {
      Alert.alert('Validation Error', 'Username cannot be empty');
      return;
    }

    setSaving(true);
    const parsedSkills = skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    setTimeout(() => {
      updateCurrentUser({
        avatar: avatar.trim(),
        name: name.trim(),
        username: username.trim().toLowerCase(),
        role: role.trim(),
        bio: bio.trim(),
        location: location.trim(),
        skills: parsedSkills.length > 0 ? parsedSkills : currentUser.skills,
        githubUrl: githubUrl.trim(),
        portfolioUrl: portfolioUrl.trim(),
        websiteUrl: websiteUrl.trim(),
        education: education.trim(),
        experience: experience.trim(),
      });

      setSaving(false);
      Alert.alert('Profile Saved', 'Your developer profile has been updated.', [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]);
    }, 500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Edit Profile</Text>

          <Button
            title="Save"
            onPress={handleSave}
            variant="primary"
            size="sm"
            loading={saving}
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          {/* Avatar edit section */}
          <View style={styles.avatarSection}>
            <Avatar url={avatar} name={name} size={84} showBorder={true} />
            <Text style={styles.avatarHint}>Current Profile Picture</Text>
          </View>

          <Input
            label="Avatar Image URL"
            value={avatar}
            onChangeText={setAvatar}
            placeholder="https://..."
            autoCapitalize="none"
            leftIcon={<Ionicons name="image-outline" size={18} color={Colors.mutedGrey} />}
          />

          <Input
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="e.g. Kofi Mensah"
            leftIcon={<Ionicons name="person-outline" size={18} color={Colors.mutedGrey} />}
          />

          <Input
            label="Username"
            value={username}
            onChangeText={(t) => setUsername(t.replace(/\s+/g, '').toLowerCase())}
            placeholder="e.g. koficodes"
            autoCapitalize="none"
            leftIcon={<Ionicons name="at-outline" size={18} color={Colors.mutedGrey} />}
          />

          <Input
            label="Headline / Professional Role"
            value={role}
            onChangeText={setRole}
            placeholder="e.g. Senior Full-Stack Engineer"
            leftIcon={<Ionicons name="briefcase-outline" size={18} color={Colors.mutedGrey} />}
          />

          <Input
            label="Location"
            value={location}
            onChangeText={setLocation}
            placeholder="e.g. Accra, Ghana 🇬🇭"
            leftIcon={<Ionicons name="location-outline" size={18} color={Colors.mutedGrey} />}
          />

          <Input
            label="Biography"
            value={bio}
            onChangeText={setBio}
            placeholder="Share what you build and tech stacks you love..."
            multiline={true}
            numberOfLines={4}
            style={{ minHeight: 80 }}
          />

          <Input
            label="Technical Skills (comma separated)"
            value={skills}
            onChangeText={setSkills}
            placeholder="TypeScript, React Native, Node.js, Go"
            leftIcon={<Ionicons name="code-slash-outline" size={18} color={Colors.mutedGrey} />}
          />

          <Input
            label="Experience Level"
            value={experience}
            onChangeText={setExperience}
            placeholder="e.g. 5+ years in Web & Mobile Engineering"
            leftIcon={<Ionicons name="ribbon-outline" size={18} color={Colors.mutedGrey} />}
          />

          <Input
            label="Education"
            value={education}
            onChangeText={setEducation}
            placeholder="e.g. BSc Computer Science, KNUST"
            leftIcon={<Ionicons name="school-outline" size={18} color={Colors.mutedGrey} />}
          />

          <Text style={styles.sectionHeader}>DEVELOPER LINKS</Text>

          <Input
            label="GitHub Profile URL"
            value={githubUrl}
            onChangeText={setGithubUrl}
            placeholder="https://github.com/..."
            autoCapitalize="none"
            leftIcon={<Ionicons name="logo-github" size={18} color={Colors.mutedGrey} />}
          />

          <Input
            label="Portfolio URL"
            value={portfolioUrl}
            onChangeText={setPortfolioUrl}
            placeholder="https://yourportfolio.dev"
            autoCapitalize="none"
            leftIcon={<Ionicons name="globe-outline" size={18} color={Colors.mutedGrey} />}
          />

          <Input
            label="Website or Blog URL"
            value={websiteUrl}
            onChangeText={setWebsiteUrl}
            placeholder="https://..."
            autoCapitalize="none"
            leftIcon={<Ionicons name="link-outline" size={18} color={Colors.mutedGrey} />}
          />
        </ScrollView>
      </KeyboardAvoidingView>
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
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginVertical: Spacing.md,
    gap: 8,
  },
  avatarHint: {
    fontSize: 12,
    color: '#94A3B8',
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginTop: 16,
    marginBottom: 12,
  },
});
