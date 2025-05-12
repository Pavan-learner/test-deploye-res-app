import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { DiscountService } from './discount.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateDiscountDto } from './dto/createDiscount.dto';
import { UpdateDiscountDto } from './dto/updateDiscount.dto';

@Controller('restaurant/discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post()
  async createDiscount(@Body() creatediscountDto: CreateDiscountDto) {
    return this.discountService.createDiscount(creatediscountDto);
  }

  @Patch(':id')
  async updateDiscount(
    @Param('id') id: string,
    @Body() updatediscountDto: UpdateDiscountDto,
  ) {
    return this.discountService.updateDiscount(id, updatediscountDto);
  }

  @Delete(':id')
  async deleteDiscount(@Param('id') id: string) {
    return this.discountService.deleteDiscount(id);
  }

  @Get(':page/:limit')
  async getAllDiscounts(@Param('page', ParseIntPipe) page: number, @Param('limit', ParseIntPipe) limit: number) {
    return this.discountService.getDiscounts(page , limit);
  }
  @Get(':id')
  async getDiscount(@Param('id') id: string) {
    return this.discountService.getDiscount(id);
  }

  // This route is getting all discounts for a restaurant
  @ApiOperation({ summary: 'Get all the discounts for a restaurant' })
  @Get(':resid/restaurant/:page/:limit')
  async getDiscountForRestaurant(@Param('resid') id: string , @Param('page', ParseIntPipe) page: number, @Param('limit', ParseIntPipe) limit: number) {
    return this.discountService.getDiscountForRestaurant(id , page , limit);
  }
}
