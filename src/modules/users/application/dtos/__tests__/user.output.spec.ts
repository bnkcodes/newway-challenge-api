import { UserDataBuilder } from '@/users/domain/testing/user-data-builder';
import { UserEntity } from '@/users/domain/user.entity';

import { UserOutputMapper } from '../user.output';

describe('UserOutputMapper', () => {
  let user: UserEntity;

  beforeEach(() => {
    const userData = UserDataBuilder({});
    user = new UserEntity(userData);
  });

  describe('fromEntity', () => {
    it('should map user entity without password by default', () => {
      const result = UserOutputMapper.fromEntity(user);

      expect(result).toEqual({
        id: user.id,
        name: user.name,
        email: user.email,
        password: undefined,
        phone: user.phone,
        imageUrl: user.imageUrl,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        deletedAt: user.deletedAt,
      });
    });

    it('should map user entity with password when withPassword is true', () => {
      const result = UserOutputMapper.fromEntity(user, true);

      expect(result).toEqual({
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        phone: user.phone,
        imageUrl: user.imageUrl,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        deletedAt: user.deletedAt,
      });
    });
  });

  describe('fromMany', () => {
    it('should map multiple users without password by default', () => {
      const users = [user, user];
      const result = UserOutputMapper.fromMany(users);

      expect(result).toHaveLength(2);
      expect(result[0].password).toBeUndefined();
      expect(result[1].password).toBeUndefined();
    });

    it('should map multiple users with password when withPassword is true', () => {
      const users = [user, user];
      const result = UserOutputMapper.fromMany(users, true);

      expect(result).toHaveLength(2);
      expect(result[0].password).toBe(user.password);
      expect(result[1].password).toBe(user.password);
    });
  });
});
