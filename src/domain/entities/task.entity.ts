export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: Priority;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
