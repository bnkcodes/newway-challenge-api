import { ErrorException } from '@/shared/infra/error/error-exception';

import { TaskEntity } from '@/tasks/domain/task.entity';
import { TaskDataBuilder } from '@/tasks/domain/testing/task-data-builder';
import { InMemoryTaskRepository } from '@/tasks/infrastructure/database/in-memory/repositories/task.repository';

import { GetTaskUseCase } from '../get-task.use-case';

describe('GetTaskUseCase', () => {
  let sut: GetTaskUseCase;
  let taskRepository: InMemoryTaskRepository;
  let task: TaskEntity;
  const userId = 'user-id';

  beforeEach(() => {
    taskRepository = new InMemoryTaskRepository();
    sut = new GetTaskUseCase(taskRepository);
    task = new TaskEntity(TaskDataBuilder({ userId }));
    taskRepository.items.push(task);
  });

  it('should get a task by id', async () => {
    const result = await sut.execute({ id: task.id, userId });

    expect(result).toBeDefined();
    expect(result.task.id).toBe(task.id);
  });

  it('should throw an error if task not found', async () => {
    const promise = sut.execute({ id: 'non-existing-id', userId });
    await expect(promise).rejects.toBeInstanceOf(ErrorException);
    await expect(promise).rejects.toThrow('Task not found');
  });

  it('should throw an error if a user tries to get a task from another user', async () => {
    const promise = sut.execute({ id: task.id, userId: 'another-user-id' });
    await expect(promise).rejects.toThrow('Task not found');
  });
});
