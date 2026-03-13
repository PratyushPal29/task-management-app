import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../../core/config/firebase';
import { Task } from '../../domain/entities/task.entity';
import { TaskRepository } from '../../domain/repositories/task.repository';
import { taskFromFirestore, taskToFirestore } from '../models/task.model';

const TASKS_COLLECTION = 'tasks';

export class FirestoreTaskRepositoryImpl implements TaskRepository {
  private tasksRef = collection(db, TASKS_COLLECTION);

  async getTasks(userId: string): Promise<Task[]> {
    // No orderBy: avoids requiring a composite Firestore index.
    // Sorting is handled client-side in filteredTasksAtom.
    const q = query(this.tasksRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => taskFromFirestore(d.id, d.data() as any));
  }

  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const data = taskToFirestore(task);
    const docRef = await addDoc(this.tasksRef, data);
    return taskFromFirestore(docRef.id, data as any);
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const docRef = doc(db, TASKS_COLLECTION, id);
    const updateData: Record<string, any> = { ...updates, updatedAt: Timestamp.now() };
    if (updates.dueDate) {
      updateData.dueDate = Timestamp.fromDate(updates.dueDate);
    }
    await updateDoc(docRef, updateData);
    const tasks = await this.getTasks(updates.userId ?? '');
    return tasks.find(t => t.id === id)!;
  }

  async deleteTask(id: string): Promise<void> {
    const docRef = doc(db, TASKS_COLLECTION, id);
    await deleteDoc(docRef);
  }

  async toggleComplete(id: string, isCompleted: boolean): Promise<void> {
    const docRef = doc(db, TASKS_COLLECTION, id);
    await updateDoc(docRef, { isCompleted, updatedAt: Timestamp.now() });
  }

  subscribeToTasks(userId: string, callback: (tasks: Task[]) => void): () => void {
    // No orderBy: avoids requiring a composite Firestore index.
    // Sorting is handled client-side in filteredTasksAtom.
    const q = query(this.tasksRef, where('userId', '==', userId));
    return onSnapshot(
      q,
      snapshot => {
        const tasks = snapshot.docs.map(d =>
          taskFromFirestore(d.id, d.data() as any),
        );
        callback(tasks);
      },
      error => {
        console.error('[Firestore] subscribeToTasks error:', error);
      },
    );
  }
}

export const taskRepository = new FirestoreTaskRepositoryImpl();
