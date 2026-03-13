import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSetAtom } from 'jotai';
import { authUserAtom } from '../../atoms/auth.atom';
import { authRepository } from '../../../data/repositories/firebase_auth.repository.impl';
import { RegisterUseCase } from '../../../domain/usecases/auth/auth.usecases';
import { AppButton } from '../../components/common/AppButton';
import { AppTextInput } from '../../components/common/AppTextInput';
import { colors } from '../../../core/theme/colors';
import { spacing } from '../../../core/theme/spacing';

const registerUseCase = new RegisterUseCase(authRepository);

interface Props {
  navigation: any;
}

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');

  const setUser = useSetAtom(authUserAtom);

  const validate = () => {
    let valid = true;
    if (!email.trim()) { setEmailError('Email is required'); valid = false; }
    else if (!/\S+@\S+\.\S+/.test(email)) { setEmailError('Enter a valid email'); valid = false; }
    else setEmailError('');
    if (!password) { setPasswordError('Password is required'); valid = false; }
    else if (password.length < 6) { setPasswordError('Min 6 characters'); valid = false; }
    else setPasswordError('');
    if (password !== confirmPassword) { setConfirmError('Passwords do not match'); valid = false; }
    else setConfirmError('');
    return valid;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const user = await registerUseCase.execute(email, password);
      setUser(user);
      navigation.replace('Main');
    } catch (error: any) {
      const msg =
        error.code === 'auth/email-already-in-use'
          ? 'This email is already registered. Please log in.'
          : error.code === 'auth/invalid-email'
          ? 'Invalid email address.'
          : error.message || 'Registration failed. Please try again.';
      Alert.alert('Registration Failed', msg);
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
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          style={styles.logoBox}>
          <Text style={styles.logoCheck}>✓</Text>
        </LinearGradient>

        <Text style={styles.title}>Let's get started!</Text>
        <Text style={styles.subtitle}>Create your account</Text>

        <View style={styles.form}>
          <AppTextInput
            label="Email Address"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={emailError}
          />
          <AppTextInput
            label="Password"
            placeholder="Min 6 characters"
            value={password}
            onChangeText={setPassword}
            isPassword
            error={passwordError}
          />
          <AppTextInput
            label="Confirm Password"
            placeholder="Repeat your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            isPassword
            error={confirmError}
          />

          <AppButton
            label="Sign up"
            onPress={handleRegister}
            loading={loading}
            style={styles.btn}
          />

          <View style={styles.switchRow}>
            <Text style={styles.switchText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.switchLink}>Log in</Text>
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
  btn: { marginTop: spacing.sm, marginBottom: spacing.lg },
  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xs },
  switchText: { color: colors.textSecondary, fontSize: 14 },
  switchLink: { color: colors.primary, fontSize: 14, fontWeight: '700' },
});
