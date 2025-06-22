export interface RepositoryInterface<
  T,
  FilterOneType = any,
  FilterManyType = any,
> {
  create(entity: T): Promise<T>;
  update(entity: T): Promise<void>;
  findById?(id: string): Promise<T | undefined>;
  findOne(filter: FilterOneType): Promise<T | undefined>;
  findMany(
    filter?: FilterManyType,
    paging?: Paging,
  ): Promise<FindManyResult<T>>;
}

export interface DeleteOneType {
  id: string;
}

export interface Paging {
  page: number;
  pageSize: number;
}

export interface FindManyResult<T> {
  items: T[];
  totalCount: number;
}

export interface Sorting {
  field: string;
  direction: 'asc' | 'desc';
}
