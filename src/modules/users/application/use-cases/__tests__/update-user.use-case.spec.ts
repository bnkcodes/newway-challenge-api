import { InMemoryUserRepository } from '@/users/infrastructure/database/in-memory/repositories/user.repository';
import { UserDataBuilder } from '@/users/domain/testing/user-data-builder';
import { UserEntity } from '@/users/domain/user.entity';
import { UpdateUserUseCase } from '@/users/application/use-cases/update-user.use-case';
import { ErrorException } from '@/shared/infra/error/error-exception';
import { ErrorCode } from '@/shared/infra/error/error-code';

describe('Update user', () => {
  let userInMemoryRepository: InMemoryUserRepository;
  let sut: UpdateUserUseCase;
  let user: UserEntity;

  beforeEach(async () => {
    userInMemoryRepository = new InMemoryUserRepository();
    sut = new UpdateUserUseCase(userInMemoryRepository);

    const userData = UserDataBuilder({});
    user = new UserEntity(userData);
    await userInMemoryRepository.create(user);

    jest.clearAllMocks();
  });

  it('Should be able to update an user', async () => {
    const updateData = {
      id: user.id,
      name: 'Updated Name',
      email: 'updated@example.com',
    };

    const result = await sut.execute(updateData);

    expect(result).toEqual({
      user: {
      id: user.id,
        name: updateData.name,
        email: updateData.email,
        password: user.password,
        createdAt: user.props.createdAt,
        updatedAt: expect.any(Date) as Date,
        deletedAt: user.props.deletedAt,
        imageUrl: user.props.imageUrl,
        phone: user.props.phone,
        role: user.props.role,
      },
    });
  });

  it('Should throw an error when user is not found', async () => {
    const result = sut.execute({
      id: 'non-existent-id',
      name: 'Updated Name',
    });

    const expected = new ErrorException(
      ErrorCode.NotFound,
      'Error finding existing user: user with id non-existent-id not found',
    );
    await expect(result).rejects.toThrow(expected);
  });

  it('Should throw an error when repository findById operation gets an error', async () => {
    jest
      .spyOn(userInMemoryRepository, 'findById')
      .mockRejectedValue(new Error());

    const result = sut.execute({
      id: user.id,
      name: 'Updated Name',
    });

    await expect(result).rejects.toThrow('Error finding existing user: ');
  });

  it('Should throw an error when repository update operation gets an error', async () => {
    jest.spyOn(userInMemoryRepository, 'update').mockRejectedValue(new Error());

    const result = sut.execute({
      id: user.id,
      name: 'Updated Name',
    });

    await expect(result).rejects.toThrow('Error updating user: ');
  });
});
