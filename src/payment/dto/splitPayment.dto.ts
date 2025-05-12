import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsString } from "class-validator";
import { PaymentMethod } from "generated/prisma";

export class SplitPaymentDto{
    @ApiProperty()
    @IsNumber()
    amount : number;

    @ApiProperty()
    @IsEnum(PaymentMethod)
    paymentMethod : PaymentMethod;

    @ApiProperty()
    @IsNumber()
    splitNumber : number;

    @ApiProperty()
    @IsString()
    payment_status: string;
}