import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateMenuVariantDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    description?: string;

    @ApiProperty()
    @IsString()
    image?: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    price: number;

    @ApiProperty()
    @IsBoolean()
    @IsNotEmpty()
    isAvailable?: boolean;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    menuId: string;
}