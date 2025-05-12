import { Module } from '@nestjs/common';
import { RestaurantServicesController } from './restaurant-services.controller';
import { RestaurantServicesService } from './restaurant-services.service';

@Module({
  controllers: [RestaurantServicesController],
  providers: [RestaurantServicesService]
})
export class RestaurantServicesModule {}
