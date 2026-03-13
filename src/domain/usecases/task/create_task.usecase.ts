import { Task } from '../../entities/task.entity';
import { TaskRepository } from '../../repositories/task.repository';

export class CreateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    return this.taskRepository.createTask(task);
  }
}
