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

  set name(value: string) {
    this.props.name = value;
  }

  get email(): string {
    return this.props.email;
  }

  set email(value: string) {
    this.props.email = value.toLowerCase();
  }

  get password(): string {
    return this.props.password;
  }

  set password(value: string) {
    this.props.password = value;
  }

  get phone(): string | null {
    return this.props.phone;
  }

  set phone(value: string | null) {
    this.props.phone = value;
  }

  get imageUrl(): string | null {
    return this.props.imageUrl;
  }

  set imageUrl(value: string | null) {
    this.props.imageUrl = value;
  }

  get isDeleted(): boolean {
    return this.props.deletedAt !== null;
  }

  get role(): UserRole {
    return this.props.role;
  }

  set role(value: UserRole) {
    this.props.role = value;
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
    const validUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, value]) => value !== undefined),
    );

    Object.assign(this.props, validUpdates);

    if (updates.email) {
      this.props.email = updates.email.toLowerCase();
    }

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
