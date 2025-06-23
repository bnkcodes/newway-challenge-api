import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  MinLength,
  MaxLength,
} from 'class-validator';

import { passwordRequirements } from '@/shared/utils/password-requirements';
import { Match } from '@/shared/decorators/custom-validator.decorator';

export class CreateUserDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty({ message: 'O campo nome é obrigatório.' })
  @IsString({ message: 'O campo nome é inválido.' })
  name: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty({ message: 'O campo e-mail é obrigatório.' })
  @IsEmail({}, { message: 'O e-mail fornecido é inválido.' })
  email: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty({ message: 'O campo senha é obrigatório.' })
  @IsString({ message: 'O campo senha é inválido.' })
  @MinLength(passwordRequirements.minLength, {
    message: `O campo senha deve conter no mínimo ${passwordRequirements.minLength} caracteres.`,
  })
  @MaxLength(passwordRequirements.maxLength, {
    message: `O campo senha deve conter no máximo ${passwordRequirements.maxLength} caracteres.`,
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
        'O campo senha deve conter pelo menos 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial.',
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

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString({ message: 'O campo telefone é inválido.' })
  phone?: string;
}
