import { Task } from '../../entities/task.entity';
import { TaskRepository } from '../../repositories/task.repository';

export class UpdateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(id: string, updates: Partial<Task>): Promise<Task> {
    return this.taskRepository.updateTask(id, updates);
  }
}
