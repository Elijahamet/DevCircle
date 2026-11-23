import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Radius, Spacing } from '@/constants/theme';
import { DevCircleLogo } from '@/components/DevCircleLogo';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useDevCircle } from '@/context/DevCircleContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { login, updateCurrentUser, colors } = useDevCircle();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    setError('');

    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!username.trim() || username.trim().length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!agreedToTerms) {
      setError('Please accept the Terms & Conditions and Code of Conduct');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      updateCurrentUser({
        name: fullName.trim(),
        username: username.trim().toLowerCase(),
      });
      login(email.trim(), password);
      router.replace('/(tabs)');
    }, 700);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.header}>
            <DevCircleLogo size="md" showText={true} />
            <Text style={[styles.title, { color: colors.text }]}>Join DevCircle</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Connect with thousands of software engineers in Ghana
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {error ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={18} color={colors.danger} />
                <Text style={styles.errorBannerText}>{error}</Text>
              </View>
            ) : null}

            <Input
              label="Full Name"
              placeholder="e.g. Kwame Mensah"
              value={fullName}
              onChangeText={(t) => {
                setFullName(t);
                setError('');
              }}
              leftIcon={<Ionicons name="person-outline" size={18} color={colors.textTertiary} />}
            />

            <Input
              label="Username"
              placeholder="e.g. kwamecodes"
              value={username}
              onChangeText={(t) => {
                setUsername(t.replace(/\s+/g, '').toLowerCase());
                setError('');
              }}
              autoCapitalize="none"
              leftIcon={<Ionicons name="at-outline" size={18} color={colors.textTertiary} />}
            />

            <Input
              label="Email Address"
              placeholder="kwame@example.com"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                setError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Ionicons name="mail-outline" size={18} color={colors.textTertiary} />}
            />

            <Input
              label="Password"
              placeholder="At least 6 characters"
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                setError('');
              }}
              isPassword={true}
              leftIcon={<Ionicons name="lock-closed-outline" size={18} color={colors.textTertiary} />}
            />

            <Input
              label="Confirm Password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChangeText={(t) => {
                setConfirmPassword(t);
                setError('');
              }}
              isPassword={true}
              leftIcon={<Ionicons name="shield-checkmark-outline" size={18} color={colors.textTertiary} />}
            />

            {/* Terms & Conditions Checkbox */}
            <TouchableOpacity
              style={styles.termsRow}
              activeOpacity={0.7}
              onPress={() => setAgreedToTerms(!agreedToTerms)}>
              <View
                style={[
                  styles.checkbox,
                  {
                    backgroundColor: agreedToTerms ? colors.primary : colors.inputBackground,
                    borderColor: agreedToTerms ? colors.primary : colors.cardBorder,
                  },
                ]}>
                {agreedToTerms && (
                  <Ionicons name="checkmark" size={13} color={colors.textInverse} />
                )}
              </View>
              <Text style={[styles.termsText, { color: colors.textSecondary }]}>
                I agree to the{' '}
                <Text style={styles.highlightText}>Terms of Service</Text>,{' '}
                <Text style={styles.highlightText}>Privacy Policy</Text>, and{' '}
                <Text style={styles.highlightText}>Community Guidelines</Text>.
              </Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <Button
              title="Create Account"
              onPress={handleRegister}
              variant="primary"
              size="lg"
              loading={loading}
              fullWidth={true}
              style={{ marginTop: Spacing.md }}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/login')} activeOpacity={0.7}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
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
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F8FAFC',
    marginTop: Spacing.md,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13.5,
    color: '#94A3B8',
    textAlign: 'center',
    maxWidth: 290,
  },
  form: {
    width: '100%',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: Radius.md,
    padding: 12,
    marginBottom: Spacing.md,
  },
  errorBannerText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginVertical: Spacing.sm,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#33455E',
    backgroundColor: '#182536',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: '#19E68C',
    borderColor: '#19E68C',
  },
  termsText: {
    fontSize: 12.5,
    color: '#94A3B8',
    lineHeight: 18,
    flex: 1,
  },
  highlightText: {
    color: '#19E68C',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
  footerText: {
    color: '#94A3B8',
    fontSize: 14,
  },
  loginLink: {
    color: '#19E68C',
    fontSize: 14,
    fontWeight: '700',
  },
});
