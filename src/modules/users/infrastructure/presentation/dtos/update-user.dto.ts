import { IsEmail, IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class UpdateUserDto {
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString({ message: 'O campo nome é inválido.' })
  name?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsEmail({}, { message: 'O e-mail fornecido é inválido.' })
  email?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString({ message: 'O campo telefone é inválido.' })
  phone?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString({ message: 'O campo URL da imagem é inválido.' })
  imageUrl?: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'O campo role deve ser USER ou ADMIN.' })
  role?: UserRole;
}
