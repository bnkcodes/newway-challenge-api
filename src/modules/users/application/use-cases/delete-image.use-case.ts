import { IStorageProvider } from '@/shared/providers/storage';
import { UseCase } from '@/shared/application/use-cases/use-case';
import { ErrorException } from '@/shared/infra/error/error-exception';
import { ErrorCode } from '@/shared/infra/error/error-code';

import { UserRepository } from '@/users/domain/user.repository';
import {
  UserOutput,
  UserOutputMapper,
} from '@/users/application/dtos/user.output';

interface DeleteImageUseCaseInput {
  id: string;
}

interface DeleteImageUseCaseOutput {
  user: UserOutput;
}

export class DeleteImageUseCase
  implements UseCase<DeleteImageUseCaseInput, DeleteImageUseCaseOutput>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly storageProvider: IStorageProvider,
  ) {}

  async execute(
    input: DeleteImageUseCaseInput,
  ): Promise<DeleteImageUseCaseOutput> {
    const user = await this.userRepository.findById(input.id).catch((error) => {
      throw new ErrorException(
        ErrorCode.InternalServerError,
        'Error finding user: ' + error.message,
      );
    });

    if (!user) {
      throw new ErrorException(
        ErrorCode.NotFound,
        'Error finding user: user not found',
      );
    }

    if (user.imageUrl) {
      await this.storageProvider.deleteFile({
        path: user.imageUrl,
      });
    }

    user.update({ imageUrl: null });

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
