import { TaskStatus } from '@prisma/client';

import { UseCase } from '@/shared/application/use-cases/use-case';
import { ErrorException } from '@/shared/infra/error/error-exception';
import { ErrorCode } from '@/shared/infra/error/error-code';

import { TaskRepository } from '@/tasks/domain/task.repository';
import { TaskEntity } from '@/tasks/domain/task.entity';
import {
  TaskOutput,
  TaskOutputMapper,
} from '@/tasks/application/dtos/task.output';

import { UserRepository } from '@/users/domain/user.repository';

interface CreateTaskUseCaseInput {
  title: string;
  description?: string;
  dueDate: Date;
  userId: string;
}

interface CreateTaskUseCaseOutput {
  task: TaskOutput;
}

export class CreateTaskUseCase
  implements UseCase<CreateTaskUseCaseInput, CreateTaskUseCaseOutput>
{
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(
    input: CreateTaskUseCaseInput,
  ): Promise<CreateTaskUseCaseOutput> {
    const user = await this.userRepository.findById(input.userId);

    if (!user) {
      throw new ErrorException(ErrorCode.NotFound, 'User not found');
    }

    const task = new TaskEntity({
      ...input,
      status: TaskStatus.PENDING,
    });

    const createdTask = await this.taskRepository
      .create(task)
      .catch((error) => {
        throw new ErrorException(
          ErrorCode.InternalServerError,
          'Error creating task: ' + error.message,
        );
      });

    return {
      task: TaskOutputMapper.fromEntity(createdTask),
    };
  }
}
