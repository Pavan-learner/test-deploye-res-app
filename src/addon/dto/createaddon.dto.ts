import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class createAddonDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty()
  @IsBoolean()
  isAvailable: boolean;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  addonGroupId: string;

  @ApiProperty()
  @IsString()
  menuId ?:string;
}
