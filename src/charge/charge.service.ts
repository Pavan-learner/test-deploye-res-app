import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateChargeDto } from './dto/createCharge.dto';

@Injectable()
export class ChargeService {
    constructor(private readonly prismaService : PrismaService){}

    async createCharge(createchargeDto : CreateChargeDto) {
        // Logic to create a charge
        return this.prismaService.charge.create({
            data: {
                name: createchargeDto.name,
                chargeType: createchargeDto.chargeType,
                chargeCost: createchargeDto.chargeCost,
                applyTo: createchargeDto.applyTo,
                status: createchargeDto.status,
                restaurantId: createchargeDto.restaurantId,
            }
        });
    }

    async updateCharge(id: string, updateChargeDto: any) {
        // Logic to update a charge
        return this.prismaService.charge.update({
            where: { id },
            data: updateChargeDto,
        });
    }
    async deleteCharge(id: string) {
        // Logic to delete a charge
        return this.prismaService.charge.delete({
            where: { id },
        });
    }
    async getChargeByRestaurant(resid: string , page: number, limit: number) {
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

      const charges  = await this.prismaService.charge.findMany({
        skip: offset,
        take: limit,
        where: {
          restaurantId: resid,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      // Getting the total number of categories in the database 
      const total = await this.prismaService.charge.count();

      const hasPreviousPage = offset > 0;
      const hasNextPage = offset + limit  < (Math.ceil(total / limit))

      return {
        charges,
        totalRecords: total,
        page,
        limit,
        hasPreviousPage,
        hasNextPage,
      };

      } catch (error) {
        throw new InternalServerErrorException('Error fetching charge by restaurant ID');
      }
    }

    async getCharge(id: string) {
        // Logic to get a charge by ID
        return this.prismaService.charge.findUnique({
            where: { id },
        });
    }
    async getAllCharges(page : number, limit : number) {
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

      const charges  = await this.prismaService.charge.findMany({
        skip: offset,
        take: limit,
        orderBy: {
          createdAt: 'asc',
        },
      });

      // Getting the total number of categories in the database 
      const total = await this.prismaService.charge.count();

      const hasPreviousPage = offset > 0;
      const hasNextPage = offset + limit  < (Math.ceil(total / limit))

      return {
        charges,
        totalRecords: total,
        page,
        limit,
        hasPreviousPage,
        hasNextPage,
      };

    }


}
