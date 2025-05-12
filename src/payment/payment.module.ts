import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { SplitPaymentService } from './services/spiltPayment.service';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService , SplitPaymentService],
})
export class PaymentModule {}
  