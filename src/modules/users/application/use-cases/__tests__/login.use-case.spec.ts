import { UserRole } from '@prisma/client';

import { ICryptographyProvider } from '@/shared/providers/cryptography/interface/ICryptographyProvider';
import { ITokenProvider } from '@/shared/providers/token/interface/ITokenProvider';

import { LoginUseCase } from '@/users/application/use-cases/login.use-case';
import { UserRepository } from '@/users/domain/user.repository';
import { UserEntity } from '@/users/domain/user.entity';

describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase;
  let userRepository: UserRepository;
  let cryptographyProvider: ICryptographyProvider;
  let tokenProvider: ITokenProvider;

  const mockUser = new UserEntity({
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: UserRole.USER,
  });

  beforeEach(() => {
    userRepository = {
      findExistingByUniqueFields: jest.fn(),
    } as any;

    cryptographyProvider = {
      compare: jest.fn(),
    } as any;

    tokenProvider = {
      sign: jest.fn(),
    } as any;

    loginUseCase = new LoginUseCase(
      userRepository,
      cryptographyProvider,
      tokenProvider,
      'jwt-secret',
      '7d',
    );
  });

  it('should authenticate user successfully', async () => {
    const input = {
      email: 'test@example.com',
      password: 'password123',
    };

    jest
      .spyOn(userRepository, 'findExistingByUniqueFields')
      .mockResolvedValue(mockUser);
    jest.spyOn(cryptographyProvider, 'compare').mockResolvedValue(true);
    jest.spyOn(tokenProvider, 'sign').mockResolvedValue('access-token');

    const result = await loginUseCase.execute(input);

    expect(result.accessToken).toBe('access-token');
    expect(result.user.id).toBe(mockUser.id);
    expect(result.user.name).toBe('Test User');
    expect(result.user.email).toBe('test@example.com');
    expect(result.user.role).toBe(UserRole.USER);
  });

  it('should throw error when user not found', async () => {
    const input = {
      email: 'nonexistent@example.com',
      password: 'password123',
    };

    jest
      .spyOn(userRepository, 'findExistingByUniqueFields')
      .mockResolvedValue(undefined);

    const result = loginUseCase.execute(input);

    await expect(result).rejects.toThrow('Email ou senha estão incorretos.');
  });

  it('should throw error when password is incorrect', async () => {
    const input = {
      email: 'test@example.com',
      password: 'wrongpassword',
    };

    jest
      .spyOn(userRepository, 'findExistingByUniqueFields')
      .mockResolvedValue(mockUser);
    jest.spyOn(cryptographyProvider, 'compare').mockResolvedValue(false);

    const result = loginUseCase.execute(input);

    await expect(result).rejects.toThrow('Email ou senha estão incorretos.');
  });

  it('should throw error when repository throws error', async () => {
    const input = {
      email: 'test@example.com',
      password: 'password123',
    };

    jest
      .spyOn(userRepository, 'findExistingByUniqueFields')
      .mockRejectedValue(new Error('Database connection failed'));

    const result = loginUseCase.execute(input);

    await expect(result).rejects.toThrow(
      'Error finding user: Database connection failed',
    );
  });
});
