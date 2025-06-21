import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsStrongPassword,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { Match } from '@/shared/decorators/custom-validator.decorator';
import { passwordRequirements } from '@/shared/utils/password-requirements';

export class UpdatePasswordDto {
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString({ message: 'O campo senha atual é inválido.' })
  oldPassword?: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty({ message: 'O campo nova senha é obrigatório.' })
  @IsString({ message: 'O campo nova senha é inválido.' })
  @MinLength(passwordRequirements.minLength, {
    message: `O campo nova senha deve conter no mínimo ${passwordRequirements.minLength} caracteres.`,
  })
  @MaxLength(passwordRequirements.maxLength, {
    message: `O campo nova senha deve conter no máximo ${passwordRequirements.maxLength} caracteres.`,
  })
  @IsStrongPassword(
    {
      minLength: passwordRequirements.minLength,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'O campo nova senha deve conter pelo menos 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial.',
    },
  )
  password: string;

  @ApiProperty({ type: String, required: true })
  @IsString({
    message: 'O campo confirmação de senha é de preenchimento obrigatório.',
  })
  @MinLength(passwordRequirements.minLength, {
    message: `O campo confirmação de senha deve conter no mínimo ${passwordRequirements.minLength} caracteres.`,
  })
  @MaxLength(passwordRequirements.maxLength, {
    message: `O campo confirmação de senha deve conter no máximo ${passwordRequirements.maxLength} caracteres.`,
  })
  @IsStrongPassword(
    {
      minLength: passwordRequirements.minLength,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'O campo confirmação de senha deve conter pelo menos 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial.',
    },
  )
  @Match('password', {
    message: 'O campo confirmação de senha não confere com o campo senha.',
  })
  passwordConfirmation: string;
}
