import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSetAtom } from 'jotai';
import { tasksAtom } from '../../atoms/task.atom';
import { authUserAtom } from '../../atoms/auth.atom';
import { useAtomValue } from 'jotai';
import { taskRepository } from '../../../data/repositories/firestore_task.repository.impl';
import { CreateTaskUseCase } from '../../../domain/usecases/task/create_task.usecase';
import { UpdateTaskUseCase } from '../../../domain/usecases/task/update_task.usecase';
import { Task, Priority } from '../../../domain/entities/task.entity';
import { AppButton } from '../../components/common/AppButton';
import { AppTextInput } from '../../components/common/AppTextInput';
import { colors } from '../../../core/theme/colors';
import { spacing, radii, shadows } from '../../../core/theme/spacing';

const createUseCase = new CreateTaskUseCase(taskRepository);
const updateUseCase = new UpdateTaskUseCase(taskRepository);

const PRIORITIES: { label: string; value: Priority; color: string; bg: string }[] = [
  { label: '🔴 High', value: 'high', color: colors.priorityHigh, bg: '#FFECF0' },
  { label: '🟡 Medium', value: 'medium', color: colors.priorityMedium, bg: '#FFF8E1' },
  { label: '🟢 Low', value: 'low', color: colors.priorityLow, bg: '#E8FAF6' },
];

interface Props {
  navigation: any;
  route: any;
}

export const AddEditTaskScreen: React.FC<Props> = ({ navigation, route }) => {
  const editTask: Task | null = route.params?.task ?? null;
  const isEdit = !!editTask;

  const user = useAtomValue(authUserAtom);
  const [title, setTitle] = useState(editTask?.title ?? '');
  const [description, setDescription] = useState(editTask?.description ?? '');
  const [dueDate, setDueDate] = useState<Date>(editTask?.dueDate ? new Date(editTask.dueDate) : new Date());
  const [priority, setPriority] = useState<Priority>(editTask?.priority ?? 'medium');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [titleError, setTitleError] = useState('');

  const validate = () => {
    if (!title.trim()) {
      setTitleError('Task title is required');
      return false;
    }
    setTitleError('');
    return true;
  };

  const handleSave = async () => {
    if (!validate() || !user) return;
    setLoading(true);
    try {
      if (isEdit && editTask) {
        await updateUseCase.execute(editTask.id, {
          title: title.trim(),
          description: description.trim(),
          dueDate,
          priority,
          userId: user.uid,
        });
      } else {
        await createUseCase.execute({
          userId: user.uid,
          title: title.trim(),
          description: description.trim(),
          dueDate,
          priority,
          isCompleted: false,
        });
      }
      navigation.goBack();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEdit ? 'Edit Task' : 'New Task'}
        </Text>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        {/* Title */}
        <AppTextInput
          label="Task Title *"
          placeholder="What do you need to do?"
          value={title}
          onChangeText={setTitle}
          error={titleError}
        />

        {/* Description */}
        <AppTextInput
          label="Description"
          placeholder="Add more details (optional)"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          style={styles.textArea}
        />

        {/* Due Date */}
        <Text style={styles.fieldLabel}>DUE DATE</Text>
        <TouchableOpacity
          style={styles.dateBox}
          onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateIcon}>📅</Text>
          <Text style={styles.dateText}>{formatDate(dueDate)}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={dueDate}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={(_, date) => {
              setShowDatePicker(Platform.OS === 'ios');
              if (date) setDueDate(date);
            }}
          />
        )}

        {/* Priority */}
        <Text style={[styles.fieldLabel, { marginTop: spacing.md }]}>PRIORITY</Text>
        <View style={styles.priorityRow}>
          {PRIORITIES.map(p => (
            <TouchableOpacity
              key={p.value}
              style={[
                styles.priorityChip,
                priority === p.value && {
                  backgroundColor: p.bg,
                  borderColor: p.color,
                },
              ]}
              onPress={() => setPriority(p.value)}
              activeOpacity={0.7}>
              <Text
                style={[
                  styles.priorityChipText,
                  priority === p.value && { color: p.color, fontWeight: '700' },
                ]}>
                {p.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Save Button */}
        <AppButton
          label={isEdit ? 'Update Task' : 'Create Task'}
          onPress={handleSave}
          loading={loading}
          style={styles.saveBtn}
        />

        {isEdit && (
          <AppButton
            label="Cancel"
            onPress={() => navigation.goBack()}
            variant="outlined"
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingTop: 50,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.md,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backBtn: { marginBottom: spacing.xs },
  backText: { color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: '500' },
  headerTitle: {
    color: colors.white,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  content: {
    padding: spacing.md,
    paddingTop: spacing.lg,
  },
  textArea: { height: 80, textAlignVertical: 'top', paddingTop: spacing.sm },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  dateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryBg,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  dateIcon: { fontSize: 18 },
  dateText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
    flexWrap: 'wrap',
  },
  priorityChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radii.round,
    backgroundColor: colors.primaryBg,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  priorityChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  saveBtn: { marginBottom: spacing.sm },
});
