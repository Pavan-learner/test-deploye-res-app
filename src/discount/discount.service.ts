import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateDiscountDto } from './dto/createDiscount.dto';
import { DiscountApplyTo, DiscountValueType } from 'generated/prisma';
import { UpdateDiscountDto } from './dto/updateDiscount.dto';

@Injectable()
export class DiscountService {
  constructor(private readonly prismaService: PrismaService) {}

  async createDiscount(createDiscountDto: CreateDiscountDto) {
    try {
      const discount = await this.prismaService.discount.create({
        data: {
          name: createDiscountDto.name,
          valueType: createDiscountDto.valueType as DiscountValueType,
          value: createDiscountDto.value,
          applyTo: createDiscountDto.applyTo as DiscountApplyTo | null,
          restaurantId: createDiscountDto.restaurantId,
          startDate: createDiscountDto.startDate || new Date(),
          endDate: createDiscountDto.endDate || new Date(),
        },
      });

      return discount;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error creating discount',
        error.message,
      );
    }
  }

  async updateDiscount(id: string, updatediscountDto: UpdateDiscountDto) {
    // Logic to update a discount
    try {
      const discount = await this.prismaService.discount.update({
        where: {
          id: id,
        },
        data: {
          name: updatediscountDto.name,
          valueType: updatediscountDto.valueType as DiscountValueType,
          value: updatediscountDto.value,
          applyTo: updatediscountDto.applyTo as DiscountApplyTo | null,
          restaurantId: updatediscountDto.restaurantId,
          startDate: updatediscountDto.startDate || new Date(),
          endDate: updatediscountDto.endDate || new Date(),
        },
      });

      return discount;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error updating discount',
        error.message,
      );
    }
  }

  async deleteDiscount(id: string) {
    try {
      return await this.prismaService.discount.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error deleting discount or it may already be deleted',
      );
    }
  }

  async getDiscount(id: string) {
    try {
      return await this.prismaService.discount.findUnique({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error getting discount');
    }
  }

  async getDiscounts( page: number, limit : number) {
    try {
      // here we are storing the value that is used to skip the records based on the page
      /* 
        page  = 1 limit = 10
      offset = 1-0 * 10 = (0)

        page = 2 limit = 10
      offset = 2-1 * 10 = 10 

        page = 3 limit = 10 
      offset = 3-1 * 10 = 20 

      */
     
      const offset = (page - 1) * limit;

      const discounts  = await this.prismaService.discount.findMany({
        skip: offset,
        take: limit,
        orderBy: {
          createdAt: 'asc',
        },
      });

      // Getting the total number of categories in the database 
      const total = await this.prismaService.discount.count();

      const hasPreviousPage = offset > 0;
      const hasNextPage = offset + limit  < (Math.ceil(total / limit))

      return {
        discounts,
        totalRecords: total,
        page,
        limit,
        hasPreviousPage,
        hasNextPage,
      };

    } catch (error) {
      throw new InternalServerErrorException('error retrieving discounts');
    }
  }

  async getDiscountForRestaurant(restaurantId: string , page: number, limit: number) {
    try {
      // here we are storing the value that is used to skip the records based on the page
      /* 
        page  = 1 limit = 10
      offset = 1-0 * 10 = (0)

        page = 2 limit = 10
      offset = 2-1 * 10 = 10 

        page = 3 limit = 10 
      offset = 3-1 * 10 = 20 

      */
     
      const offset = (page - 1) * limit;

      const discounts  = await this.prismaService.discount.findMany({
        skip: offset,
        take: limit,
        where: {
          restaurantId: restaurantId,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      // Getting the total number of categories in the database 
      const total = await this.prismaService.discount.count();

      const hasPreviousPage = offset > 0;
      const hasNextPage = offset + limit  < (Math.ceil(total / limit))

      return {
        discounts,
        totalRecords: total,
        page,
        limit,
        hasPreviousPage,
        hasNextPage,
      };

    } catch (error) {
      throw new InternalServerErrorException(
        'Error retrieving discounts for restaurant',
        error.message,
      );
    }
  }
}
