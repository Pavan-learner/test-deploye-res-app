import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { createOrderDetailDto } from './dto/createOrderDetail.dto';

@Injectable()
export class OrderDetailService {
    constructor(private readonly prismaService: PrismaService) {}

    async createOrderDetail(createOrderDetailDto: createOrderDetailDto) {
        try {
            // here we are creating the order detail becuase after this we have to update the order model 

            const orderDetail = await this.prismaService.orderDetail.create({
                data: createOrderDetailDto,
            })

            // const here we are updating the order model with the order detail id
            // calculating total price of the order detail
            const totalPrice = orderDetail.quantity * orderDetail.price;
            const order = await this.prismaService.order.update({
                where: { id: orderDetail.orderId },
                data: {
                    total_amount: {
                        increment: totalPrice,
                    },
                },
            });

            return {
                orderDetail: orderDetail,
                order: order,
            }

        } catch (error) {
            throw new InternalServerErrorException("Error creating order detail", error.message);
        }
    }


    async updateOrderDetail(id: string, updateOrderDetailDto: createOrderDetailDto) {
        return await this.prismaService.orderDetail.update({
            where: { id },
            data: updateOrderDetailDto,
        });
    }

    async deleteOrderDetail(id: string) {
        return await this.prismaService.orderDetail.delete({
            where: { id },
        });
    }

    async getOrderDetailById(id: string) {
        return await this.prismaService.orderDetail.findUnique({
            where: { id },
        });
    }
    async getAllorderDetail() {
        return await this.prismaService.orderDetail.findMany();
    }
    async getorderDetailByOrderId(orderId: string) {
        return await this.prismaService.orderDetail.findMany({
            where: { orderId },
        });
    }
    async getorderDetailByMenuId(menuId: string) {
        return await this.prismaService.orderDetail.findMany({
            where: { menuId },
        });
    }
        
}
