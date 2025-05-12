import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class LoginDto{
    @ApiProperty()
    @IsEmail()
    @IsOptional()
    email: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    username: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    password: string;
}