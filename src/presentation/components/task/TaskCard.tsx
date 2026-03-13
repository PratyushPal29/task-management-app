import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Task } from '../../../domain/entities/task.entity';
import { colors } from '../../../core/theme/colors';
import { spacing, radii, shadows } from '../../../core/theme/spacing';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string, current: boolean) => void;
  onPress: (task: Task) => void;
  onDelete: (id: string) => void;
}

const PRIORITY_COLORS: Record<string, string> = {
  high: colors.priorityHigh,
  medium: colors.priorityMedium,
  low: colors.priorityLow,
};

const PRIORITY_BG: Record<string, string> = {
  high: '#FFECF0',
  medium: '#FFF8E1',
  low: '#E8FAF6',
};

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
  });
}

const PriorityBadge: React.FC<{ priority: string }> = ({ priority }) => (
  <View
    style={[
      styles.badge,
      { backgroundColor: PRIORITY_BG[priority] },
    ]}>
    <Text style={[styles.badgeText, { color: PRIORITY_COLORS[priority] }]}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Text>
  </View>
);

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggle,
  onPress,
  onDelete,
}) => {
  const priorBorderColor = PRIORITY_COLORS[task.priority];

  return (
    <TouchableOpacity
      style={[styles.card, { borderLeftColor: priorBorderColor }]}
      onPress={() => onPress(task)}
      activeOpacity={0.75}>
      <View style={styles.row}>
        {/* Complete Toggle */}
        <TouchableOpacity
          style={[styles.circle, task.isCompleted && styles.circleDone]}
          onPress={() => onToggle(task.id, task.isCompleted)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          {task.isCompleted && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>

        {/* Content */}
        <View style={styles.content}>
          <Text
            style={[styles.title, task.isCompleted && styles.titleDone]}
            numberOfLines={1}>
            {task.title}
          </Text>
          {!!task.description && (
            <Text style={styles.description} numberOfLines={1}>
              {task.description}
            </Text>
          )}
          <Text style={styles.dueDate}>{formatDate(task.dueDate)}</Text>
        </View>

        {/* Right side */}
        <View style={styles.right}>
          <PriorityBadge priority={task.priority} />
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => onDelete(task.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={styles.deleteIcon}>🗑</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: radii.md,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
    padding: spacing.md,
    borderLeftWidth: 4,
    ...shadows.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleDone: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  content: { flex: 1 },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: colors.textDisabled,
  },
  description: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  dueDate: {
    fontSize: 11,
    color: colors.textDisabled,
    marginTop: 4,
  },
  right: {
    alignItems: 'flex-end',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radii.round,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  deleteBtn: { marginTop: 4 },
  deleteIcon: { fontSize: 15 },
});
