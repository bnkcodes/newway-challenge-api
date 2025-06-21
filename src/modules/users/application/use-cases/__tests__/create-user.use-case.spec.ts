import { InMemoryUserRepository } from '@/users/infrastructure/database/in-memory/repositories/user.repository';
import { UserDataBuilder } from '@/users/domain/testing/user-data-builder';
import { UserProps } from '@/users/domain/user.entity';
import { CreateUserUseCase } from '@/users/application/use-cases/create-user.use-case';
import { ICryptographyProvider } from '@/shared/providers/cryptography/interface/ICryptographyProvider';

describe('Create user', () => {
  let userInMemoryRepository: InMemoryUserRepository;
  let cryptographyProvider: ICryptographyProvider;
  let sut: CreateUserUseCase;
  let props: UserProps;

  beforeEach(() => {
    userInMemoryRepository = new InMemoryUserRepository();
    cryptographyProvider = {
      encrypt: jest.fn().mockResolvedValue('hashed_password'),
      compare: jest.fn().mockResolvedValue(true),
    } as ICryptographyProvider;
    sut = new CreateUserUseCase(userInMemoryRepository, cryptographyProvider);
    props = UserDataBuilder({});

    jest.clearAllMocks();
  });

  it('Should be able to create an user', async () => {
    const { user } = await sut.execute({
      name: props.name,
      email: props.email,
      password: props.password,
      phone: props.phone,
    });

    expect(user.id).toBeTruthy();
    expect(user.name).toBe(props.name);
    expect(user.email).toBe(props.email);
    expect(userInMemoryRepository.items[0].id).toEqual(user.id);
  });

  it('Should throw an error when assign existing email to an user', async () => {
    await sut.execute({
      name: props.name,
      email: 'email@email.com',
      password: props.password,
    });

    const result = sut.execute({
      name: 'Another User',
      email: 'email@email.com',
      password: props.password,
    });

    await expect(result).rejects.toThrow(
      'Error Creating user: User already exists',
    );
  });

  it('Should throw an error when repository findExistingByUniqueFields operation gets an error', async () => {
    jest
      .spyOn(userInMemoryRepository, 'findExistingByUniqueFields')
      .mockRejectedValue(new Error('Database error'));

    const result = sut.execute({
      name: props.name,
      email: props.email,
      password: props.password,
    });

    await expect(result).rejects.toThrow(
      'Error finding existing user: Database error',
    );
  });

  it('Should throw an error when repository create operation gets an error', async () => {
    jest
      .spyOn(userInMemoryRepository, 'create')
      .mockRejectedValue(new Error('Database error'));

    const result = sut.execute({
      name: props.name,
      email: props.email,
      password: props.password,
    });

    await expect(result).rejects.toThrow('Error creating user: Database error');
  });
});
