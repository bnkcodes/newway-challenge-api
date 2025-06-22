import { UserRole } from '@prisma/client';

import { validateTaskOwnership } from '@/shared/utils/validate-ownership';
import { UseCase } from '@/shared/application/use-cases/use-case';
import { ErrorException } from '@/shared/infra/error/error-exception';
import { ErrorCode } from '@/shared/infra/error/error-code';

import { TaskRepository } from '@/tasks/domain/task.repository';

interface DeleteTaskUseCaseInput {
  id: string;
  userId: string;
  userRole: UserRole;
}

export class DeleteTaskUseCase
  implements UseCase<DeleteTaskUseCaseInput, void>
{
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(input: DeleteTaskUseCaseInput): Promise<void> {
    const task = await this.taskRepository.findOne({ id: input.id });

    if (!task) {
      throw new ErrorException(ErrorCode.NotFound, 'Task not found');
    }

    if (input.userRole === UserRole.USER) {
      validateTaskOwnership(input.userId, task);
    }

    await this.taskRepository.delete({ id: input.id }).catch((error) => {
      throw new ErrorException(
        ErrorCode.InternalServerError,
        'Error deleting task: ' + error.message,
      );
    });
  }
}
