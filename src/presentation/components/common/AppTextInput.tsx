import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { colors } from '../../../core/theme/colors';
import { spacing, radii } from '../../../core/theme/spacing';

interface AppTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  rightAction?: { label: string; onPress: () => void };
  isPassword?: boolean;
}

export const AppTextInput: React.FC<AppTextInputProps> = ({
  label,
  error,
  rightAction,
  isPassword,
  style,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);
  const isMultiline = rest.multiline;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputWrapper,
          isMultiline && styles.inputWrapperMultiline,
          focused && styles.inputFocused,
          !!error && styles.inputError,
        ]}>
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={colors.textDisabled}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(s => !s)}
            style={styles.eyeButton}>
            <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁'}</Text>
          </TouchableOpacity>
        )}
        {rightAction && (
          <TouchableOpacity onPress={rightAction.onPress}>
            <Text style={styles.rightActionText}>{rightAction.label}</Text>
          </TouchableOpacity>
        )}
      </View>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryBg,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 52,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  inputWrapperMultiline: {
    alignItems: 'flex-start',
  },
  inputFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  inputError: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '400',
  },
  eyeButton: { padding: spacing.xs },
  eyeText: { fontSize: 16 },
  rightActionText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: spacing.xs,
  },
});
