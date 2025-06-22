import { ICryptographyProvider } from '@/shared/providers/cryptography/interface/ICryptographyProvider';
import { ErrorException } from '@/shared/infra/error/error-exception';
import { ErrorCode } from '@/shared/infra/error/error-code';

import { InMemoryUserRepository } from '@/users/infrastructure/database/in-memory/repositories/user.repository';
import { UpdatePasswordUseCase } from '@/users/application/use-cases/update-password.use-case';
import { UserDataBuilder } from '@/users/domain/testing/user-data-builder';
import { UserEntity } from '@/users/domain/user.entity';

describe('Update password', () => {
  let userInMemoryRepository: InMemoryUserRepository;
  let cryptographyProvider: ICryptographyProvider;
  let sut: UpdatePasswordUseCase;
  let user: UserEntity;

  beforeEach(async () => {
    userInMemoryRepository = new InMemoryUserRepository();
    cryptographyProvider = {
      encrypt: jest.fn().mockResolvedValue('hashed_password'),
      compare: jest.fn().mockResolvedValue(true),
    } as ICryptographyProvider;
    sut = new UpdatePasswordUseCase(
      userInMemoryRepository,
      cryptographyProvider,
    );

    const userData = UserDataBuilder({});
    user = new UserEntity(userData);
    await userInMemoryRepository.create(user);

    jest.clearAllMocks();
  });

  it('Should be able to update user password with password validation', async () => {
    const compareSpy = jest.spyOn(cryptographyProvider, 'compare');
    const encryptSpy = jest.spyOn(cryptographyProvider, 'encrypt');

    const result = await sut.execute({
      id: user.id,
      password: 'new_password',
      oldPassword: 'old_password',
    });

    expect(result).toEqual({});
    expect(compareSpy).toHaveBeenCalledTimes(1);
    expect(encryptSpy).toHaveBeenCalledTimes(1);
  });

  it('Should be able to update password skipping password validation', async () => {
    const encryptSpy = jest.spyOn(cryptographyProvider, 'encrypt');

    const result = await sut.execute({
      id: user.id,
      password: 'new_password',
      skipPasswordValidation: true,
    });

    expect(result).toEqual({});
    expect(encryptSpy).toHaveBeenCalledTimes(1);
  });

  it('Should throw an error when old password is invalid', async () => {
    jest.spyOn(cryptographyProvider, 'compare').mockResolvedValue(false);

    const result = sut.execute({
      id: user.id,
      password: 'new_password',
      oldPassword: 'wrong_password',
    });

    const expected = new ErrorException(
      ErrorCode.Unauthorized,
      'Invalid password',
    );
    await expect(result).rejects.toThrow(expected);
  });

  it('Should throw an error when user is not found', async () => {
    const result = sut.execute({
      id: 'non-existent-id',
      password: 'new_password',
    });

    const expected = new ErrorException(
      ErrorCode.NotFound,
      'Error finding existing user: user not found',
    );
    await expect(result).rejects.toThrow(expected);
  });

  it('Should throw an error when repository findById operation gets an error', async () => {
    jest
      .spyOn(userInMemoryRepository, 'findById')
      .mockRejectedValue(new Error());

    const result = sut.execute({
      id: user.id,
      password: 'newPassword',
      oldPassword: 'oldPassword',
    });

    await expect(result).rejects.toThrow('Error finding existing user: ');
  });

  it('Should throw an error when repository update operation gets an error', async () => {
    jest.spyOn(userInMemoryRepository, 'update').mockRejectedValue(new Error());

    const result = sut.execute({
      id: user.id,
      password: 'newPassword',
      oldPassword: 'oldPassword',
    });

    await expect(result).rejects.toThrow('Error updating password: ');
  });
});
