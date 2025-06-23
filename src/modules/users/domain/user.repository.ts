import { RepositoryInterface } from '@/shared/domain/repositories/repository-contract';
import { UserEntity } from './user.entity';

export type UserRepositoryFilter = {
  id?: string;
  name?: string;
  email?: string;
  withDeleted?: boolean;
};

export type UserRepositoryFilterMany = {
  search?: string;
  ids?: string[];
  includeIds?: string[];
  withDeleted?: boolean;
  role?: string;
};

export type UserRepositoryFilterByUniqueFields = {
  id?: string;
  email?: string;
};

export const UserRepositoryName = 'UserRepository';

export interface UserRepository
  extends RepositoryInterface<UserEntity, UserRepositoryFilter> {
  findExistingByUniqueFields(
    filter: UserRepositoryFilterByUniqueFields,
  ): Promise<UserEntity | undefined>;
  count(): Promise<number>;
}
