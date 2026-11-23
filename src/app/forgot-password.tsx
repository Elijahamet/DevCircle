import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Radius, Spacing } from '@/constants/theme';
import { useDevCircle } from '@/context/DevCircleContext';
import { DevCircleLogo } from '@/components/DevCircleLogo';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { colors } = useDevCircle();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleResetPassword = () => {
    setError('');
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid registered email');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSuccess(true);
    }, 800);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back navigation */}
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={20} color={colors.text} />
          <Text style={[styles.backText, { color: colors.text }]}>Back to Sign In</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <DevCircleLogo size="md" showText={true} />
        </View>

        {!isSuccess ? (
          <View
            style={[
              styles.formCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.cardBorder,
              },
            ]}>
            <View
              style={[
                styles.iconCircle,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.cardBorder,
                },
              ]}>
              <Ionicons name="key-outline" size={32} color={colors.primary} />
            </View>

            <Text style={[styles.title, { color: colors.text }]}>Reset Password</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Enter your email and we will send you recovery instructions to regain access to your account.
            </Text>

            {error ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={16} color={colors.danger} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Input
              label="Account Email"
              placeholder="kofi@devcircle.gh"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                setError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Ionicons name="mail-outline" size={18} color={colors.textTertiary} />}
            />

            <Button
              title="Send Reset Instructions"
              onPress={handleResetPassword}
              variant="primary"
              size="lg"
              loading={loading}
              fullWidth={true}
              style={{ marginTop: Spacing.sm }}
            />
          </View>
        ) : (
          <View
            style={[
              styles.formCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.cardBorder,
              },
            ]}>
            <View
              style={[
                styles.iconCircle,
                styles.successCircle,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.primary,
                },
              ]}>
              <Ionicons name="checkmark-done" size={36} color={colors.primary} />
            </View>

            <Text style={[styles.title, { color: colors.text }]}>Check Your Inbox</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              We have dispatched password recovery instructions to{' '}
              <Text style={[styles.emailHighlight, { color: colors.primary }]}>{email}</Text>. Please check your spam folder if it does not appear shortly.
            </Text>

            <View
              style={[
                styles.demoNoticeBox,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.cardBorder,
                },
              ]}>
              <Ionicons name="information-circle-outline" size={16} color={colors.info} />
              <Text style={[styles.demoNoticeText, { color: colors.textSecondary }]}>
                Demo mode: As this is running purely on local state, you can return and sign in directly with the instant demo button.
              </Text>
            </View>

            <Button
              title="Return to Sign In"
              onPress={() => router.replace('/login')}
              variant="primary"
              size="lg"
              fullWidth={true}
            />
          </View>
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
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.lg,
    paddingVertical: 6,
  },
  backText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  formCard: {
    backgroundColor: '#122033',
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: '#1F334E',
    padding: Spacing.xl,
    alignItems: 'center',
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(25, 230, 140, 0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(25, 230, 140, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  successCircle: {
    backgroundColor: 'rgba(25, 230, 140, 0.15)',
    borderColor: '#19E68C',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#F8FAFC',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  emailHighlight: {
    color: '#19E68C',
    fontWeight: '700',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: Radius.md,
    padding: 10,
    marginBottom: Spacing.md,
    width: '100%',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12.5,
  },
  demoNoticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
    borderRadius: Radius.md,
    padding: 12,
    marginBottom: Spacing.lg,
    width: '100%',
  },
  demoNoticeText: {
    color: '#7DD3FC',
    fontSize: 12,
    lineHeight: 17,
    flex: 1,
  },
});
