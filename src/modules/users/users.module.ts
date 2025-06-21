import { Module } from '@nestjs/common';

import { PrismaService } from '@/shared/infra/prisma/prisma.service';
import { CryptographyModule } from '@/shared/providers/cryptography/cryptography.module';
import { StorageModule } from '@/shared/providers/storage/storage.module';
import { ICryptographyProvider } from '@/shared/providers/cryptography/interface/ICryptographyProvider';
import { IStorageProvider } from '@/shared/providers/storage';

import { UserRepositoryName } from './domain/user.repository';

import { UserPrismaRepository } from './infrastructure/database/prisma/user.prisma.repository';
import { UsersController } from './infrastructure/presentation/users.controller';
import { UserFacade } from './infrastructure/user.facade';

@Module({
  imports: [CryptographyModule, StorageModule],
  controllers: [UsersController],
  providers: [
    PrismaService,
    { provide: UserRepositoryName, useClass: UserPrismaRepository },
    {
      provide: UserFacade.name,
      useFactory: (
        userRepository: any,
        cryptographyProvider: ICryptographyProvider,
        storageProvider: IStorageProvider,
      ) =>
        new UserFacade(userRepository, cryptographyProvider, storageProvider),
      inject: [UserRepositoryName, ICryptographyProvider, IStorageProvider],
    },
  ],
})
export class UserModule {}
