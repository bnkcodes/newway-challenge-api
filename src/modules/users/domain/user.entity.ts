import { UserRole } from '@prisma/client';

import { Entity } from '@/shared/domain/entities/entity';
import { UserRules } from './user.validator';

export type UserProps = {
  name: string;
  email: string;
  password: string;
  phone?: string | null;
  imageUrl?: string | null;
  role?: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
};

export class UserEntity extends Entity<UserProps> {
  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  get phone(): string | null {
    return this.props.phone;
  }

  get imageUrl(): string | null {
    return this.props.imageUrl;
  }

  get isDeleted(): boolean {
    return this.props.deletedAt !== null;
  }

  get role(): UserRole {
    return this.props.role;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get deletedAt(): Date | null {
    return this.props.deletedAt;
  }

  get isAdmin(): boolean {
    return this.props.role === UserRole.ADMIN;
  }

  private _updateTimestamp(): void {
    this.props.updatedAt = new Date();
  }

  update(updates: Partial<UserProps>): void {
    if (updates.email) {
      updates.email = updates.email.toLowerCase();
    }

    Object.assign(this.props, updates);
    this._updateTimestamp();
  }

  delete(): void {
    this.props.deletedAt = new Date();
    this._updateTimestamp();
  }

  restore(): void {
    this.props.deletedAt = null;
    this._updateTimestamp();
  }

  constructor(props: UserProps, id?: string) {
    UserEntity._validate(props);

    super(
      {
        ...props,
        email: props.email.toLowerCase(),
        role: props.role ?? UserRole.USER,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
        deletedAt: props.deletedAt ?? null,
      },
      id,
    );
  }

  static _validate(props: ConstructorParameters<typeof UserEntity>[0]) {
    UserRules.validate(props);
  }
}
