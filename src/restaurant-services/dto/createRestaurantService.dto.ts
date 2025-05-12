import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString, isString } from "class-validator";

export class CreateRestaurantServiceDto {

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    restaurantId: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    serviceTypeId: string;

    @ApiProperty()
    @IsBoolean()
    status : boolean;
}
