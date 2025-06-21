import { UserRole } from '@prisma/client';

export class User {
  private readonly _id: string;
  private _name: string;
  private _email: string;
  private _phone: string | null;
  private _password: string;
  private _imageUrl: string | null;
  private _role: UserRole;
  private _createdAt: Date;
  private _updatedAt: Date;
  private _deletedAt: Date | null;

  constructor(props: {
    id: string;
    name: string;
    email: string;
    password: string;
    phone?: string | null;
    imageUrl?: string | null;
    role?: UserRole;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date | null;
  }) {
    this._id = props.id;
    this._name = props.name;
    this._email = props.email;
    this._password = props.password;
    this._phone = props.phone ?? null;
    this._imageUrl = props.imageUrl ?? null;
    this._role = props.role ?? UserRole.USER;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
    this._deletedAt = props.deletedAt ?? null;
  }

  get password(): string {
    return this._password;
  }

  get role(): UserRole {
    return this._role;
  }

  get isDeleted(): boolean {
    return this._deletedAt !== null;
  }

  get isAdmin(): boolean {
    return this._role === UserRole.ADMIN;
  }

  private _updateTimestamp(): void {
    this._updatedAt = new Date();
  }

  setPassword(password: string): void {
    this._password = password;
    this._updateTimestamp();
  }

  setRole(role: UserRole): void {
    this._role = role;
    this._updateTimestamp();
  }

  update(
    updates: Partial<{
      name: string;
      email: string;
      phone: string | null;
      password: string;
      imageUrl: string | null;
      role: UserRole;
    }>,
  ): void {
    Object.assign(this, updates);
    this._updateTimestamp();
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      email: this._email,
      phone: this._phone,
      password: this._password,
      imageUrl: this._imageUrl,
      role: this._role,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      deletedAt: this._deletedAt,
    };
  }
}
