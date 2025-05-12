import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ReportService } from './report.service';

@Controller('restaurant/report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  // Get all the orders based on the restaurant id
  @Get(':resId/orders/:page/:limit')
  async getOrder(@Param('resId') resId: string , @Param('page', ParseIntPipe) page: number, @Param('limit', ParseIntPipe) limit: number) {
    return await this.reportService.getOrders(resId , page , limit);
  }

  // Get all the order based on the restaurant id and order status
  @Get(':resId/orders/:status/:page/:limit')
  async getOrderByStatus(@Param('resId') resId: string, @Param('status') status: string , @Param('page', ParseIntPipe) page: number, @Param('limit', ParseIntPipe) limit: number) {
    return await this.reportService.getOrdersByStatus(resId, status , page, limit);
  }
  
  // Get all the order based on the date and restaurant id
  @Get(':resId/orders/:startDate/:endDate/:page/:limit')
  async getOrderByDate(@Param('resId') resId: string, @Param('startDate') startDate: string , @Param('endDate') endDate: string , @Param('page', ParseIntPipe) page: number, @Param('limit', ParseIntPipe) limit: number) {
    return await this.reportService.filterOrderByDate(resId, startDate, endDate , page, limit);
  }

  // now we have to implement filter options by different fields with pagination
  
}
