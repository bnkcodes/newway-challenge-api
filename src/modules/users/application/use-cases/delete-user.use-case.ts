import { UseCase } from '@/shared/application/use-cases/use-case';
import { ErrorException } from '@/shared/infra/error/error-exception';
import { ErrorCode } from '@/shared/infra/error/error-code';

import { UserRepository } from '@/users/domain/user.repository';

export class DeleteUserUseCase implements UseCase<string, void> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(id: string): Promise<void> {
    const user = await this.userRepository.findById(id).catch((error) => {
      throw new ErrorException(
        ErrorCode.InternalServerError,
        'Error deleting user: ' + error.message,
      );
    });

    if (!user) {
      throw new ErrorException(
        ErrorCode.BadRequest,
        'Error deleting user: User does not exists',
      );
    }

    user.delete();

    await this.userRepository.update(user).catch((error) => {
      throw new ErrorException(
        ErrorCode.InternalServerError,
        'Error deleting user: ' + error.message,
      );
    });
  }
}
