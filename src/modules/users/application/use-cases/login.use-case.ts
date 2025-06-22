import { Inject } from '@nestjs/common';

import { EnvironmentVariables, EnvironmentVariablesType } from '@/config/env';

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
    @Inject(EnvironmentVariables.KEY)
    private readonly config: EnvironmentVariablesType,
    private readonly userRepository: UserRepository,
    private readonly cryptographyProvider: ICryptographyProvider,
    private readonly jwtProvider: ITokenProvider,
  ) {}

  async execute(input: LoginUseCaseInput): Promise<LoginUseCaseOutput> {
    const user = await this.userRepository
      .findExistingByUniqueFields({
        email: input.email,
      })
      .catch((error) => {
        throw new ErrorException(
          ErrorCode.NotFound,
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

    const userOutput = UserOutputMapper.fromEntity(user);

    const accessToken = await this.jwtProvider.sign({
      ...userOutput,
      jwtExpiresIn: this.config.jwt.expiresIn,
      jwtSecret: this.config.jwt.secret,
    });

    return {
      user: userOutput,
      accessToken,
    };
  }
}
