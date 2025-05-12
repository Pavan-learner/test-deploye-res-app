import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { OrderDetailService } from './order-details.service';
import { createOrderDetailDto } from './dto/createOrderDetail.dto';
import { UpdateOrderDetailDto } from './dto/updateOrderDetail.dto';

@Controller('order-details')
export class OrderDetailsController {
  constructor(private readonly orderDetailsService: OrderDetailService) {}

  // // Define your endpoints here, for example:
  // @Post()
  // async createOrderDetail(@Body() createOrderDetailDto : createOrderDetailDto) {
  //   return this.orderDetailsService.createOrderDetail(createOrderDetailDto);
  // }

  // @Patch(':id')
  // async updateOrderDetail(@Param('id') id : string , @Body() updateOrderDetail : UpdateOrderDetailDto) {
  //   return this.orderDetailsService.updateOrderDetail(id , updateOrderDetail);
  // }

  // @Delete(':id')
  // async deleteOrderDetail(@Param('id') id : string) {
  //   return this.orderDetailsService.deleteOrderDetail(id);
  // }

  // @Get(':id')
  // async getOrderDetailById(@Param('id') id : string) {
  //   return this.orderDetailsService.getOrderDetailById(id);
  // }


  // @Get()
  // async getAllOrderDetails() {
  //   return this.orderDetailsService.getAllorderDetail();
  // }

}
