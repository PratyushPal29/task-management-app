import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../core/theme/colors';
import { spacing } from '../../../core/theme/spacing';

export const EmptyTaskList: React.FC<{ filtered?: boolean }> = ({ filtered }) => (
  <View style={styles.container}>
    <Text style={styles.icon}>{filtered ? '🔍' : '📋'}</Text>
    <Text style={styles.title}>
      {filtered ? 'No tasks found' : 'No tasks yet'}
    </Text>
    <Text style={styles.subtitle}>
      {filtered
        ? 'Try adjusting your filters'
        : 'Tap the + button to create your first task'}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
  },
  icon: { fontSize: 56, marginBottom: spacing.md },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
