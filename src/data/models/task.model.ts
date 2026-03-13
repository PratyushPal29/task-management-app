import { Task, Priority } from '../../domain/entities/task.entity';
import { Timestamp } from 'firebase/firestore';

export interface TaskModel {
  id: string;
  userId: string;
  title: string;
  description: string;
  dueDate: Timestamp;
  priority: Priority;
  isCompleted: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export function taskFromFirestore(
  id: string,
  data: Omit<TaskModel, 'id'>,
): Task {
  return {
    id,
    userId: data.userId,
    title: data.title,
    description: data.description,
    dueDate: data.dueDate?.toDate() ?? new Date(),
    priority: data.priority,
    isCompleted: data.isCompleted,
    createdAt: data.createdAt?.toDate() ?? new Date(),
    updatedAt: data.updatedAt?.toDate() ?? new Date(),
  };
}

export function taskToFirestore(
  task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>,
): Omit<TaskModel, 'id'> {
  return {
    userId: task.userId,
    title: task.title,
    description: task.description,
    dueDate: Timestamp.fromDate(task.dueDate),
    priority: task.priority,
    isCompleted: task.isCompleted,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}
