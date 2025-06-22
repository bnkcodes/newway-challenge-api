import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@/shared/infra/prisma/prisma.service';
import {
  FindManyResult,
  Paging,
  Sorting,
} from '@/shared/domain/repositories/repository-contract';

import { UserEntity } from '@/users/domain/user.entity';
import {
  UserRepository,
  UserRepositoryFilter,
  UserRepositoryFilterByUniqueFields,
  UserRepositoryFilterMany,
} from '@/users/domain/user.repository';

@Injectable()
export class UserPrismaRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findExistingByUniqueFields(
    filter: UserRepositoryFilterByUniqueFields,
  ): Promise<UserEntity | undefined> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: filter.email,
      },
    });

    if (!user) {
      return undefined;
    }

    return new UserEntity(user);
  }

  async create(entity: UserEntity): Promise<UserEntity> {
    const user = await this.prisma.user.create({
      data: {
        id: entity.id,
        name: entity.name,
        email: entity.email,
        password: entity.password,
        phone: entity.phone,
        imageUrl: entity.imageUrl,
        role: entity.role,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
        deletedAt: entity.deletedAt,
      },
    });

    return new UserEntity(user);
  }

  async findById(
    id: string,
    filter?: UserRepositoryFilter,
  ): Promise<UserEntity | undefined> {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        deletedAt: filter?.withDeleted ? undefined : null,
      },
    });
    return user ? new UserEntity(user) : undefined;
  }

  async findOne(
    filter?: UserRepositoryFilter,
  ): Promise<UserEntity | undefined> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: filter?.id,
        email: filter?.email,
        name: filter?.name,
        deletedAt: filter?.withDeleted !== true ? null : undefined,
      },
    });

    if (!user) {
      return undefined;
    }

    return new UserEntity(user);
  }

  async findMany(
    filter?: UserRepositoryFilterMany,
    paging?: Paging,
    sorting?: Sorting,
  ): Promise<FindManyResult<UserEntity>> {
    const where: Prisma.UserWhereInput = {};

    if (filter?.ids?.length) {
      where.id = { in: filter.ids };
    }

    if (filter?.search) {
      where.OR = [
        { name: { contains: filter.search, mode: 'insensitive' } },
        { email: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    if (!filter?.withDeleted) {
      where.deletedAt = null;
    }

    const [users, totalCount] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip: paging ? (paging.page - 1) * paging.pageSize : undefined,
        take: paging?.pageSize,
        orderBy: sorting
          ? { [sorting.field]: sorting.direction }
          : { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      items: users.map((user) => new UserEntity(user)),
      totalCount,
    };
  }

  async update(entity: UserEntity): Promise<void> {
    await this.prisma.user.update({
      where: { id: entity.id },
      data: {
        id: entity.id,
        name: entity.name,
        email: entity.email,
        password: entity.password,
        phone: entity.phone,
        imageUrl: entity.imageUrl,
        role: entity.role,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
        deletedAt: entity.deletedAt,
      },
    });
  }
}
