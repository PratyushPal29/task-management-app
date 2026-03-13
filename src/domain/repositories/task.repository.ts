import { Task } from '../entities/task.entity';

export interface TaskRepository {
  getTasks(userId: string): Promise<Task[]>;
  createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task>;
  updateTask(id: string, updates: Partial<Task>): Promise<Task>;
  deleteTask(id: string): Promise<void>;
  toggleComplete(id: string, isCompleted: boolean): Promise<void>;
  subscribeToTasks(userId: string, callback: (tasks: Task[]) => void): () => void;
}
