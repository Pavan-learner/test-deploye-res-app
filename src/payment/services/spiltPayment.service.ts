import { Injectable } from '@nestjs/common';
import { SplitPaymentDto } from '../dto/splitPayment.dto';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class SplitPaymentService {
  constructor(private readonly prismaService: PrismaService) {}

  async splitPayment(
    paymentId: string,
    orderId: string,
    splitPaymentDto: SplitPaymentDto,
  ) {

    // here we will split the payment for the order

    // this array will contain the split payment ids
    const spilts : string[] = [];
    for (let i = 0; i < splitPaymentDto.splitNumber; i++) {
      console.log(i)
      
      const item = await this.createSplitPayment(paymentId, orderId, splitPaymentDto);
      spilts.push(item.spiltPaymentId);
    }
    return {
      status: true,
      splitPaymentIds: spilts,
    };
  }

  // * from here we will call the main function to update.
  async updateSplit(splitId: string, splitPaymentDto: SplitPaymentDto) {
    // here we will update the split payment for the order
    await this.updateSplitPayment(splitId, splitPaymentDto);
    return {
      status: true,
    };
  }

  // * helper function to create the single spilt order
  async createSplitPayment(
    paymentId: string,
    orderId: string,
    splitPaymentDto: SplitPaymentDto,
  ) {

    const divided_amount = splitPaymentDto.amount / splitPaymentDto.splitNumber;
    console.log(divided_amount, 'divided_amount')
    // here we will create the split payment for the order
    const payment = await this.prismaService.splitPayment.create({
      data: {
        orderId: orderId,
        paymentid: paymentId,
        amount: divided_amount,
        paymentMethod: splitPaymentDto.paymentMethod,
        payment_status: splitPaymentDto.payment_status,
      },
    });
    return {
      spiltPaymentId: payment.id,
      status: true,
    };
  }

  async updateSplitPayment(splitId: string, splitPaymentDto: SplitPaymentDto) {
    // here we will update the split payment for the order
    const payment = await this.prismaService.splitPayment.update({
      where: {
        id: splitId,
      },
      data: {
        amount: splitPaymentDto.amount,
        paymentMethod: splitPaymentDto.paymentMethod,
        payment_status: splitPaymentDto.payment_status,
      },
    });
    return {
      status: true,
    };
  }
}
