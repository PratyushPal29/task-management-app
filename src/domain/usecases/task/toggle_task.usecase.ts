import { TaskRepository } from '../../repositories/task.repository';

export class ToggleTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(id: string, isCompleted: boolean): Promise<void> {
    return this.taskRepository.toggleComplete(id, isCompleted);
  }
}
