import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { UpdateRestaurantDto } from './dto/updateRestaurant.dto';

@Injectable()
export class RestaurantService {
  constructor(private readonly prismaService: PrismaService) {}

  // CRUD operations for restaurant
  async updateRestaurant(id: string, updateData: UpdateRestaurantDto) {
    try {
      const restaurant = await this.prismaService.restaurant.update({
        where: { id },
        data: {
          name: updateData.name,
          address: updateData.address,
          bussinessPhone: updateData.bussinessPhone,
          bussinessEmail: updateData.bussinessEmail,
          city: updateData.city,
          zipCode: updateData.zipCode,
          businessHours: updateData.businessHours,
        },
      });

      if (!restaurant) {
        throw new NotFoundException('Restaurant not found');
      }
      return {
        success: true,
      };
    } catch (error) {
      throw new Error('Error updating restaurant');
    }
  }

  async deleteRestaurant(id: string) {
    try {
      const restaurant = await this.prismaService.restaurant.delete({
        where: { id },
      });
      if (!restaurant) {
        throw new NotFoundException('Restaurant not found');
      }
      return {
        success: true,
      };
    } catch (error) {
      throw new Error('Error deleting restaurant');
    }
  }

  //  Retrieves details of a specific restaurant by its ID with it's staffs and owner details.
  async getRestaurantById(id: string) {
    try {
      const restaurant = await this.prismaService.restaurant.findUnique({
        where: { id },
        include: {
          owner: true,
          staffs: true,
          restaurantServices: true,
          taxes: true,
          charges: true,
        },
      });

      // Check if restaurant exists
      if (!restaurant) {
        throw new NotFoundException('Restaurant not found');
      }
      return restaurant;
    } catch (error) {
      throw new Error('Error fetching restaurant by ID');
    }
  }

  // Retrieves information about the owner of the restaurant.
  async getOwner(id: string) {
    try {
      // Fetch restaurant with owner data in a single query
      const restaurant = await this.prismaService.restaurant.findUnique({
        where: { id },
        include: {
          owner: true,
        },
      });

      if (!restaurant) {
        throw new NotFoundException('Restaurant not found');
        
      }

      if (!restaurant.owner) {
        throw new NotFoundException('Restaurant not found');
      }

      return {
        owner : restaurant.owner,
      };
    } catch (error) {
      throw new Error(`Error fetching restaurant owner: ${error.message}`);
    }
  }

  //  Returns a list of users associated with the specified restaurant
  async getUsersByRestaurantId(id: string) {
    try {
      const restaurantStaffs = await this.prismaService.restaurant.findUnique({
        where: { id },
        include: {
          staffs: {
            where: {
              role: 'EMPLOYEE', // Only include users with STAFF role
            },
          },
        },
      });

      if (!restaurantStaffs) {
        throw new NotFoundException('Restaurant not found');
      }
      return {
        staffs: restaurantStaffs.staffs,
      };
    } catch (error) {
      throw new InternalServerErrorException('Error fetching restaurant users');
    }
  }
}
