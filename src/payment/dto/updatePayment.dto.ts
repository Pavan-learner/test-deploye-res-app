import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsString } from "class-validator";
import { PaymentMethod, PaymentStatus } from "generated/prisma";

export class UpdatePaymentDto {

  @ApiProperty()
  @IsEnum(PaymentStatus)
  payment_status: PaymentStatus;

  @ApiProperty()
  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;
}
