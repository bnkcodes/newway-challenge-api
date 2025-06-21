import { Entity } from '../entities/entity';

import {
  DeleteOneType,
  Paging,
  RepositoryInterface,
} from './repository-contract';

export class InMemoryRepository<
  E extends Entity,
  FilterOneType = any,
  FilterManyType = any,
> implements RepositoryInterface<E, FilterOneType, FilterManyType>
{
  items: E[] = [];

  async create(entity: E) {
    this.items.push(entity);
    return Promise.resolve(entity);
  }

  async findById(id: string, companyId?: string) {
    return Promise.resolve(
      this.items.find((item) => {
        if (companyId && (item as any).companyId !== companyId) return false;
        return item.id === id;
      }),
    );
  }

  async findOne(filter: FilterOneType) {
    const filters = Object.entries(filter);
    return Promise.resolve(
      this.items.find((item) =>
        filters.every(([key, value]) => item[key] === value),
      ),
    );
  }

  async findMany(filter?: FilterManyType, paging?: Paging) {
    const filters = Object.entries(filter ?? {});

    const allData = this.items.filter((item) =>
      filters.every(([key, value]) => item[key] === value),
    );

    if (!paging) {
      return Promise.resolve({
        items: allData,
        totalCount: allData.length,
      });
    }

    const { page, pageSize } = paging;

    let dataPaginated = [];

    if (allData?.length && page < allData.length - 1) {
      const start = Math.min(allData.length - 1, (page - 1) * pageSize);
      const end = Math.min(allData.length, page * pageSize);

      dataPaginated = allData.slice(start, end);
    } else {
      dataPaginated = allData;
    }

    return Promise.resolve({
      items: dataPaginated,
      totalCount: allData.length,
    });
  }

  async update(entity: E): Promise<void> {
    const index = this.items.findIndex((item) => item.id === entity.id);

    if (index === -1) return Promise.resolve();

    this.items[index] = entity;
    return Promise.resolve();
  }

  async delete({ id }: DeleteOneType): Promise<void> {
    const index = this.items.findIndex((item) => item.id === id);

    if (index === -1) return Promise.resolve();

    this.items.splice(index, 1);
    return Promise.resolve();
  }
}
