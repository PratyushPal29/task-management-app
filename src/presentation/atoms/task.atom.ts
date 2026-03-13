import { atom } from 'jotai';
import { Task, Priority } from '../../domain/entities/task.entity';

export type StatusFilter = 'all' | 'completed' | 'incomplete';
export type PriorityFilter = 'all' | Priority;

export const tasksAtom = atom<Task[]>([]);
export const taskLoadingAtom = atom<boolean>(false);
export const taskErrorAtom = atom<string | null>(null);

export const taskFilterAtom = atom<{
  priority: PriorityFilter;
  status: StatusFilter;
}>({ priority: 'all', status: 'all' });

// Derived atom — filtered + sorted tasks (Riverpod computed provider equivalent)
export const filteredTasksAtom = atom(get => {
  const tasks = get(tasksAtom);
  const filter = get(taskFilterAtom);

  return tasks
    .filter(task => {
      const priorityMatch =
        filter.priority === 'all' || task.priority === filter.priority;
      const statusMatch =
        filter.status === 'all' ||
        (filter.status === 'completed' && task.isCompleted) ||
        (filter.status === 'incomplete' && !task.isCompleted);
      return priorityMatch && statusMatch;
    })
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    );
});
