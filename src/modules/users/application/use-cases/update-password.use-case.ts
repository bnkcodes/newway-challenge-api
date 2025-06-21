import { UseCase } from '@/shared/application/use-cases/use-case';
import { ErrorException } from '@/shared/infra/error/error-exception';
import { ErrorCode } from '@/shared/infra/error/error-code';
import { ICryptographyProvider } from '@/shared/providers/cryptography/interface/ICryptographyProvider';

import { UserRepository } from '@/users/domain/user.repository';

interface UpdatePasswordUseCaseInput {
  id: string;
  password: string;
  oldPassword?: string;
  skipPasswordValidation?: boolean;
}

type UpdatePasswordUseCaseOutput = Record<string, never>;

export class UpdatePasswordUseCase
  implements UseCase<UpdatePasswordUseCaseInput, UpdatePasswordUseCaseOutput>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cryptographyProvider: ICryptographyProvider,
  ) {}

  async execute(
    input: UpdatePasswordUseCaseInput,
  ): Promise<UpdatePasswordUseCaseOutput> {
    const user = await this.userRepository.findById(input.id).catch((error) => {
      throw new ErrorException(
        ErrorCode.InternalServerError,
        'Error finding existing user: ' + error.message,
      );
    });

    if (!user) {
      throw new ErrorException(
        ErrorCode.NotFound,
        'Error finding existing user: user not found',
      );
    }

    if (!input.skipPasswordValidation && input.oldPassword) {
      const matchPassword = await this.cryptographyProvider.compare({
        password: input.oldPassword,
        hash: user.password,
      });

      if (!matchPassword) {
        throw new ErrorException(ErrorCode.Unauthorized, 'Invalid password');
      }
    }

    const hashedPassword = await this.cryptographyProvider.encrypt({
      password: input.password,
    });

    user.update({ password: hashedPassword });

    await this.userRepository.update(user).catch((error) => {
      throw new ErrorException(
        ErrorCode.InternalServerError,
        'Error updating password: ' + error.message,
      );
    });

    return {};
  }
}
