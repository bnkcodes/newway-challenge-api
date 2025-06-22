import { UseCase } from '@/shared/application/use-cases/use-case';
import { ErrorException } from '@/shared/infra/error/error-exception';
import { ErrorCode } from '@/shared/infra/error/error-code';

import { TaskRepository } from '@/tasks/domain/task.repository';
import {
  TaskOutput,
  TaskOutputMapper,
} from '@/tasks/application/dtos/task.output';

interface GetTaskUseCaseInput {
  id: string;
  userId?: string;
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
      .findOne({ id: input.id, userId: input.userId })
      .catch((error) => {
        throw new ErrorException(
          ErrorCode.InternalServerError,
          'Error getting task: ' + error.message,
        );
      });

    if (!task) {
      throw new ErrorException(ErrorCode.NotFound, 'Task not found');
    }

    return {
      task: TaskOutputMapper.fromEntity(task),
    };
  }
}
