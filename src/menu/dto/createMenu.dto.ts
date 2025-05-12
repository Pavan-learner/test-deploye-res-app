import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMenuDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description?: string; 

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  hasVairants?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  taxInclusive?: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isAvailable?: boolean;

  @ApiProperty()
  @IsString()
  setOrder: string;

  @ApiProperty()
  @IsString()
  categoryId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  restaurantId: string;
}
