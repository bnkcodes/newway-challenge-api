import { Module } from '@nestjs/common';

import { PrismaService } from '@/shared/infra/prisma/prisma.service';

import { UsersController } from './presentation/users.controller';
import { IUserRepository } from './domain/user.repository';
import { UserRepository } from './infrastructure/prisma/user.prisma.repository';

@Module({
  controllers: [UsersController],
  providers: [
    PrismaService,
    { provide: IUserRepository, useClass: UserRepository },
  ],
})
export class UserModule {}
