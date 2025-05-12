import { ApiOAuth2, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { IsNumber, IsString, IsBoolean } from 'class-validator';
import { KotPrintStatus, OrderStatus } from 'generated/prisma';

class SelectedAddonItem {
  // this is the id of the group item we need for future reference
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  addonGroupItemId: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price: number; // at the time of ordering
}

class CreateOrderItemDto {
  @ApiProperty({ example: 'menu123' })
  @IsString()
  menuId: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  price: number; // at the time of ordering

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsOptional()
  @IsString()
  variantId?: string;

  // here we are getting the selected addons from the client
  @ApiProperty({ type: [SelectedAddonItem] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SelectedAddonItem)
  addons?: SelectedAddonItem[];
}

export class CreateOrderDto {
  /**
   * The unique number identifying the order.
   * @example "ORD12345"
   */
  @ApiProperty()
  @IsString()
  number: string;

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

  /**
   * Indicates whether the order has been modified by the customer or not
   * so the Kitchen can be notified.
   * @example true
   */
  @ApiProperty()
  @IsBoolean()
  isModified?: boolean;

  /**
   * The unique identifier of the restaurant associated with the order.
   * @example "REST123"
   */
  @ApiProperty()
  @IsString()
  restaurantId: string;

  /**
   * The unique identifier of the table associated with the order.
   * @example "TABLE456"
   */
  @ApiProperty()
  @IsString()
  table_number: string;

  // here we are getting the ordered items from the client becuase we are creating the order detail from the order items
  @ApiProperty({ type: [CreateOrderItemDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
