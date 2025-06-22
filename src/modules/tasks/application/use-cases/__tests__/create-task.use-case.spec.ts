import { ErrorException } from '@/shared/infra/error/error-exception';

import { UserEntity } from '@/users/domain/user.entity';
import { UserDataBuilder } from '@/users/domain/testing/user-data-builder';
import { InMemoryUserRepository } from '@/users/infrastructure/database/in-memory/repositories/user.repository';

import { InMemoryTaskRepository } from '@/tasks/infrastructure/database/in-memory/repositories/task.repository';

import { CreateTaskUseCase } from '../create-task.use-case';

describe('CreateTaskUseCase', () => {
  let sut: CreateTaskUseCase;
  let taskRepository: InMemoryTaskRepository;
  let userRepository: InMemoryUserRepository;
  let user: UserEntity;

  beforeEach(() => {
    taskRepository = new InMemoryTaskRepository();
    userRepository = new InMemoryUserRepository();
    sut = new CreateTaskUseCase(taskRepository, userRepository);
    user = new UserEntity(UserDataBuilder({}));
    userRepository.items.push(user);
  });

  it('should create a new task', async () => {
    const input = {
      title: 'Test Task',
      description: 'Test Description',
      dueDate: new Date(),
      userId: user.id,
    };

    const result = await sut.execute(input);

    expect(result).toBeDefined();
    expect(taskRepository.items).toHaveLength(1);
    expect(taskRepository.items[0].title).toBe(input.title);
    expect(taskRepository.items[0].userId).toBe(user.id);
  });

  it('should throw an error if user does not exist', async () => {
    const input = {
      title: 'Test Task',
      description: 'Test Description',
      dueDate: new Date(),
      userId: 'non-existing-user-id',
    };

    await expect(sut.execute(input)).rejects.toThrow(ErrorException);
    await expect(sut.execute(input)).rejects.toThrow('User not found');
  });
});
