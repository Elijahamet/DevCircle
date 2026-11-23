import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { DevCircleLogo } from '@/components/DevCircleLogo';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useDevCircle } from '@/context/DevCircleContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useDevCircle();

  const [email, setEmail] = useState('kofi@devcircle.gh');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = () => {
    setError('');
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      login(email, password);
      router.replace('/(tabs)');
    }, 600);
  };

  const handleDemoSignIn = () => {
    setEmail('kofi@devcircle.gh');
    setPassword('password123');
    login('kofi@devcircle.gh');
    router.replace('/(tabs)');
  };

  const handleOAuthPlaceholder = (provider: string) => {
    Alert.alert(
      `${provider} Sign-In`,
      'This is a visual placeholder for frontend demonstration. You can sign in using Demo mode or your email.'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          {/* Header & Logo */}
          <View style={styles.header}>
            <DevCircleLogo size="lg" showText={true} />
            <Text style={styles.welcomeTitle}>Welcome Back</Text>
            <Text style={styles.welcomeSubtitle}>
              Sign in to your DevCircle Ghana developer account
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {error ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={18} color={Colors.danger} />
                <Text style={styles.errorBannerText}>{error}</Text>
              </View>
            ) : null}

            <Input
              label="Email Address"
              placeholder="kofi@devcircle.gh"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Ionicons name="mail-outline" size={18} color={Colors.mutedGrey} />}
            />

            <Input
              label="Password"
              placeholder="••••••••••••"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setError('');
              }}
              isPassword={true}
              leftIcon={<Ionicons name="lock-closed-outline" size={18} color={Colors.mutedGrey} />}
            />

            {/* Remember Me & Forgot Password */}
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={styles.rememberMeRow}
                activeOpacity={0.7}
                onPress={() => setRememberMe(!rememberMe)}>
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe && (
                    <Ionicons name="checkmark" size={13} color={Colors.deepNavy} />
                  )}
                </View>
                <Text style={styles.rememberMeText}>Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push('/forgot-password')}
                activeOpacity={0.7}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Primary Sign In Button */}
            <Button
              title="Sign In"
              onPress={handleSignIn}
              variant="primary"
              size="lg"
              loading={loading}
              fullWidth={true}
              style={{ marginTop: Spacing.sm }}
            />

            {/* Quick Demo Login Pill */}
            <TouchableOpacity
              style={styles.demoLoginBtn}
              onPress={handleDemoSignIn}
              activeOpacity={0.8}>
              <Ionicons name="flash" size={16} color={Colors.electricGreen} />
              <Text style={styles.demoLoginText}>Instant Demo Sign In (Kofi Mensah)</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* OAuth Buttons */}
            <View style={styles.oauthContainer}>
              <TouchableOpacity
                style={styles.oauthButton}
                activeOpacity={0.7}
                onPress={() => handleOAuthPlaceholder('GitHub')}>
                <Ionicons name="logo-github" size={20} color={Colors.white} />
                <Text style={styles.oauthButtonText}>GitHub</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.oauthButton}
                activeOpacity={0.7}
                onPress={() => handleOAuthPlaceholder('Google')}>
                <Ionicons name="logo-google" size={19} color="#EA4335" />
                <Text style={styles.oauthButtonText}>Google</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer Create Account */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Do not have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/register')} activeOpacity={0.7}>
              <Text style={styles.createAccountLink}>Create Account</Text>
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
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F8FAFC',
    marginTop: Spacing.lg,
    marginBottom: 6,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    maxWidth: 280,
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
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  rememberMeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  },
  checkboxChecked: {
    backgroundColor: '#19E68C',
    borderColor: '#19E68C',
  },
  rememberMeText: {
    fontSize: 13,
    color: '#94A3B8',
  },
  forgotPasswordText: {
    fontSize: 13,
    color: '#19E68C',
    fontWeight: '600',
  },
  demoLoginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0F2132',
    borderWidth: 1,
    borderColor: 'rgba(25, 230, 140, 0.3)',
    borderRadius: Radius.md,
    paddingVertical: 12,
    marginTop: Spacing.md,
  },
  demoLoginText: {
    color: '#19E68C',
    fontSize: 13,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#1F3146',
  },
  dividerText: {
    color: '#64748B',
    fontSize: 12,
    paddingHorizontal: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  oauthContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  oauthButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#182536',
    borderWidth: 1,
    borderColor: '#263548',
    borderRadius: Radius.md,
    paddingVertical: 12,
  },
  oauthButtonText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xxl,
  },
  footerText: {
    color: '#94A3B8',
    fontSize: 14,
  },
  createAccountLink: {
    color: '#19E68C',
    fontSize: 14,
    fontWeight: '700',
  },
});
