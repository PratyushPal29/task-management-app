import { StyleSheet, TextStyle } from 'react-native';
import { colors } from './colors';

export const typography = StyleSheet.create<Record<string, TextStyle>>({
  h1: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  h4: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  subtitle1: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  subtitle2: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  body1: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.textPrimary,
    lineHeight: 22,
  },
  body2: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  caption: {
    fontSize: 11,
    fontWeight: '400',
    color: colors.textDisabled,
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
