import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../../../core/theme/colors';
import { spacing, radii } from '../../../core/theme/spacing';

const { width, height } = Dimensions.get('window');

interface Props {
  navigation: any;
}

export const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Background blob */}
      <View style={styles.blob} />

      {/* Logo */}
      <View style={styles.logoWrapper}>
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          style={styles.logoBox}>
          <Text style={styles.logoCheck}>✓</Text>
        </LinearGradient>
        {/* Decorative dots */}
        <View style={[styles.dot, { width: 10, height: 10, top: 0, right: -20, backgroundColor: '#FFC107' }]} />
        <View style={[styles.dot, { width: 14, height: 14, bottom: 0, left: -24, backgroundColor: colors.secondary }]} />
        <View style={[styles.dot, { width: 8, height: 8, top: 20, left: -16, backgroundColor: colors.primary, opacity: 0.4 }]} />
      </View>

      {/* Copy */}
      <Text style={styles.headline}>Get things done.</Text>
      <Text style={styles.sub}>Just a click away from{'\n'}planning your tasks.</Text>

      {/* Dots indicator */}
      <View style={styles.dotsRow}>
        <View style={styles.dotIndicatorActive} />
        <View style={styles.dotIndicator} />
      </View>

      {/* Arrow CTA */}
      <TouchableOpacity
        style={styles.arrowBtn}
        onPress={() => navigation.navigate('Login')}
        activeOpacity={0.85}>
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          style={styles.arrowGradient}>
          <Text style={styles.arrowText}>→</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blob: {
    position: 'absolute',
    bottom: -60,
    left: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: colors.primaryBg,
    opacity: 0.8,
  },
  logoWrapper: {
    position: 'relative',
    marginBottom: spacing.xl,
  },
  logoBox: {
    width: 90,
    height: 90,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoCheck: {
    fontSize: 44,
    color: colors.white,
    fontWeight: '700',
  },
  dot: {
    position: 'absolute',
    borderRadius: 999,
  },
  headline: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: spacing.sm,
  },
  sub: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: spacing.xxl,
  },
  dotIndicatorActive: {
    width: 24,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  dotIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primaryBg,
  },
  arrowBtn: {
    borderRadius: 999,
    overflow: 'hidden',
  },
  arrowGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    color: colors.white,
    fontSize: 26,
    fontWeight: '600',
  },
});
