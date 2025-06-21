import { Module } from '@nestjs/common';

import { PrismaService } from '@/shared/infra/prisma/prisma.service';
import { CryptographyModule } from '@/shared/providers/cryptography/cryptography.module';
import { StorageModule } from '@/shared/providers/storage/storage.module';
import { TokenModule } from '@/shared/providers/token/token.module';
import { ICryptographyProvider } from '@/shared/providers/cryptography/interface/ICryptographyProvider';
import { IStorageProvider } from '@/shared/providers/storage';
import { ITokenProvider } from '@/shared/providers/token/interface/ITokenProvider';
import { EnvironmentVariables, EnvironmentVariablesType } from '@/config/env';

import { UserRepositoryName } from './domain/user.repository';

import { UserPrismaRepository } from './infrastructure/database/prisma/user.prisma.repository';
import { UsersController } from './infrastructure/presentation/users.controller';
import { UserFacade } from './infrastructure/user.facade';
import { AuthController } from './infrastructure/presentation/auth.controller';

@Module({
  imports: [CryptographyModule, StorageModule, TokenModule],
  controllers: [UsersController, AuthController],
  providers: [
    PrismaService,
    { provide: UserRepositoryName, useClass: UserPrismaRepository },
    {
      provide: UserFacade.name,
      useFactory: (
        userRepository: any,
        cryptographyProvider: ICryptographyProvider,
        storageProvider: IStorageProvider,
        tokenProvider: ITokenProvider,
        config: EnvironmentVariablesType,
      ) =>
        new UserFacade(
          userRepository,
          cryptographyProvider,
          storageProvider,
          tokenProvider,
          config.jwt.secret,
          config.jwt.expiresIn,
        ),
      inject: [
        UserRepositoryName,
        ICryptographyProvider,
        IStorageProvider,
        ITokenProvider,
        EnvironmentVariables.KEY,
      ],
    },
  ],
})
export class UserModule {}
