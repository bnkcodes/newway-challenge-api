import { UseCase } from '@/shared/application/use-cases/use-case';
import { ErrorException } from '@/shared/infra/error/error-exception';
import { ErrorCode } from '@/shared/infra/error/error-code';

import { UserRepository } from '@/users/domain/user.repository';
import {
  UserOutput,
  UserOutputMapper,
} from '@/users/application/dtos/user.output';

interface GetUserUseCaseInput {
  id: string;
}

interface GetUserUseCaseOutput {
  user: UserOutput;
}

export class GetUserUseCase
  implements UseCase<GetUserUseCaseInput, GetUserUseCaseOutput>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: GetUserUseCaseInput): Promise<GetUserUseCaseOutput> {
    const user = await this.userRepository.findById(input.id).catch((error) => {
      throw new ErrorException(
        ErrorCode.InternalServerError,
        'Error getting user: ' + error.message,
      );
    });

    if (!user) {
      throw new ErrorException(
        ErrorCode.BadRequest,
        'Error getting user: User does not exists',
      );
    }

    return {
      user: UserOutputMapper.fromEntity(user),
    };
  }
}
