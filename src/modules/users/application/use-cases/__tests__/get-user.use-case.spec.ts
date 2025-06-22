import { ErrorException } from '@/shared/infra/error/error-exception';
import { ErrorCode } from '@/shared/infra/error/error-code';

import { InMemoryUserRepository } from '@/users/infrastructure/database/in-memory/repositories/user.repository';
import { GetUserUseCase } from '@/users/application/use-cases/get-user.use-case';
import { UserDataBuilder } from '@/users/domain/testing/user-data-builder';
import { UserEntity } from '@/users/domain/user.entity';

describe('Get user', () => {
  let userInMemoryRepository: InMemoryUserRepository;
  let sut: GetUserUseCase;
  let user: UserEntity;

  beforeEach(async () => {
    userInMemoryRepository = new InMemoryUserRepository();
    sut = new GetUserUseCase(userInMemoryRepository);

    const userData = UserDataBuilder({});
    user = new UserEntity(userData);
    await userInMemoryRepository.create(user);

    jest.clearAllMocks();
  });

  it('Should be able to get an user', async () => {
    const result = await sut.execute({ id: user.id });

    expect(result).toEqual({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        password: undefined,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        deletedAt: user.deletedAt,
        imageUrl: user.imageUrl,
        phone: user.phone,
        role: user.role,
      },
    });
  });

  it('Should throw an error when user is not found', async () => {
    const result = sut.execute({ id: 'non-existent-id' });

    const expected = new ErrorException(
      ErrorCode.BadRequest,
      'Error getting user: User does not exists',
    );
    await expect(result).rejects.toThrow(expected);
  });

  it('Should throw an error when repository findById operation gets an error', async () => {
    jest
      .spyOn(userInMemoryRepository, 'findById')
      .mockRejectedValue(new Error());

    const result = sut.execute({ id: user.id });

    await expect(result).rejects.toThrow('Error getting user: ');
  });
});
