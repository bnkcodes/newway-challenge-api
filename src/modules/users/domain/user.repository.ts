import { RepositoryInterface } from '@/shared/domain/repositories/repository-contract';
import { UserEntity } from './user.entity';

export type UserRepositoryFilter = Partial<{
  id?: string;
  email?: string;
  name?: string;
  role?: string;
  withDeleted?: boolean;
}>;

export type UserRepositoryFilterMany = {
  search?: string;
  ids?: string[];
  includeIds?: string[];
  withDeleted?: boolean;
  role?: string;
};

export type UserRepositoryFilterByUniqueFields = {
  email: string;
};

export const UserRepositoryName = 'UserRepository';

export interface UserRepository
  extends RepositoryInterface<
    UserEntity,
    UserRepositoryFilter,
    UserRepositoryFilterMany
  > {
  findExistingByUniqueFields(
    filter: UserRepositoryFilterByUniqueFields,
  ): Promise<UserEntity | undefined>;
}
