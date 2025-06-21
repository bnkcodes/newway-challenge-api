import { UseCase } from '@/shared/application/use-cases/use-case';
import { ErrorException } from '@/shared/infra/error/error-exception';
import { ErrorCode } from '@/shared/infra/error/error-code';
import { ICryptographyProvider } from '@/shared/providers/cryptography/interface/ICryptographyProvider';
import { ITokenProvider } from '@/shared/providers/token/interface/ITokenProvider';

import { UserRepository } from '@/users/domain/user.repository';
import {
  UserOutput,
  UserOutputMapper,
} from '@/users/application/dtos/user.output';

interface LoginUseCaseInput {
  email: string;
  password: string;
}

interface LoginUseCaseOutput {
  user: UserOutput;
  accessToken: string;
}

export class LoginUseCase
  implements UseCase<LoginUseCaseInput, LoginUseCaseOutput>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cryptographyProvider: ICryptographyProvider,
    private readonly tokenProvider: ITokenProvider,
    private readonly jwtSecret: string,
    private readonly jwtExpiresIn: string,
  ) {}

  async execute(input: LoginUseCaseInput): Promise<LoginUseCaseOutput> {
    const user = await this.userRepository
      .findExistingByUniqueFields({
        email: input.email,
      })
      .catch((error) => {
        throw new ErrorException(
          ErrorCode.InternalServerError,
          'Error finding user: ' + error.message,
        );
      });

    if (!user) {
      throw new ErrorException(
        ErrorCode.BadRequest,
        'Email ou senha estão incorretos.',
      );
    }

    const isPasswordValid = await this.cryptographyProvider.compare({
      password: input.password,
      hash: user.password,
    });

    if (!isPasswordValid) {
      throw new ErrorException(
        ErrorCode.BadRequest,
        'Email ou senha estão incorretos.',
      );
    }

    const accessToken = await this.tokenProvider.sign({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.props.role,
      jwtSecret: this.jwtSecret,
      jwtExpiresIn: this.jwtExpiresIn,
    });

    return {
      user: UserOutputMapper.fromEntity(user),
      accessToken,
    };
  }
}
