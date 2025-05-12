import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class createTaxDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  rate: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  restaurantId: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  status: boolean;
}
