import { Prisma, User } from '@prisma/client';

import { IPrismaRepository } from '@/shared/infra/repositories/base.repository.interface';

export abstract class IUserRepository extends IPrismaRepository<
  Prisma.UserFindFirstArgs,
  Prisma.UserWhereUniqueInput,
  Prisma.UserCreateInput,
  Prisma.UserUpdateInput,
  User
> {}
