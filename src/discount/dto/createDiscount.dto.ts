import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

import { DiscountApplyTo , DiscountValueType } from 'generated/prisma';

export class CreateDiscountDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEnum(DiscountValueType)
  @IsNotEmpty()
  valueType: DiscountValueType;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  value: number;

  @ApiProperty()
  @ApiPropertyOptional({ description: 'For which service it is applied' })
  @IsEnum(DiscountApplyTo)
  applyTo?: DiscountApplyTo;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  restaurantId: string; 

  @ApiProperty()
  @ApiPropertyOptional({ description: 'Start date of the discount' })
  @IsDate()
  // * here we are using transformer to convert date string to date object becuase from json it will come as string
  @Type(() => Date)
  startDate?: Date;

  @ApiProperty()
  @ApiPropertyOptional({ description: 'End date of the discount' })
  @IsDate()
  @Type(() => Date)
  endDate?: Date;
}
