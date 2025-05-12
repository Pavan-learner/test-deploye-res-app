import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsString } from "class-validator";
import { PaymentMethod, PaymentStatus } from "generated/prisma";

export class CreatePaymentDto {
    @ApiProperty()
    @IsString()
    orderId : string;

    @ApiProperty()
    @IsEnum(PaymentStatus)
    payment_status : PaymentStatus;

    @ApiProperty()
    @IsNumber()
    amount : number;

    @ApiProperty()
    @IsEnum(PaymentMethod)
    payment_method : PaymentMethod;
}