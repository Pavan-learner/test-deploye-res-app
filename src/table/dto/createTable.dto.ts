import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateTableDto {
  @ApiProperty()
  @IsNumber()
  tableNumber: number;

  @ApiProperty()
  localtion: any;

  @ApiProperty()
  @IsString()
  tableStatus: string;

  @ApiProperty()
  @IsBoolean()
  status: boolean;

  @ApiProperty()
  @IsString()
  sectionId: string;

  @ApiProperty()
  @IsString()
  restaurantId: string;
}
