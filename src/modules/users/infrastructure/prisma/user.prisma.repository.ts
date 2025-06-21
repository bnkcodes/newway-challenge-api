import { Injectable } from '@nestjs/common';
import { User, Prisma } from '@prisma/client';

import { PrismaService } from '@/shared/infra/prisma/prisma.service';
import { PrismaRepository } from '@/shared/infra/prisma/base.repository';
import { IUserRepository } from '@/users/domain/user.repository';

@Injectable()
export class UserRepository
  extends PrismaRepository<
    Prisma.UserFindFirstArgs,
    Prisma.UserWhereUniqueInput,
    Prisma.UserCreateInput,
    Prisma.UserUpdateInput,
    User
  >
  implements IUserRepository
{
  constructor(private readonly repository: PrismaService) {
    super('user', repository);
  }
}
