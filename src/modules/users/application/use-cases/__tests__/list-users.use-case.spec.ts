import { InMemoryUserRepository } from '@/users/infrastructure/database/in-memory/repositories/user.repository';
import { UserDataBuilder } from '@/users/domain/testing/user-data-builder';
import { UserEntity } from '@/users/domain/user.entity';
import { ListUsersUseCase } from '@/users/application/use-cases/list-users.use-case';

describe('List users', () => {
  let userInMemoryRepository: InMemoryUserRepository;
  let sut: ListUsersUseCase;
  let users: UserEntity[];

  beforeEach(async () => {
    userInMemoryRepository = new InMemoryUserRepository();
    sut = new ListUsersUseCase(userInMemoryRepository);

    const userData1 = UserDataBuilder({});
    const userData2 = UserDataBuilder({});
    const userData3 = UserDataBuilder({});

    users = [
      new UserEntity(userData1),
      new UserEntity(userData2),
      new UserEntity(userData3),
    ];

    await Promise.all(users.map((user) => userInMemoryRepository.create(user)));

    jest.clearAllMocks();
  });

  it('Should be able to list all users', async () => {
    const result = await sut.execute({});

    expect(result).toEqual({
      users: users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        createdAt: user.props.createdAt,
        updatedAt: user.props.updatedAt,
        deletedAt: user.props.deletedAt,
        imageUrl: user.props.imageUrl,
        phone: user.props.phone,
        role: user.props.role,
      })),
      totalCount: 3,
      page: 1,
      pageSize: 10,
    });
  });

  it('Should be able to list users with pagination', async () => {
    const result = await sut.execute({ paging: { page: 1, pageSize: 2 } });

    expect(result.users).toHaveLength(2);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(2);
  });

  it('Should be able to list users with search', async () => {
    const result = await sut.execute({ filter: { search: users[0].name } });

    expect(result.users).toHaveLength(1);
    expect(result.users[0].name).toBe(users[0].name);
  });

  it('Should be able to list users with sort', async () => {
    const result = await sut.execute({
      sorting: { field: 'name', direction: 'asc' },
    });

    expect(result.users).toHaveLength(3);
  });

  it('Should throw an error when repository findMany operation gets an error', async () => {
    jest
      .spyOn(userInMemoryRepository, 'findMany')
      .mockRejectedValue(new Error());

    const result = sut.execute({});

    await expect(result).rejects.toThrow('Error listing users: ');
  });
});
