import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

import { UserOutput } from '@/users/application/dtos/user.output';

export class UserPresenter {
  @ApiProperty({ type: String, required: true })
  id: string;

  @ApiProperty({ type: String, required: true })
  name: string;

  @ApiProperty({ type: String, required: true })
  email: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  phone: string | null;

  @ApiProperty({ type: String, required: false, nullable: true })
  imageUrl: string | null;

  @ApiProperty({ type: String, required: true, enum: UserRole })
  role: UserRole;

  @ApiProperty({ type: Date, required: true })
  createdAt: Date;

  @ApiProperty({ type: Date, required: true })
  updatedAt: Date;

  @ApiProperty({ type: Date, required: false, nullable: true })
  deletedAt: Date | null;

  @ApiProperty({ type: String, required: false })
  password?: string;

  static toPresenter(output: UserOutput, withPassword = false): UserPresenter {
    const user: UserPresenter = {
      id: output.id,
      name: output.name,
      email: output.email,
      phone: output.phone,
      imageUrl: output.imageUrl,
      role: output.role,
      createdAt: output.createdAt,
      updatedAt: output.updatedAt,
      deletedAt: output.deletedAt,
      password: withPassword ? output.password : undefined,
    };

    return user;
  }

  static toManyPresenter(
    outputs: UserOutput[],
    withPassword = false,
  ): UserPresenter[] {
    return outputs.map((output) => this.toPresenter(output, withPassword));
  }
}

export class UserPresenterWrapper {
  @ApiProperty({ type: UserPresenter, required: true })
  user: UserPresenter;

  constructor(user: UserPresenter) {
    this.user = user;
  }
}

export class UserCollectionPresenter {
  @ApiProperty({ type: [UserPresenter], required: true })
  users: UserPresenter[];

  @ApiProperty({ type: Number, required: true })
  totalCount: number;

  @ApiProperty({ type: Number, required: true })
  page: number;

  @ApiProperty({ type: Number, required: true })
  pageSize: number;

  constructor(
    users: UserPresenter[],
    totalCount: number,
    page: number,
    pageSize: number,
  ) {
    this.users = users;
    this.totalCount = totalCount;
    this.page = page;
    this.pageSize = pageSize;
  }
}
