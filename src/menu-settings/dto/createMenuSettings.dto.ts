import { ApiOperation, ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNumber, IsString } from 'class-validator';
import { ChargeValueType, ViewType } from 'generated/prisma';

/**
 * Data Transfer Object for creating menu settings.
 */
export class CreateMenuSettingsDto {
  /**
   * Specifies the view type for the menu.
   * @example "GRID" | "LIST"
   */
  @ApiProperty({
    description: 'Specifies the view type for the menu.',
    example: 'GRID',
  })
  @IsEnum(ViewType)
  view?: ViewType;

  /**
   * Indicates whether to show images in the menu.
   * @example true
   */
  @ApiProperty({
    description: 'Indicates whether to show images in the menu.',
    example: true,
  })
  isShowImage?: boolean;

  /**
   * Indicates whether to hide prices in the menu.
   * @example false
   */
  @ApiProperty({
    description: 'Indicates whether to hide prices in the menu.',
    example: false,
  })
  IsHidePrice?: boolean;

  /**
   * Specifies the surcharge value type for the menu.
   * @example "PERCENTAGE" | "DOLLAR"
   */
  @ApiProperty({
    description: 'Specifies the surcharge value percentage.',
  })
  @IsNumber()
  surcharge?: number;

  @ApiProperty({
    description: 'Specifies the surcharge status for the restuarant menu.',
  })
  surchargeStatus?: boolean;

  /**
   * The ID of the restaurant associated with the menu settings.
   * @example "restaurantId123"
   */
  @ApiProperty({
    description: 'The ID of the restaurant associated with the menu settings.',
    example: 'restaurantId123',
  })
  @IsString()
  restaurantId: string;

  // isHidePrice: boolean;

  @ApiProperty()
  @IsBoolean()
  isHidePrice?: boolean;
}
