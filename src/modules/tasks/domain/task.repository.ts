import { RepositoryInterface } from '@/shared/domain/repositories/repository-contract';

import { TaskEntity } from './task.entity';

export type TaskRepositoryFilter = {
  id?: string;
  userId?: string;
};

export type TaskRepositoryFilterMany = {
  userId?: string;
};

export const TaskRepositoryName = 'TaskRepository';

export type TaskRepository = RepositoryInterface<
  TaskEntity,
  TaskRepositoryFilter,
  TaskRepositoryFilterMany
>;
