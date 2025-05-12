import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreatePaymentDto } from './dto/createPayment.dto';
import { UpdatePaymentDto } from './dto/updatePayment.dto';

@Injectable()
export class PaymentService {
  constructor(private readonly prismaService: PrismaService) {}

  // here we will create a payment for the order
  async createPayment(createPaymentDto: CreatePaymentDto) {
    // create the payment for the order
    const payment = await this.prismaService.payment.create({
      data: {
        orderId: createPaymentDto.orderId,
        amount: createPaymentDto.amount,
        payment_status: 'INITALIZED',
      },
    });

    if (!payment) {
      throw new InternalServerErrorException(
        'Error creating payment for order ',
      );
    }

    return {
      status: 'INITALIZED',
      payment,
    };
  }

  // if the customer paid the order without splitting the order
  async updatePaymentStatus(paymentId:string , updatePaymentDto: UpdatePaymentDto) {
    try {
        const payment = await this.prismaService.payment.update({
            where: {
            id: paymentId
            },
            data: {
            payment_status: updatePaymentDto.payment_status,
            paymentMethod: updatePaymentDto.payment_method,
            },
        });
    
        if (!payment) {
            throw new InternalServerErrorException(
            'Error updating payment for order or payment not found ',
            );
        }
    
        return {
            status: 'SUCCESS',
            payment,
        };
    } catch (error) {
      throw new InternalServerErrorException('Error updating payement');
    }
  }
}
