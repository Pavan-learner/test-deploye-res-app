import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class createAddonGroupDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsString()
  selectionType: string;

  @ApiProperty()
  @IsNumber()
  minSelection?: number;

  @ApiProperty()
  @IsNumber()
  maxSelection?: number;

  @ApiProperty()
  @IsBoolean()
  isRequired?: boolean;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  restaurantId: string;

}
