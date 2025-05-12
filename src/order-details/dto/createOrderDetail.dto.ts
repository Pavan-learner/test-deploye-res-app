import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class createOrderDetailDto {
  @ApiProperty()
  @IsNumber()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsNumber()
  discount: number;

  @ApiProperty()
  @IsString()
  notes: string;

  @ApiProperty()
  @IsString()
  orderId: string;

  @ApiProperty()
  @IsString()
  menuId: string;
}
