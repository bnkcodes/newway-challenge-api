import { UserEntity, UserProps } from '@/users/domain/user.entity';

export type UserOutput = UserProps & {
  id: string;
};

export class UserOutputMapper {
  static fromEntity(user: UserEntity, withPassword = false): UserOutput {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      imageUrl: user.imageUrl,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
      ...(withPassword && { password: user.password }),
    };
  }

  static fromMany(users: UserEntity[], withPassword = false): UserOutput[] {
    return users.map((user) => this.fromEntity(user, withPassword));
  }
}
