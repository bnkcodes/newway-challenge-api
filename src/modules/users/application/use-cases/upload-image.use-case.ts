import { UseCase } from '@/shared/application/use-cases/use-case';
import { ErrorException } from '@/shared/infra/error/error-exception';
import { ErrorCode } from '@/shared/infra/error/error-code';
import { IStorageProvider } from '@/shared/providers/storage';

import { UserRepository } from '@/users/domain/user.repository';
import {
  UserOutput,
  UserOutputMapper,
} from '@/users/application/dtos/user.output';

interface UploadImageUseCaseInput {
  id: string;
  file: Express.Multer.File;
}

interface UploadImageUseCaseOutput {
  user: UserOutput;
}

export class UploadImageUseCase
  implements UseCase<UploadImageUseCaseInput, UploadImageUseCaseOutput>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly storageProvider: IStorageProvider,
  ) {}

  async execute(
    input: UploadImageUseCaseInput,
  ): Promise<UploadImageUseCaseOutput> {
    const FILE_CONTEXT = 'user';

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

    const image = await this.storageProvider.saveFile({
      context: FILE_CONTEXT,
      file: input.file,
    });

    user.update({ imageUrl: image.url });

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
