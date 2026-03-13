import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ListRenderItem,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  tasksAtom,
  filteredTasksAtom,
  taskLoadingAtom,
  taskFilterAtom,
} from '../../atoms/task.atom';
import { authUserAtom } from '../../atoms/auth.atom';
import { auth } from '../../../core/config/firebase';
import { taskRepository } from '../../../data/repositories/firestore_task.repository.impl';
import { authRepository } from '../../../data/repositories/firebase_auth.repository.impl';
import { DeleteTaskUseCase } from '../../../domain/usecases/task/delete_task.usecase';
import { ToggleTaskUseCase } from '../../../domain/usecases/task/toggle_task.usecase';
import { Task } from '../../../domain/entities/task.entity';
import { TaskCard } from '../../components/task/TaskCard';
import { FilterBar } from '../../components/task/FilterBar';
import { EmptyTaskList } from '../../components/task/EmptyTaskList';
import { colors } from '../../../core/theme/colors';
import { spacing, radii, shadows } from '../../../core/theme/spacing';

const deleteUseCase = new DeleteTaskUseCase(taskRepository);
const toggleUseCase = new ToggleTaskUseCase(taskRepository);

function getDateLabel(date: Date): string {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const weekLater = new Date(today);
  weekLater.setDate(today.getDate() + 7);

  const d = new Date(date);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  if (d <= weekLater) return 'This Week';
  return 'Later';
}

interface SectionData {
  title: string;
  data: Task[];
}

function groupTasksByDate(tasks: Task[]): SectionData[] {
  const groups: Record<string, Task[]> = {};
  const ORDER = ['Today', 'Tomorrow', 'This Week', 'Later'];

  tasks.forEach(task => {
    const label = getDateLabel(task.dueDate);
    if (!groups[label]) groups[label] = [];
    groups[label].push(task);
  });

  return ORDER.filter(key => groups[key]).map(key => ({
    title: key,
    data: groups[key],
  }));
}

interface Props {
  navigation: any;
}

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  // authUserAtom may be null briefly on relaunch (before onAuthStateChanged fires).
  // Fall back to auth.currentUser directly so the Firestore subscription
  // never misses a valid userId due to the race condition.
  const atomUser = useAtomValue(authUserAtom);
  const setAtomUser = useSetAtom(authUserAtom);
  const setTasks = useSetAtom(tasksAtom);
  const setLoading = useSetAtom(taskLoadingAtom);
  const filteredTasks = useAtomValue(filteredTasksAtom);
  const filter = useAtomValue(taskFilterAtom);

  // Sync auth.currentUser into the atom if it isn't set yet
  const firebaseUser = auth.currentUser;
  const user = atomUser ?? (firebaseUser
    ? { uid: firebaseUser.uid, email: firebaseUser.email, displayName: firebaseUser.displayName }
    : null);

  // Keep the atom in sync
  useEffect(() => {
    if (!atomUser && firebaseUser) {
      setAtomUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
      });
    }
  }, [atomUser, firebaseUser, setAtomUser]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const unsubscribe = taskRepository.subscribeToTasks(user.uid, tasks => {
      setTasks(tasks);
      setLoading(false);
    });
    return unsubscribe;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid, setTasks, setLoading]);

  const handleToggle = useCallback(async (id: string, current: boolean) => {
    try {
      await toggleUseCase.execute(id, !current);
    } catch (e) {
      Alert.alert('Error', 'Failed to update task.');
    }
  }, []);

  const handleDelete = useCallback((id: string) => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteUseCase.execute(id);
          } catch (e) {
            Alert.alert('Error', 'Failed to delete task.');
          }
        },
      },
    ]);
  }, []);

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await authRepository.logout();
          navigation.replace('Onboarding');
        },
      },
    ]);
  };

  const isFiltered = filter.priority !== 'all' || filter.status !== 'all';
  const sections = groupTasksByDate(filteredTasks);

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  // Flatten for FlatList with headers
  type ListItem =
    | { type: 'header'; title: string }
    | { type: 'task'; task: Task };

  const listData: ListItem[] = [];
  sections.forEach(section => {
    listData.push({ type: 'header', title: section.title });
    section.data.forEach(task => listData.push({ type: 'task', task }));
  });

  const renderItem: ListRenderItem<ListItem> = ({ item }) => {
    if (item.type === 'header') {
      return <Text style={styles.sectionHeader}>{item.title}</Text>;
    }
    return (
      <TaskCard
        task={item.task}
        onToggle={handleToggle}
        onPress={t => navigation.navigate('AddEditTask', { task: t })}
        onDelete={handleDelete}
      />
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientEnd]}
        style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.gridIcon}>
            <Text style={styles.gridIconText}>⊞</Text>
          </View>
          <TouchableOpacity style={styles.menuBtn} onPress={handleLogout}>
            <Text style={styles.menuText}>···</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.dateText}>{dateStr}</Text>
        <Text style={styles.headerTitle}>My tasks</Text>
      </LinearGradient>

      {/* Filter Bar */}
      <FilterBar />

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <EmptyTaskList filtered={isFiltered} />
      ) : (
        <FlatList
          data={listData}
          keyExtractor={(item, idx) =>
            item.type === 'header' ? `header-${item.title}` : item.task.id
          }
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddEditTask', { task: null })}
        activeOpacity={0.85}>
        <LinearGradient
          colors={[colors.gradientStart, colors.gradientEnd]}
          style={styles.fabGradient}>
          <Text style={styles.fabIcon}>+</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingTop: 50,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.md,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    gap: spacing.sm,
    justifyContent: "space-between"
  },
  gridIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridIconText: { color: colors.white, fontSize: 18 },
  searchBar: {
    flex: 1,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: radii.round,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  searchPlaceholder: { color: colors.textDisabled, fontSize: 13 },
  menuBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: { color: colors.white, fontSize: 18, letterSpacing: 1 },
  dateText: { color: 'rgba(255,255,255,0.75)', fontSize: 13, marginBottom: 2 },
  headerTitle: {
    color: colors.white,
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  listContent: { paddingBottom: 100 },
  fab: {
    position: 'absolute',
    bottom: 32,
    alignSelf: 'center',
    borderRadius: 28,
    overflow: 'hidden',
    ...shadows.fab,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabIcon: { color: colors.white, fontSize: 28, fontWeight: '300', lineHeight: 32 },
});
