import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

import {
  FindManyResult,
  Paging,
} from '@/shared/domain/repositories/repository-contract';

import { TaskEntity } from '@/tasks/domain/task.entity';
import {
  TaskRepository,
  TaskRepositoryFilter,
  TaskRepositoryFilterMany,
} from '@/tasks/domain/task.repository';

import { TaskPrismaMapper } from './task.prisma.mapper';

@Injectable()
export class TaskPrismaRepository implements TaskRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(entity: TaskEntity): Promise<TaskEntity> {
    const task = await this.prisma.task.create({
      data: entity.props,
    });
    return TaskPrismaMapper.toEntity(task);
  }

  async update(entity: TaskEntity): Promise<void> {
    await this.prisma.task.update({
      where: { id: entity.id },
      data: entity.props,
    });
  }

  async findOne(filter: TaskRepositoryFilter): Promise<TaskEntity | undefined> {
    const task = await this.prisma.task.findFirst({
      where: {
        id: filter?.id,
        userId: filter?.userId,
        deletedAt: filter.withDeleted ? undefined : null,
      },
    });
    return task ? TaskPrismaMapper.toEntity(task) : undefined;
  }

  async findMany(
    filter?: TaskRepositoryFilterMany,
    paging?: Paging,
  ): Promise<FindManyResult<TaskEntity>> {
    const { page = 1, pageSize = 10 } = paging || {};

    const [tasks, totalCount] = await Promise.all([
      this.prisma.task.findMany({
        where: {
          ...filter,
          deletedAt: filter?.withDeleted ? undefined : null,
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.task.count({
        where: {
          ...filter,
          deletedAt: filter?.withDeleted ? undefined : null,
        },
      }),
    ]);

    return {
      items: tasks.map((task) => TaskPrismaMapper.toEntity(task)),
      totalCount,
    };
  }
}
