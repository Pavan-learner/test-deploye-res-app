import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiProperty } from '@nestjs/swagger';
import { CreateMenuVariantDto } from './dto/createMenuVariant.dto';
import { MenuVariantService } from './menu-variant.service';

@Controller('restaurant/menu-variant')
export class MenuVariantController {
  constructor(private readonly menuVariantService: MenuVariantService) {}

  @ApiOperation({ summary: 'Create a new menu variant' })
  @Post()
  @ApiProperty()
  createMenuVariant(@Body() createMenuVariantDto: CreateMenuVariantDto) {
    return this.menuVariantService.createMenuVariant(createMenuVariantDto);
  }

  @ApiOperation({ summary: 'Get the menu variant by id' })
  @Delete(':id')
  @ApiProperty()
  getMenuVariant(@Param('id') id: string) {
    return this.menuVariantService.deleteMenuVariant(id);
  }
}
