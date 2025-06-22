import { UserRole } from '@prisma/client';

import { UseCase } from '@/shared/application/use-cases/use-case';
import { ErrorException } from '@/shared/infra/error/error-exception';
import { ErrorCode } from '@/shared/infra/error/error-code';
import { validateTaskOwnership } from '@/shared/utils/validate-ownership';

import { TaskRepository } from '@/tasks/domain/task.repository';
import {
  TaskOutput,
  TaskOutputMapper,
} from '@/tasks/application/dtos/task.output';

interface GetTaskUseCaseInput {
  id: string;
  userId: string;
  userRole: UserRole;
}

interface GetTaskUseCaseOutput {
  task: TaskOutput;
}

export class GetTaskUseCase
  implements UseCase<GetTaskUseCaseInput, GetTaskUseCaseOutput>
{
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(input: GetTaskUseCaseInput): Promise<GetTaskUseCaseOutput> {
    const task = await this.taskRepository
      .findOne({ id: input.id })
      .catch((error) => {
        throw new ErrorException(
          ErrorCode.InternalServerError,
          'Error getting task: ' + error.message,
        );
      });

    if (!task) {
      throw new ErrorException(ErrorCode.NotFound, 'Task not found');
    }

    if (input.userRole === UserRole.USER) {
      validateTaskOwnership(input.userId, task);
    }

    return {
      task: TaskOutputMapper.fromEntity(task),
    };
  }
}
