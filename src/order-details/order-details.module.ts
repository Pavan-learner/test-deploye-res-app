import { Module } from '@nestjs/common';
import { OrderDetailService } from './order-details.service';
import { OrderDetailsController } from './order-details.controller';

@Module({
  controllers: [OrderDetailsController],
  providers: [OrderDetailService],
})
export class OrderDetailsModule {}
