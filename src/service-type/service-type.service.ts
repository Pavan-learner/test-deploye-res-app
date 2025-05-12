import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { createServiceTypeDto } from './dto/createServiceType.dto';
import { updateServiceTypeDto } from './dto/updateServiceType.dto';

@Injectable()
export class ServiceTypeService {
  // This is another method to initlize the PrismaService
  private readonly prismaService: PrismaService;
  constructor() {
    this.prismaService = new PrismaService();
  }

  // Method to create a service type
  async createServiceType(createservicetypeDto:createServiceTypeDto) {
    return await this.prismaService.serviceType.create({
      data: {
        name : createservicetypeDto.name,
      },
    });
  }

  // Method to get all service types
  async getAllServiceTypes() {
    return await this.prismaService.serviceType.findMany();
  }

  // Method to get a service type by ID
  async getServiceTypeById(servicetypeid: string) {
    return await this.prismaService.serviceType.findUnique({
      where: {
        id: servicetypeid,
      },
    });
  }

    // Method to update a service type by ID
    async updateServiceTypeById(servicetypeid: string, updateservicetype:updateServiceTypeDto) {
      return await this.prismaService.serviceType.update({
        where: {
          id: servicetypeid,
        },
        data: {
          name : updateservicetype.name,
        },
      });
    }

    async deleteServiceTypeById(servicetypeid: string ){
        try {
            const deletedServiceType = await this.prismaService.serviceType.delete({
                where: {
                    id: servicetypeid,
                },
            });

            if(!deletedServiceType) {
                throw new NotFoundException('Service type not found');
            }
            // Return the deleted service type
            return {
               success : true
            }
        } catch (error) {
            throw new InternalServerErrorException('Error deleting service type', error);
        }
    }

}
