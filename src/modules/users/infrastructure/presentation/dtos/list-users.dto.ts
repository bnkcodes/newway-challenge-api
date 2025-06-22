import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray, IsBoolean } from 'class-validator';

export class ListUsersInput {
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString({ message: 'O campo busca é inválido.' })
  search?: string;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray({ message: 'O campo IDs deve ser um array.' })
  ids?: string[];

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray({ message: 'O campo IDs incluídos deve ser um array.' })
  includeIds?: string[];

  @ApiProperty({ type: Boolean, required: false })
  @IsOptional()
  @IsBoolean({ message: 'O campo incluir deletados deve ser um booleano.' })
  withDeleted?: boolean;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString({ message: 'O campo role é inválido.' })
  role?: string;
}
