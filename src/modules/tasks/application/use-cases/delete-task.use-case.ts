import { UseCase } from '@/shared/application/use-cases/use-case';
import { ErrorException } from '@/shared/infra/error/error-exception';
import { ErrorCode } from '@/shared/infra/error/error-code';

import { TaskRepository } from '@/tasks/domain/task.repository';

interface DeleteTaskUseCaseInput {
  id: string;
  userId: string;
}

export class DeleteTaskUseCase
  implements UseCase<DeleteTaskUseCaseInput, void>
{
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(input: DeleteTaskUseCaseInput): Promise<void> {
    const task = await this.taskRepository.findOne({
      id: input.id,
      userId: input.userId,
    });

    if (!task) {
      throw new ErrorException(ErrorCode.NotFound, 'Task not found');
    }

    task.delete();

    await this.taskRepository.update(task).catch((error) => {
      throw new ErrorException(
        ErrorCode.InternalServerError,
        'Error deleting task: ' + error.message,
      );
    });
  }
}
