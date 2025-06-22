import { RepositoryInterface } from '@/shared/domain/repositories/repository-contract';

import { TaskEntity } from './task.entity';

export type TaskRepositoryFilter = {
  id?: string;
  userId?: string;
  withDeleted?: boolean;
};

export type TaskRepositoryFilterMany = {
  userId?: string;
  withDeleted?: boolean;
};

export const TaskRepositoryName = 'TaskRepository';

export type TaskRepository = RepositoryInterface<
  TaskEntity,
  TaskRepositoryFilter,
  TaskRepositoryFilterMany
>;
