import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignInInput {
  @ApiProperty({ type: String, required: true })
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ type: String, required: true })
  password: string;
}
