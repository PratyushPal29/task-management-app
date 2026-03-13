import { Task } from '../../entities/task.entity';
import { TaskRepository } from '../../repositories/task.repository';

export class GetTasksUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(userId: string): Promise<Task[]> {
    const tasks = await this.taskRepository.getTasks(userId);
    return tasks.sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    );
  }
}
