import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TableService } from './table.service';
import { CreateTableDto } from './dto/createTable.dto';
import { UpdateTableDto } from './dto/updateTable.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('restaurant/table')
export class TableController {
  constructor(private readonly tableService: TableService) {}

  // Creating of a table
  @Post()
  async createTable(@Body() cratetabledto: CreateTableDto) {
    return this.tableService.createTable(cratetabledto);
  }

  // Updating of a table
  @Patch(':id')
  async updateTable(
    @Param('id') id: string,
    @Body() updatetableDto: UpdateTableDto,
  ) {
    return this.tableService.updateTable(id, updatetableDto);
  }

  // Deleting of a table
  @Delete(':id')
  async deleteTable(@Param('id') id: string) {
    return this.tableService.deleteTable(id);
  }

  // Getting the tables based for the restaurant id
  @Get(':resid/restaurant')
  @ApiOperation({
    summary: 'Get all tables for a specific restaurant by restaurantId'})
  async findByRestaurantId(@Param('resid') id: string) {
    return this.tableService.findByRestaurantId(id);
  }


  // Getting all tables
  @Get(':sectionId/section')
  @ApiOperation({
    summary: 'Get all tables for a specific section by sectionId'})
  async getAllTables(@Param('sectionId') sectionId: string) {
    return this.tableService.getAllTables(sectionId);
  }

  // Getting a table by id
  @Get(':id')
  async getTableById(@Param('id') id: string) {
    return this.tableService.getTableById(id);
  }
}
