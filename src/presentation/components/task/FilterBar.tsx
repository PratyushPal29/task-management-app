import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useAtom } from 'jotai';
import { taskFilterAtom, PriorityFilter, StatusFilter } from '../../atoms/task.atom';
import { colors } from '../../../core/theme/colors';
import { spacing, radii } from '../../../core/theme/spacing';

const PRIORITY_OPTIONS: { label: string; value: PriorityFilter }[] = [
  { label: 'All', value: 'all' },
  { label: '🔴 High', value: 'high' },
  { label: '🟡 Medium', value: 'medium' },
  { label: '🟢 Low', value: 'low' },
];

const STATUS_OPTIONS: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'all' },
  { label: '✅ Done', value: 'completed' },
  { label: '⏳ Pending', value: 'incomplete' },
];

export const FilterBar: React.FC = () => {
  const [filter, setFilter] = useAtom(taskFilterAtom);

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}>
        {PRIORITY_OPTIONS.map(opt => (
          <TouchableOpacity
            key={opt.value}
            style={[
              styles.chip,
              filter.priority === opt.value && styles.chipActive,
            ]}
            onPress={() => setFilter(f => ({ ...f, priority: opt.value }))}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.chipText,
                filter.priority === opt.value && styles.chipTextActive,
              ]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
        <View style={styles.divider} />
        {STATUS_OPTIONS.map(opt => (
          <TouchableOpacity
            key={opt.value}
            style={[
              styles.chip,
              filter.status === opt.value && styles.chipActive,
            ]}
            onPress={() => setFilter(f => ({ ...f, status: opt.value }))}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.chipText,
                filter.status === opt.value && styles.chipTextActive,
              ]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  row: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radii.round,
    backgroundColor: colors.primaryBg,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.white,
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: colors.border,
    marginHorizontal: spacing.xs,
  },
});
