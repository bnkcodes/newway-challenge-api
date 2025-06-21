import { InMemoryUserRepository } from '@/users/infrastructure/database/in-memory/repositories/user.repository';
import { UserDataBuilder } from '@/users/domain/testing/user-data-builder';
import { UserEntity } from '@/users/domain/user.entity';
import { DeleteUserUseCase } from '@/users/application/use-cases/delete-user.use-case';
import { ErrorException } from '@/shared/infra/error/error-exception';
import { ErrorCode } from '@/shared/infra/error/error-code';

describe('Delete user', () => {
  let userInMemoryRepository: InMemoryUserRepository;
  let sut: DeleteUserUseCase;
  let user: UserEntity;

  beforeEach(async () => {
    userInMemoryRepository = new InMemoryUserRepository();
    sut = new DeleteUserUseCase(userInMemoryRepository);

    const userData = UserDataBuilder({});
    user = new UserEntity(userData);
    await userInMemoryRepository.create(user);

    jest.clearAllMocks();
  });

  it('Should be able to delete an user', async () => {
    const result = await sut.execute(user.id);

    expect(result).toBeUndefined();
    expect(userInMemoryRepository.items).toHaveLength(1);
    expect(userInMemoryRepository.items[0].isDeleted).toBe(true);
  });

  it('Should throw an error when user is not found', async () => {
    const result = sut.execute('non-existent-id');

    const expected = new ErrorException(
      ErrorCode.BadRequest,
      'Error deleting user: User does not exists',
    );
    await expect(result).rejects.toThrow(expected);
  });

  it('Should throw an error when repository findById operation gets an error', async () => {
    jest
      .spyOn(userInMemoryRepository, 'findById')
      .mockRejectedValue(new Error());

    const result = sut.execute(user.id);

    await expect(result).rejects.toThrow('Error deleting user: ');
  });

  it('Should throw an error when repository update operation gets an error', async () => {
    jest.spyOn(userInMemoryRepository, 'update').mockRejectedValue(new Error());

    const result = sut.execute(user.id);

    await expect(result).rejects.toThrow('Error deleting user: ');
  });
});
