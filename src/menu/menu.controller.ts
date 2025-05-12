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
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/createMenu.dto';
import { ApiOperation, ApiProperty } from '@nestjs/swagger';
import { UpdateMenuDto } from './dto/updateMenu.dto';

@Controller('restaurant/menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @ApiProperty()
  @Post()
  createMenu(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.createMenu(createMenuDto);
  }

  @ApiProperty()
  @Patch(':id')
  updateMenu(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.updateMenu(id, updateMenuDto);
  }

  @ApiProperty()
  @Delete(':id')
  deleteMenu(@Param('id') id: string) {
    return this.menuService.deleteMenu(id);
  }

  @ApiProperty()
  @ApiOperation({ summary: 'Get all the menu [CRUD route]' })
  @Get(':page/:limit')
  getAllMenu(@Param('page', ParseIntPipe) page: number, @Param('limit', ParseIntPipe) limit: number) {
    return this.menuService.getAllMenu(page , limit);
  }

  @ApiProperty()
  @ApiOperation({ summary: 'Get single menu by id [CRUD route]' })
  @Get(':id')
  getMenu(@Param('id') id: string) {
    return this.menuService.getMenuById(id);
  }

  // from we have to get the menu based on the restaurants by the id
  @ApiProperty()
  @ApiOperation({
    summary: 'Get all the menu of the restaurant based on the id',
  })
  @Get(':resId/restaurant/:page/:limit')
  getAllMenuByRestaurant(@Param('resId') restaurantId: string , @Param('page', ParseIntPipe) page: number, @Param('limit', ParseIntPipe) limit: number) {
    return this.menuService.getAllMenuByRestaurantId(restaurantId , page , limit);
  }

  @ApiProperty()
  @ApiOperation({ summary: 'Get single menu based for the restaurant' })
  @Get(':id/menu/:resId/restaurant')
  getSingleMenuByRestaurant(
    @Param('id') id: string,  
    @Param('resId') resId: string,
  ) {
    return this.menuService.getMenuByRestaurantId(id, resId);
  }

  @ApiProperty()
  @ApiOperation({
    summary:
      'Get all the menu based on the restaurant id and category based menu',
  })
  @Get(':resId/restaurant/:catId/category')
  getAllMenuByRestaurantAndCategory(
    @Param('resId') restaurantId: string,
    @Param('catId') categoryId: string,
    @Param('page', ParseIntPipe) page: number,
    @Param('limit', ParseIntPipe) limit: number,
  ) {
    return this.menuService.getAllMenuByRestaurantAndCategory(
      restaurantId,
      categoryId,
      page,
      limit,
    );
  }
}
