import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";

/**
 * Data Transfer Object for resetting a user's password.
 */
export class ResetPasswordDto {

    /**
     * The username of the user requesting the password reset.
     * This field is optional.
     */
    @ApiProperty()
    @IsOptional()
    @IsString()
    username?: string;

    /**
     * The email address of the user requesting the password reset.
     * This field is optional.
     */
    @ApiProperty()
    @IsOptional()
    @IsEmail()
    email?: string;

    /**
     * The new password for the user.
     * This field is optional.
     */
    @ApiProperty()
    @IsOptional()
    @IsString()
    password: string;
}

