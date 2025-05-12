import { Controller, Get, Param, Patch , Delete, Body } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { UpdateRestaurantDto } from './dto/updateRestaurant.dto';

@Controller('restaurant/details')
export class RestaurantController {

    constructor(private readonly restaurantService: RestaurantService){};


    // CRUD operations for restaurant
    @Patch(':id')
    async updateRestaurant(@Param('id') id:string , @Body() updateData: UpdateRestaurantDto){
        return await this.restaurantService.updateRestaurant(id , updateData);
    }

    //  Delete the restaurant by its ID.
    @Delete(':id')
    async deleteRestaurant(@Param('id') id:string){
        return await this.restaurantService.deleteRestaurant(id);
    }

    //  Retrieves details of a specific restaurant by its ID.
    @Get(':id')
    async getRestaurant(@Param('id') id: string) {
        return await this.restaurantService.getRestaurantById(id);
    }

    // Retrieves information about the owner of the restaurant.
    @Get(':id/owner')
    async getOwner(@Param('id') id:string){
        return await this.restaurantService.getOwner(id);
    }

    //  Returns a list of users associated with the specified restaurant.
    @Get(':id/users')
    async getUsersByRestaurantId(@Param('id') id:string){
        return await this.restaurantService.getUsersByRestaurantId(id);
    }
}
