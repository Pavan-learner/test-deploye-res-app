import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateRestaurantServiceDto } from './dto/createRestaurantService.dto';
import { updateRestaurantServiceDto } from './dto/updateRestaurantService.dto';

@Injectable()
export class RestaurantServicesService {
    constructor(private readonly prismaService: PrismaService) {}

    // for create a restaurant service
    async createRestaurantService(restaurantServiceDto: CreateRestaurantServiceDto) {
       try {
        console.log("the request came to service", restaurantServiceDto);
        const response = await this.prismaService.restaurantService.create({
            data: {
                restaurantId: restaurantServiceDto.restaurantId,
                serviceTypeId: restaurantServiceDto.serviceTypeId,
                status: restaurantServiceDto.status,
            },
        });

        if(!response){
            throw new InternalServerErrorException('Error creating restaurant service');
        }

        return response;
        
       } catch (error) {
        throw new InternalServerErrorException('Error creating restaurant service');
       }
    }


    //  for get all restaurant services
    async getAllRestaurantServices() {
        return await this.prismaService.restaurantService.findMany({
            include: {
                restaurant: true,
                serviceType: true,
            },
        });
    }


    // Deleting the service by id 
    async deleteRestaurantServiceById(restaurantServiceId: string) {
        const response = await this.prismaService.restaurantService.delete({
            where: {
                id: restaurantServiceId,
            },
        });

        if(!response){
            throw new InternalServerErrorException('Error deleting restaurant service');
        }

        return {
            message: 'Restaurant service deleted successfully',
            data: response,
        }
    }

    // for get restaurant service by id
    async getRestaurantServiceById(restaurantServiceId: string) {
        return await this.prismaService.restaurantService.findUnique({
            where: {
                id: restaurantServiceId,
            },
            include: {
                restaurant: true,
                serviceType: true,
            },
        });
    }


    // for update restaurant service by id
    async updateRestaurantServiceById(restaurantServiceId: string, restaurantServiceDto: updateRestaurantServiceDto) {
        return await this.prismaService.restaurantService.update({
            where: {
                id: restaurantServiceId,
            },
            data: {
                restaurantId: restaurantServiceDto.restaurantId,
                serviceTypeId: restaurantServiceDto.serviceTypeId,
                status: restaurantServiceDto.status,
            },
        });
    }


    // this service is used to get restaurant services for the particular restaurant
    async getRestaurantServiceByRestaurantId(restaurantId: string) {
        const res_service =  await this.prismaService.restaurantService.findMany({
            where: {
                restaurantId: restaurantId,
            },
            include: {
                serviceType: true,
            },
        });


        if(!res_service){
            throw new InternalServerErrorException('Error fetching restaurant services for the restaurant');
        }

        const res_services = res_service.map((service) => {
            return {
                id:service.serviceType.id,
                name: service.serviceType.name,
            }
        })
        
        return res_services;
    }

}
