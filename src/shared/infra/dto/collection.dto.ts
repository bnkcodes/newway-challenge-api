import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsNumber, IsString } from 'class-validator';

export class CollectionInput {
  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  page?: number;

  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  pageSize?: number;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  sortDirection?: string;
}
