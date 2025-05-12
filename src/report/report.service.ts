import { Injectable } from '@nestjs/common';
import { OrderStatus } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class ReportService {
  constructor(private readonly prismaService: PrismaService) {}

  // Get all the orders based on the restaurant id
  async getOrders(resId: string, page: number, limit: number) {
    
    const offset = (page - 1) * limit;

    const totalOrders = await this.prismaService.order.count({
      where: {
        restaurantId: resId,
      },
    });

    const hasPreviousPage = offset > 0;
    const hasNextPage = offset + limit < Math.ceil(totalOrders / limit);

    const orders = await this.prismaService.order.findMany({
      skip: offset,
      take: limit,
      where: {
        restaurantId: resId,
      },
      include: {
        orderDetails: true,
      },
    });

    return {
      totalOrders,
      page,
      limit,
      orders,
      hasPreviousPage,
      hasNextPage,
    };
  }

  // Get all the orders based on the restaurant id and order status
  async getOrdersByStatus(resId: string, status: string , page: number, limit: number) {

    const offset = (page - 1) * limit;
    const totalOrders = await this.prismaService.order.count({
      where: {
        restaurantId: resId,
      },
    });

    const hasPreviousPage = offset > 0;
    const hasNextPage = offset + limit < Math.ceil(totalOrders / limit);

    const orders = await this.prismaService.order.findMany({
      skip: offset,
      take: limit,
      where: {
        restaurantId: resId,
        status: status as OrderStatus,
      },
      include: {
        orderDetails: true,
      },
    });

    return {
      totalOrders,
      page,
      limit,
      orders,
      hasPreviousPage,
      hasNextPage,
    };
  }

  // Filter options by different fields with pagination 
  async filterOrderByDate(resId: string, startDate: string, endDate: string, page: number, limit: number) {

    const offset = (page - 1) * limit;
    const totalOrders = await this.prismaService.order.count({
      where: {
        restaurantId: resId,
      },
    });
    const hasPreviousPage = offset > 0;
    const hasNextPage = offset + limit < Math.ceil(totalOrders / limit);
    
    const orders = await this.prismaService.order.findMany({
        skip: offset,
        take: limit,
        where: {
            restaurantId: resId,
            createdAt: {
            gte: new Date(startDate),
            lte: new Date(endDate),
            },
        },
        include: {
            orderDetails: true,
        },
        });

    return {
        totalOrders,
        page,
        limit,
        orders,
        hasPreviousPage,
        hasNextPage,
    };
  }

}
