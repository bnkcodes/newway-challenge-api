import { TaskStatus, UserRole } from '@prisma/client';

import { UseCase } from '@/shared/application/use-cases/use-case';
import { ErrorException } from '@/shared/infra/error/error-exception';
import { ErrorCode } from '@/shared/infra/error/error-code';
import { validateTaskOwnership } from '@/shared/utils/validate-ownership';

import { TaskRepository } from '@/tasks/domain/task.repository';
import {
  TaskOutput,
  TaskOutputMapper,
} from '@/tasks/application/dtos/task.output';

interface UpdateTaskUseCaseInput {
  id: string;
  userId: string;
  userRole: UserRole;
  title?: string;
  description?: string;
  status?: TaskStatus;
  dueDate?: Date;
}

interface UpdateTaskUseCaseOutput {
  task: TaskOutput;
}

export class UpdateTaskUseCase
  implements UseCase<UpdateTaskUseCaseInput, UpdateTaskUseCaseOutput>
{
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(
    input: UpdateTaskUseCaseInput,
  ): Promise<UpdateTaskUseCaseOutput> {
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

    task.update({
      title: input.title,
      description: input.description,
      status: input.status,
      dueDate: input.dueDate,
    });

    await this.taskRepository.update(task).catch((error) => {
      throw new ErrorException(
        ErrorCode.InternalServerError,
        'Error updating task: ' + error.message,
      );
    });

    return {
      task: TaskOutputMapper.fromEntity(task),
    };
  }
}
