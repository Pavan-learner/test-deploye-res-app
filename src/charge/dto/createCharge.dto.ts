import { IsString, IsNumber, IsNotEmpty, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ChargeApplyTo, ChargeValueType } from 'generated/prisma';

export class CreateChargeDto {
    @ApiProperty({ description: 'Name of the charge' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'Entity to which the charge applies' })
     @IsEnum(ChargeValueType)
    @IsNotEmpty()
    chargeType: ChargeValueType

    @ApiProperty({ description: 'Cost of the charge', type: Number })
    @IsNumber()
    chargeCost: number;

    @ApiProperty({ description: 'Entity to which the charge applies' })
    @IsEnum(ChargeApplyTo)
    @IsNotEmpty()
    applyTo: ChargeApplyTo;
    
    @ApiProperty({ description: 'Status of the charge' })
    @IsBoolean()
    @IsNotEmpty()
    status: boolean;

    @ApiProperty({ description: 'ID of the restaurant' })
    @IsString()
    @IsNotEmpty()
    restaurantId: string;
}
