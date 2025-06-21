import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { UserEntity } from '@/modules/users/domain/user.entity';
import {
  UserRepository,
  UserRepositoryFilter,
  UserRepositoryFilterByUniqueFields,
  UserRepositoryFilterMany,
} from '@/modules/users/domain/user.repository';
import {
  FindManyResult,
  Paging,
  Sorting,
} from '@/shared/domain/repositories/repository-contract';

import { PrismaService } from '@/shared/infra/prisma/prisma.service';

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
        createdAt: entity.props.createdAt,
        updatedAt: entity.props.updatedAt,
        deletedAt: entity.props.deletedAt,
      },
    });

    return new UserEntity(user);
  }

  async findById(id: string): Promise<UserEntity | undefined> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return undefined;
    }

    return new UserEntity(user);
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
      data: {
        name: entity.name,
        email: entity.email,
        password: entity.password,
        role: entity.props.role,
        updatedAt: entity.props.updatedAt,
        deletedAt: entity.props.deletedAt,
      },
      where: {
        id: entity.id,
      },
    });
  }
}
