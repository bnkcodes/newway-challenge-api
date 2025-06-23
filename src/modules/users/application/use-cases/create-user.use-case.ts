import { UserRole } from '@prisma/client';

import { UseCase } from '@/shared/application/use-cases/use-case';
import { ICryptographyProvider } from '@/shared/providers/cryptography/interface/ICryptographyProvider';
import { ErrorException } from '@/shared/infra/error/error-exception';
import { ErrorCode } from '@/shared/infra/error/error-code';

import { UserEntity } from '@/users/domain/user.entity';
import { UserRepository } from '@/users/domain/user.repository';
import {
  UserOutput,
  UserOutputMapper,
} from '@/users/application/dtos/user.output';

interface CreateUserUseCaseInput {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

interface CreateUserUseCaseOutput {
  user: UserOutput;
}

export class CreateUserUseCase
  implements UseCase<CreateUserUseCaseInput, CreateUserUseCaseOutput>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cryptographyProvider: ICryptographyProvider,
  ) {}

  async execute(
    input: CreateUserUseCaseInput,
  ): Promise<CreateUserUseCaseOutput> {
    const existingUser = await this.userRepository
      .findExistingByUniqueFields({
        email: input.email,
      })
      .catch((error) => {
        throw new ErrorException(
          ErrorCode.InternalServerError,
          'Error finding existing user: ' + error.message,
        );
      });

    if (existingUser) {
      throw new ErrorException(
        ErrorCode.BadRequest,
        'Error Creating user: User already exists',
      );
    }

    const totalUsers = await this.userRepository.count();
    const isFirstUser = totalUsers === 0;

    const hashedPassword = await this.cryptographyProvider.encrypt({
      password: input.password,
    });

    const user = new UserEntity({
      ...input,
      password: hashedPassword,
      role: isFirstUser ? UserRole.ADMIN : UserRole.USER, // First user becomes admin
    });

    const createdUser = await this.userRepository
      .create(user)
      .catch((error) => {
        throw new ErrorException(
          ErrorCode.InternalServerError,
          'Error creating user: ' + error.message,
        );
      });

    return {
      user: UserOutputMapper.fromEntity(createdUser),
    };
  }
}
