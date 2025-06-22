import { TaskStatus } from '@prisma/client';

import { ErrorException } from '@/shared/infra/error/error-exception';
import { TaskEntity } from '@/tasks/domain/task.entity';
import { TaskDataBuilder } from '@/tasks/domain/testing/task-data-builder';

import { InMemoryTaskRepository } from '@/tasks/infrastructure/database/in-memory/repositories/task.repository';

import { UpdateTaskUseCase } from '../update-task.use-case';

describe('UpdateTaskUseCase', () => {
  let sut: UpdateTaskUseCase;
  let taskRepository: InMemoryTaskRepository;
  let task: TaskEntity;
  const userId = 'user-id';

  beforeEach(() => {
    taskRepository = new InMemoryTaskRepository();
    sut = new UpdateTaskUseCase(taskRepository);
    task = new TaskEntity(TaskDataBuilder({ userId }));
    taskRepository.items.push(task);
  });

  it('should update a task', async () => {
    const input = {
      id: task.id,
      userId,
      title: 'Updated Title',
      description: 'Updated Description',
      status: TaskStatus.COMPLETED,
    };

    const result = await sut.execute(input);

    expect(result.task.title).toBe(input.title);
    expect(result.task.description).toBe(input.description);
    expect(result.task.status).toBe(input.status);
    expect(taskRepository.items[0].title).toBe(input.title);
  });

  it('should throw an error if task not found', async () => {
    const promise = sut.execute({
      id: 'non-existing-id',
      userId,
      title: 'any',
    });
    await expect(promise).rejects.toBeInstanceOf(ErrorException);
    await expect(promise).rejects.toThrow('Task not found');
  });

  it('should throw an error when trying to update a task from another user', async () => {
    const promise = sut.execute({
      id: task.id,
      userId: 'another-user-id',
      title: 'any',
    });
    await expect(promise).rejects.toThrow('Task not found');
  });
});
