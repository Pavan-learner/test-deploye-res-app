import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { RestaurantServicesService } from './restaurant-services.service';
import { CreateRestaurantServiceDto } from './dto/createRestaurantService.dto';
import { updateRestaurantServiceDto } from './dto/updateRestaurantService.dto';

@Controller('restaurant/services')
export class RestaurantServicesController {
  constructor(
    private readonly restaurantServicesService: RestaurantServicesService,
  ) {}

  // Create a new restaurant service
  @Post()
  async createRestaurantService(
    @Body() CreateRestaurantServiceDto: CreateRestaurantServiceDto,
  ) {   
    return this.restaurantServicesService.createRestaurantService(
      CreateRestaurantServiceDto,
    );
  }

  // Update a restaurant service by ID
  @Patch(':id')
  async updateRestaurantServiceById(
    @Param('id') id: string,
    @Body() updateRestaurantServiceDto: updateRestaurantServiceDto,
  ) {
    return this.restaurantServicesService.updateRestaurantServiceById(
      id,
      updateRestaurantServiceDto,
    );
  }

  // Get all restaurant services by restaurant ID
  @Delete(':resserviceId')
  async deleteRestaurantServiceById(
    @Param('resserviceId') serviceId: string,
  ) {
    return this.restaurantServicesService.deleteRestaurantServiceById(
      serviceId,
    );
  }

  // Get the restaurant service based on the restaurant ID
  @Get(':restaurantId/restaurant')
    async getRestaurantServiceByRestaurantId(
    @Param('restaurantId') restaurantId: string,
  ) {
    return this.restaurantServicesService.getRestaurantServiceByRestaurantId(
      restaurantId,
    );
  }

  // Get the restaurant service by ID
  @Get(':id')
  async getRestaurantServiceById(
    @Param('id') id: string,
  ) {
    return this.restaurantServicesService.getRestaurantServiceById(
      id,
    );
  }

  // Get all restaurant services
  @Get()
  async getAllRestaurantServices() {
    return this.restaurantServicesService.getAllRestaurantServices();
  }
}
