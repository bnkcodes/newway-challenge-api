import { TaskEntity } from '@/tasks/domain/task.entity';
import { TaskDataBuilder } from '@/tasks/domain/testing/task-data-builder';
import { InMemoryTaskRepository } from '@/tasks/infrastructure/database/in-memory/repositories/task.repository';

import { ListTasksUseCase } from '../list-tasks.use-case';

describe('ListTasksUseCase', () => {
  let sut: ListTasksUseCase;
  let taskRepository: InMemoryTaskRepository;
  const userId = 'user-id';

  beforeEach(() => {
    taskRepository = new InMemoryTaskRepository();
    sut = new ListTasksUseCase(taskRepository);
    const otherUserTask = new TaskEntity(
      TaskDataBuilder({ userId: 'another-user-id' }),
    );
    taskRepository.items.push(otherUserTask);
    for (let i = 0; i < 3; i++) {
      const task = new TaskEntity(TaskDataBuilder({ userId }));
      taskRepository.items.push(task);
    }
  });

  it('should list only tasks from the user', async () => {
    const result = await sut.execute({
      filter: { userId },
    });

    expect(result.tasks).toHaveLength(3);
    result.tasks.forEach((task) => {
      expect(task.userId).toBe(userId);
    });
  });

  it('should return paginated tasks', async () => {
    const result = await sut.execute({
      filter: { userId },
      page: 1,
      pageSize: 2,
    });

    expect(result.tasks).toHaveLength(2);
    expect(result.totalCount).toBe(3);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(2);
  });
});
