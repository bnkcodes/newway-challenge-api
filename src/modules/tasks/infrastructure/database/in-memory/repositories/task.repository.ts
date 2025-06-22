import { Injectable } from '@nestjs/common';

import { InMemoryRepository } from '@/shared/domain/repositories/in-memory-repository';
import { TaskEntity } from '@/tasks/domain/task.entity';
import {
  TaskRepository,
  TaskRepositoryFilter,
  TaskRepositoryFilterMany,
} from '@/tasks/domain/task.repository';

@Injectable()
export class InMemoryTaskRepository implements TaskRepository {
  private memoRepo = new InMemoryRepository<
    TaskEntity,
    TaskRepositoryFilter,
    TaskRepositoryFilterMany
  >();

  items = this.memoRepo.items;

  create = (entity: TaskEntity) => this.memoRepo.create(entity);
  update = (entity: TaskEntity) => this.memoRepo.update(entity);
  delete = (filter: { id: string }) => this.memoRepo.delete(filter);
  findOne = (filter: TaskRepositoryFilter) => this.memoRepo.findOne(filter);

  async findMany(
    filter?: TaskRepositoryFilterMany,
    paging?: { page: number; pageSize: number },
  ) {
    const allData = this.items.filter((item) => {
      if (filter?.userId && item.userId !== filter.userId) {
        return false;
      }
      return true;
    });

    if (!paging?.pageSize || !paging?.page) {
      return {
        items: allData,
        totalCount: allData.length,
      };
    }

    const { page, pageSize } = paging;
    const start = (page - 1) * pageSize;
    const end = page * pageSize;
    const dataPaginated = allData.slice(start, end);

    return Promise.resolve({
      items: dataPaginated,
      totalCount: allData.length,
    });
  }
}
