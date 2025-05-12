import { ApiOperation, ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { KotPrintStatus, OrderStatus } from 'generated/prisma';

class UpdateSelectedAddonDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  id?: string; // existing addon ID if updating

  @ApiProperty()
  @IsString()
  addonGroupItemId: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  quantity: number;

  @ApiProperty()
  price: number;
}

class UpdateOrderItemDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  id?: string; // existing orderDetail ID if updating

  @ApiProperty()
  @IsString()
  menuId: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  price: number;

  @ApiProperty({ required: false })
  @IsOptional()
  notes?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  variantId?: string;

  @ApiProperty({ type: [UpdateSelectedAddonDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateSelectedAddonDto)
  addons?: UpdateSelectedAddonDto[];
}

export class UpdateOrderDto {
  @ApiProperty({ type: [UpdateOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateOrderItemDto)
  items: UpdateOrderItemDto[];

  /**
   * The current status of the order.
   * @example "PENDING"
   */
  @ApiProperty()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  /**
   * The status of the KOT (Kitchen Order Ticket) print.
   * @example "PRINT"
   */
  @ApiProperty({ example: 'PRINT or PRINTNOT' })
  @IsEnum(KotPrintStatus)
  kotPrintStatus?: KotPrintStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  isModified?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  table_number?: string;

  @ApiProperty({
    description: 'Array of item IDs to remove from the order',
    required: false,
    type: [String], // Use array notation for array types
  })
  @IsOptional()
  @IsArray() // Add array validation
  @IsString({ each: true }) // Validate each element is a string
  itemIdstoRemove?: string[];
}
