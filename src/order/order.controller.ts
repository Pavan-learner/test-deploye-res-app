import { Controller, Delete, Param, Patch, Post , Get, Body, ParseIntPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/createOrder.dto';
import { UpdateOrderDto } from './dto/updateOrder.dto';

@Controller('restaurant/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() createorderdto : CreateOrderDto) {
    return this.orderService.intiateOrder(createorderdto);
  }

  @Patch(':id')
  async updateOrder(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.updateOrder(id , updateOrderDto);
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: string) {
    return this.orderService.deleteOrder(id);
  }

  @ApiOperation({summary:"This route is used to sumbit the order"})
  @Post(':id/submit')
  async sumbitOrder(@Param('id') id: string) {
    return this.orderService.submitOrder(id);
  }

  @ApiOperation({summary:"Get all order for one restaurant based on the id"})
  @Get(":resId/orders/:page/:limit")
  async getOrdersByRestaurantId(@Param('resId') resId: string , @Param('page', ParseIntPipe) page: number, @Param('limit', ParseIntPipe) limit: number) {
    return this.orderService.getOrdersByRestaurantId(resId , page , limit);
  }

  @Get(":id")
  async getOrderById(@Param('id') id: string) {
    return this.orderService.getOrderById(id);
  }

  
  @Get()
  async getAllOrders() {
    return this.orderService.getAllOrders();
  }

}
