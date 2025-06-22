import { EnvironmentVariablesType } from '@/config/env';

import { ICryptographyProvider } from '@/shared/providers/cryptography/interface/ICryptographyProvider';
import { IStorageProvider } from '@/shared/providers/storage';
import { ITokenProvider } from '@/shared/providers/token/interface/ITokenProvider';

import { UserRepository } from '@/users/domain/user.repository';
import { CreateUserUseCase } from '@/users/application/use-cases/create-user.use-case';
import { GetUserUseCase } from '@/users/application/use-cases/get-user.use-case';
import { ListUsersUseCase } from '@/users/application/use-cases/list-users.use-case';
import { UpdateUserUseCase } from '@/users/application/use-cases/update-user.use-case';
import { UpdatePasswordUseCase } from '@/users/application/use-cases/update-password.use-case';
import { UploadImageUseCase } from '@/users/application/use-cases/upload-image.use-case';
import { DeleteImageUseCase } from '@/users/application/use-cases/delete-image.use-case';
import { LoginUseCase } from '@/users/application/use-cases/login.use-case';

export class UserFacade {
  createUserUseCase: CreateUserUseCase;
  getUserUseCase: GetUserUseCase;
  listUsersUseCase: ListUsersUseCase;
  updateUserUseCase: UpdateUserUseCase;
  updatePasswordUseCase: UpdatePasswordUseCase;
  uploadImageUseCase: UploadImageUseCase;
  deleteImageUseCase: DeleteImageUseCase;
  loginUseCase: LoginUseCase;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly cryptographyProvider: ICryptographyProvider,
    private readonly storageProvider: IStorageProvider,
    private readonly tokenProvider: ITokenProvider,
    private readonly config: EnvironmentVariablesType,
  ) {
    if (!userRepository) {
      throw new Error('Error instantiating UserFacade: no userRepository');
    }
    if (!cryptographyProvider) {
      throw new Error(
        'Error instantiating UserFacade: no cryptographyProvider',
      );
    }
    if (!storageProvider) {
      throw new Error('Error instantiating UserFacade: no storageProvider');
    }
    if (!tokenProvider) {
      throw new Error('Error instantiating UserFacade: no tokenProvider');
    }

    this.createUserUseCase = new CreateUserUseCase(
      userRepository,
      cryptographyProvider,
    );
    this.getUserUseCase = new GetUserUseCase(userRepository);
    this.listUsersUseCase = new ListUsersUseCase(userRepository);
    this.updateUserUseCase = new UpdateUserUseCase(userRepository);
    this.updatePasswordUseCase = new UpdatePasswordUseCase(
      userRepository,
      cryptographyProvider,
    );
    this.uploadImageUseCase = new UploadImageUseCase(
      userRepository,
      storageProvider,
    );
    this.deleteImageUseCase = new DeleteImageUseCase(
      userRepository,
      storageProvider,
    );
    this.loginUseCase = new LoginUseCase(
      config,
      userRepository,
      cryptographyProvider,
      tokenProvider,
    );
  }
}
