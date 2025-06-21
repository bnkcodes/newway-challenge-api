import { UserRole } from '@prisma/client';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

import { ErrorCode } from '@/shared/infra/error/error-code';
import { ErrorException } from '@/shared/infra/error/error-exception';
import { ClassValidatorFields } from '@/shared/domain/validators/class-validator-fields';

import { UserEntity } from './user.entity';

type UserRulerProps = ConstructorParameters<typeof UserEntity>[0];

export class UserRules implements UserRulerProps {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  phone?: string | null;

  @IsString()
  @IsOptional()
  imageUrl?: string | null;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @IsDate()
  @IsOptional()
  updatedAt?: Date;

  @IsDate()
  @IsOptional()
  deletedAt?: Date | null;

  constructor(props: UserRulerProps) {
    Object.assign(this, props);
  }

  static validate(data: UserRulerProps) {
    const errors = ClassValidatorFields.validate(new UserRules(data));

    if (errors) {
      throw new ErrorException(
        ErrorCode.ValidationError,
        JSON.stringify(errors),
      );
    }
  }
}
