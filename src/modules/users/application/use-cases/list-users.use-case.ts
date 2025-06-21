import { UseCase } from '@/shared/application/use-cases/use-case';
import { ErrorException } from '@/shared/infra/error/error-exception';
import { ErrorCode } from '@/shared/infra/error/error-code';
import {
  UserRepository,
  UserRepositoryFilterMany,
} from '@/users/domain/user.repository';
import {
  UserOutput,
  UserOutputMapper,
} from '@/users/application/dtos/user.output';
import {
  Paging,
  Sorting,
} from '@/shared/domain/repositories/repository-contract';

interface ListUsersUseCaseInput {
  filter?: UserRepositoryFilterMany;
  paging?: Paging;
  sorting?: Sorting;
}

interface ListUsersUseCaseOutput {
    users: UserOutput[];
    totalCount: number;
    page: number;
    pageSize: number;
}

export class ListUsersUseCase
  implements UseCase<ListUsersUseCaseInput, ListUsersUseCaseOutput>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: ListUsersUseCaseInput): Promise<ListUsersUseCaseOutput> {
    const result = await this.userRepository
      .findMany(input.filter, input.paging)
      .catch((error) => {
        throw new ErrorException(
          ErrorCode.InternalServerError,
          'Error listing users: ' + error.message,
        );
      });

    return {
      users: UserOutputMapper.fromMany(result.items),
      totalCount: result.totalCount,
      page: input.paging?.page || 1,
      pageSize: input.paging?.pageSize || 10,
    };
  }
}
