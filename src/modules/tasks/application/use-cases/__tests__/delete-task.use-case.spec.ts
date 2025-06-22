import { ErrorException } from '@/shared/infra/error/error-exception';

import { TaskEntity } from '@/tasks/domain/task.entity';
import { TaskDataBuilder } from '@/tasks/domain/testing/task-data-builder';
import { InMemoryTaskRepository } from '@/tasks/infrastructure/database/in-memory/repositories/task.repository';

import { DeleteTaskUseCase } from '../delete-task.use-case';

describe('DeleteTaskUseCase', () => {
  let sut: DeleteTaskUseCase;
  let taskRepository: InMemoryTaskRepository;
  let task: TaskEntity;
  const userId = 'user-id';

  beforeEach(() => {
    taskRepository = new InMemoryTaskRepository();
    sut = new DeleteTaskUseCase(taskRepository);
    task = new TaskEntity(TaskDataBuilder({ userId }));
    taskRepository.items.push(task);
  });

  it('should soft delete a task', async () => {
    await sut.execute({ id: task.id, userId });

    expect(taskRepository.items[0].deletedAt).toBeInstanceOf(Date);
  });

  it('should throw an error if task not found', async () => {
    const promise = sut.execute({ id: 'non-existing-id', userId });
    await expect(promise).rejects.toBeInstanceOf(ErrorException);
    await expect(promise).rejects.toThrow('Task not found');
  });

  it('should throw an error when trying to delete a task from another user', async () => {
    const promise = sut.execute({ id: task.id, userId: 'another-user-id' });
    await expect(promise).rejects.toThrow('Task not found');
  });
});
