import { TaskRepository } from '../../repositories/task.repository';

export class DeleteTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(id: string): Promise<void> {
    return this.taskRepository.deleteTask(id);
  }
}
