import { User as PrismaUser } from '@prisma/client';

import { UserEntity } from '@/users/domain/user.entity';

export class UserPrismaMapper {
  static toEntity(user: PrismaUser): UserEntity {
    return new UserEntity(
      {
        name: user.name,
        email: user.email,
        password: user.password,
        phone: user.phone,
        imageUrl: user.imageUrl,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        deletedAt: user.deletedAt,
      },
      user.id,
    );
  }

  static toManyEntity(users: PrismaUser[]): UserEntity[] {
    return users.map((user) => UserPrismaMapper.toEntity(user));
  }
}
