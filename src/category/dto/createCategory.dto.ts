import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsString()
    description?: string;

    @ApiProperty()
    @IsString()
    @ApiPropertyOptional()
    image?: string; // URL or path to the image representing the category

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    restaurantId: string; // ID of the restaurant to which the category belongs

    @ApiProperty()
    @IsBoolean()
    @ApiPropertyOptional()
    isActive?: boolean;

    @ApiProperty()
    @ApiPropertyOptional()
    sortOrder: number;
}