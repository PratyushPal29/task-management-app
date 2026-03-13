import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSetAtom } from 'jotai';
import { authUserAtom, authLoadingAtom } from '../../atoms/auth.atom';
import { authRepository } from '../../../data/repositories/firebase_auth.repository.impl';
import { LoginUseCase } from '../../../domain/usecases/auth/auth.usecases';
import { AppButton } from '../../components/common/AppButton';
import { AppTextInput } from '../../components/common/AppTextInput';
import { colors } from '../../../core/theme/colors';
import { spacing, radii } from '../../../core/theme/spacing';

const loginUseCase = new LoginUseCase(authRepository);

interface Props {
  navigation: any;
}

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [authError, setAuthError] = useState('');

  const setUser = useSetAtom(authUserAtom);
  const setAuthLoading = useSetAtom(authLoadingAtom);

  const clearErrors = () => {
    setEmailError('');
    setPasswordError('');
    setAuthError('');
  };

  const validate = () => {
    let valid = true;
    if (!email.trim()) {
      setEmailError('Email is required');
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Enter a valid email');
      valid = false;
    } else {
      setEmailError('');
    }
    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Min 6 characters');
      valid = false;
    } else {
      setPasswordError('');
    }
    return valid;
  };

  const handleLogin = async () => {
    setAuthError('');
    if (!validate()) return;
    setLoading(true);
    try {
      const user = await loginUseCase.execute(email, password);
      setUser(user);
      navigation.replace('Main');
    } catch (error: any) {
      const msg =
        error.code === 'auth/user-not-found' ||
          error.code === 'auth/wrong-password' ||
          error.code === 'auth/invalid-credential'
          ? 'Incorrect email or password. Please try again.'
          : error.code === 'auth/too-many-requests'
            ? 'Too many failed attempts. Please wait a moment and try again.'
            : error.code === 'auth/user-disabled'
              ? 'This account has been disabled. Please contact support.'
              : error.code === 'auth/network-request-failed'
                ? 'Network error. Please check your connection.'
                : error.message || 'Login failed. Please try again.';

      setEmailError(' ');
      setPasswordError(' ');
      setAuthError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled">
        {/* Logo */}
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          style={styles.logoBox}>
          <Text style={styles.logoCheck}>✓</Text>
        </LinearGradient>

        <Text style={styles.title}>Welcome back!</Text>
        <Text style={styles.subtitle}>Log in to continue</Text>

        <View style={styles.form}>
          <AppTextInput
            label="Email Address"
            placeholder="you@example.com"
            value={email}
            onChangeText={t => { setEmail(t); clearErrors(); }}
            keyboardType="email-address"
            autoCapitalize="none"
            error={emailError}
          />
          <AppTextInput
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={t => { setPassword(t); clearErrors(); }}
            isPassword
            error={passwordError}
            rightAction={{ label: 'Forgot?', onPress: () => { } }}
          />

          {/* Inline auth error — shown instead of a modal Alert */}
          {!!authError && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorBannerText}>{authError}</Text>
            </View>
          )}

          <AppButton
            label="Log in"
            onPress={handleLogin}
            loading={loading}
            style={styles.btn}
          />

          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.switchLink}>Get started!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.white },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logoCheck: { fontSize: 40, color: colors.white },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    letterSpacing: -0.5,
  },
  subtitle: { fontSize: 15, color: colors.textSecondary, marginBottom: spacing.xl },
  form: { width: '100%' },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF0F0',
    borderWidth: 1.5,
    borderColor: colors.error,
    borderRadius: radii.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    gap: 6,
  },
  errorIcon: { fontSize: 14, lineHeight: 20 },
  errorBannerText: {
    flex: 1,
    color: colors.error,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 20,
  },
  btn: { marginTop: spacing.sm, marginBottom: spacing.lg },
  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xs },
  switchText: { color: colors.textSecondary, fontSize: 14 },
  switchLink: { color: colors.primary, fontSize: 14, fontWeight: '700' },
});
