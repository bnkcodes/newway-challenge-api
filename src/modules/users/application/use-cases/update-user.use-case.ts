import { UserRole } from '@prisma/client';

import { UseCase } from '@/shared/application/use-cases/use-case';
import { ErrorException } from '@/shared/infra/error/error-exception';
import { ErrorCode } from '@/shared/infra/error/error-code';

import { UserRepository } from '@/users/domain/user.repository';
import {
  UserOutput,
  UserOutputMapper,
} from '@/users/application/dtos/user.output';

interface UpdateUserUseCaseInput {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: UserRole;
  isActive?: boolean;
}

interface UpdateUserUseCaseOutput {
  user: UserOutput;
}

export class UpdateUserUseCase
  implements UseCase<UpdateUserUseCaseInput, UpdateUserUseCaseOutput>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute(
    input: UpdateUserUseCaseInput,
  ): Promise<UpdateUserUseCaseOutput> {
    const user = await this.userRepository.findById(input.id).catch((error) => {
      throw new ErrorException(
        ErrorCode.InternalServerError,
        'Error finding existing user: ' + error.message,
      );
    });

    if (!user) {
      throw new ErrorException(
        ErrorCode.NotFound,
        `Error finding existing user: user with id ${input.id} not found`,
      );
    }

    if (input.email && input.email !== user.email) {
      const existingUser = await this.userRepository.findExistingByUniqueFields(
        {
          email: input.email,
        },
      );

      if (existingUser) {
        throw new ErrorException(
          ErrorCode.ConflictError,
          'Error updating user: User with email already exists',
        );
      }
    }

    if (input.isActive !== undefined) {
      const isCurrentlyActive = !user.isDeleted;

      if (input.isActive === isCurrentlyActive) {
        throw new ErrorException(
          ErrorCode.BadRequest,
          `Error updating user: User is already ${input.isActive ? 'active' : 'inactive'}`,
        );
      }

      if (input.isActive) user.restore();
      else user.delete();
    } else {
      user.update(input);
    }

    await this.userRepository.update(user).catch((error) => {
      throw new ErrorException(
        ErrorCode.InternalServerError,
        'Error updating user: ' + error.message,
      );
    });

    return {
      user: UserOutputMapper.fromEntity(user),
    };
  }
}
