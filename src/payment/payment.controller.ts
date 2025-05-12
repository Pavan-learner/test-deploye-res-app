import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/createPayment.dto';
import { SplitPaymentService } from './services/spiltPayment.service';
import { SplitPaymentDto } from './dto/splitPayment.dto';
import { ApiOperation } from '@nestjs/swagger';
import { UpdatePaymentDto } from './dto/updatePayment.dto';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService,
    // here we are calling the external service to split the payment 
    private readonly splitPaymentService : SplitPaymentService
  ) {}

  @ApiOperation({ summary: 'Create a new payment' })
  @Post()
  async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
    return await this.paymentService.createPayment(createPaymentDto);
  }

  @Patch(':paymentId')
  async updatePaymentStatus(@Param('paymentId') paymentId : string , @Body() updatePaymentDto: UpdatePaymentDto) {
    console.log('updatePaymentStatus', paymentId, updatePaymentDto);
    return await this.paymentService.updatePaymentStatus(paymentId , updatePaymentDto);
  }  

  @Post(':paymentId/split/:orderId/order')
  async splitPayment(@Param('paymentId') paymentId: string , @Param('orderId') orderId : string, @Body() splitPaymentDto: SplitPaymentDto) {
    return await this.splitPaymentService.splitPayment(paymentId ,orderId, splitPaymentDto);
  }

  @Patch('/:splitId/split')
  async updateSplitPayment(@Param('splitId') splitId: string , @Body() splitPaymentDto: SplitPaymentDto) {
    return await this.splitPaymentService.updateSplit(splitId , splitPaymentDto);
  }
}
