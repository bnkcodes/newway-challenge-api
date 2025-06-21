import { UserEntity, UserProps } from '@/users/domain/user.entity';

export type UserOutput = UserProps & {
  id: string;
};

export class UserOutputMapper {
  static fromEntity(user: UserEntity): UserOutput {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      phone: user.props.phone,
      imageUrl: user.imageUrl,
      role: user.props.role,
      createdAt: user.props.createdAt,
      updatedAt: user.props.updatedAt,
      deletedAt: user.props.deletedAt,
    };
  }

  static fromMany(users: UserEntity[]): UserOutput[] {
    return users.map((user) => this.fromEntity(user));
  }
}
