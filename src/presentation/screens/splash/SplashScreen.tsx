import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSetAtom } from 'jotai';
import { authUserAtom, authLoadingAtom, authInitializedAtom } from '../../atoms/auth.atom';
import { authRepository } from '../../../data/repositories/firebase_auth.repository.impl';
import { colors } from '../../../core/theme/colors';

interface Props {
  navigation: any;
}

export const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const setUser = useSetAtom(authUserAtom);
  const setLoading = useSetAtom(authLoadingAtom);
  const setInitialized = useSetAtom(authInitializedAtom);

  useEffect(() => {
    const unsubscribe = authRepository.onAuthStateChanged(user => {
      setUser(user);
      setLoading(false);
      setInitialized(true);
      if (user) {
        navigation.replace('Main');
      } else {
        navigation.replace('Onboarding');
      }
    });
    return unsubscribe;
  }, [navigation, setUser, setLoading, setInitialized]);

  return (
    <LinearGradient
      colors={[colors.primary, colors.primaryDark]}
      style={styles.container}>
      <View style={styles.logoBox}>
        <Text style={styles.check}>✓</Text>
      </View>
      <Text style={styles.appName}>TaskManage</Text>
      <Text style={styles.tagline}>For gig workers, by design.</Text>
      <ActivityIndicator
        color={colors.white}
        size="large"
        style={styles.loader}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoBox: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  check: { fontSize: 40, color: colors.white },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 8,
  },
  loader: { marginTop: 40 },
});
