import { UseCase } from '@/shared/application/use-cases/use-case';
import { CollectionInput } from '@/shared/infra/dto/collection.dto';

import { TaskRepository } from '@/tasks/domain/task.repository';
import {
  TaskOutput,
  TaskOutputMapper,
} from '@/tasks/application/dtos/task.output';

interface ListTasksUseCaseInput extends CollectionInput {
  filter: {
    userId?: string;
  };
}

interface ListTasksUseCaseOutput {
  tasks: TaskOutput[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export class ListTasksUseCase
  implements UseCase<ListTasksUseCaseInput, ListTasksUseCaseOutput>
{
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(input: ListTasksUseCaseInput): Promise<ListTasksUseCaseOutput> {
    const { items, totalCount } = await this.taskRepository.findMany(
      input.filter,
      {
        page: input.page,
        pageSize: input.pageSize,
      },
    );

    return {
      tasks: TaskOutputMapper.fromMany(items),
      totalCount,
      page: input.page || 1,
      pageSize: input.pageSize || 10,
    };
  }
}
