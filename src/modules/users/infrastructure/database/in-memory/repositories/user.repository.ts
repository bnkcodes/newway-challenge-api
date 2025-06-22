import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

import { InMemoryRepository } from '@/shared/domain/repositories/in-memory-repository';

import { UserEntity } from '@/users/domain/user.entity';
import {
  UserRepository,
  UserRepositoryFilter,
  UserRepositoryFilterMany,
  UserRepositoryFilterByUniqueFields,
} from '@/users/domain/user.repository';
@Injectable()
export class InMemoryUserRepository implements UserRepository {
  memoRepo = new InMemoryRepository<
    UserEntity,
    UserRepositoryFilter,
    UserRepositoryFilterMany
  >();

  items = this.memoRepo.items;

  create = (entity: UserEntity) => this.memoRepo.create(entity);
  update = (entity: UserEntity) => this.memoRepo.update(entity);
  delete = (filter: { id: string }) => this.memoRepo.delete(filter);
  findById = (id: string) => this.memoRepo.findById(id);
  findOne = (filter: UserRepositoryFilter) => this.memoRepo.findOne(filter);

  async findExistingByUniqueFields(
    filter: UserRepositoryFilterByUniqueFields,
  ): Promise<UserEntity | undefined> {
    const filters = Object.entries(filter);

    return Promise.resolve(
      this.items.find((item) =>
        filters.some(([key, value]) => item[key] === value),
      ),
    );
  }

  async findMany(
    filter?: UserRepositoryFilterMany,
    paging?: { page: number; pageSize: number },
  ) {
    let allData = this.items.filter((item) => {
      if (filter?.ids?.length && !filter.ids.includes(item.id)) {
        return false;
      }

      if (filter?.search) {
        const search = filter.search.toLowerCase().trim();
        const name = item.name.toLowerCase().trim();
        const email = item.email.toLowerCase().trim();

        if (!name.includes(search) && !email.includes(search)) {
          return false;
        }
      }

      if (filter?.role && item.role !== filter.role) {
        return false;
      }

      if (!filter?.withDeleted && item.isDeleted) {
        return false;
      }

      return true;
    });

    if (!paging?.pageSize && !paging?.page) {
      return {
        items: allData,
        totalCount: allData.length,
      };
    }

    if (filter?.includeIds?.length) {
      allData = allData.sort((a, b) => {
        const aIncluded = filter.includeIds.includes(a.id) ? 1 : 0;
        const bIncluded = filter.includeIds.includes(b.id) ? 1 : 0;

        return bIncluded - aIncluded;
      });

      paging.pageSize = Math.max(paging.pageSize, filter.includeIds.length);
    }

    const { page, pageSize } = paging;

    const start = Math.min(allData.length - 1, (page - 1) * pageSize);
    const end = Math.min(allData.length, page * pageSize);
    const dataPaginated = allData.slice(start, end);

    return Promise.resolve({
      items: dataPaginated,
      totalCount: allData.length,
    });
  }

  async findAll(data?: Prisma.UserFindFirstArgs): Promise<User[]> {
    const filter: UserRepositoryFilterMany = {};

    if (data?.where) {
      const where = data.where as {
        name?: { contains?: string };
        email?: { contains?: string };
        role?: string;
      };

      if (where.name?.contains) {
        filter.search = where.name.contains;
      }

      if (where.email?.contains) {
        filter.search = where.email.contains;
      }

      if (where.role) {
        filter.role = where.role;
      }
    }

    const paging = data?.take
      ? {
          page: Math.floor((data?.skip || 0) / data.take) + 1,
          pageSize: data.take,
        }
      : undefined;

    const result = await this.findMany(filter, paging);

    return result.items.map((item) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      password: item.password,
      phone: item.phone,
      imageUrl: item.imageUrl,
      role: item.role,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      deletedAt: item.deletedAt,
    }));
  }

  async findByUnique(
    unique: Prisma.UserWhereUniqueInput,
  ): Promise<User | void> {
    if (unique.id) {
      const entity = await this.memoRepo.findById(unique.id);
      return entity?.toJSON();
    }

    if (unique.email) {
      const entity = await this.memoRepo.findOne({ email: unique.email });
      return entity?.toJSON();
    }

    return undefined;
  }

  async count(data?: Prisma.UserFindFirstArgs): Promise<number> {
    const filter: UserRepositoryFilterMany = {};

    if (data?.where) {
      const where = data.where as {
        name?: { contains?: string };
        email?: { contains?: string };
        role?: string;
      };

      if (where.name?.contains) {
        filter.search = where.name.contains;
      }

      if (where.email?.contains) {
        filter.search = where.email.contains;
      }

      if (where.role) {
        filter.role = where.role;
      }
    }

    const result = await this.findMany(filter);
    return result.totalCount;
  }
}
