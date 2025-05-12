import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { MenuSettingsService } from './menu-settings.service';
import { CreateMenuSettingsDto } from './dto/createMenuSettings.dto';
import { UpdateMenuSettingsDto } from './dto/updateMenuSettings.dto';

@Controller('restaurant/menu-settings')
export class MenuSettingsController {
  constructor(private readonly menuSettingsService: MenuSettingsService) {}

  @Post()
  async createMenuSettings(@Body() createMenuSettingsDto : CreateMenuSettingsDto) {
    return this.menuSettingsService.createMenuSettings(createMenuSettingsDto);
  }


  @Patch(':id')
  async updateMenuSettings(@Param('id') id: string, @Body() updateMenuSettingsDto : UpdateMenuSettingsDto) {
    return this.menuSettingsService.updateMenuSettings(id , updateMenuSettingsDto);
  }


  @Delete(':id')
  async deleteMenuSettings(@Param('id') id: string) {
    return this.menuSettingsService.deleteMenuSettings(id);
  }

  @Get()
  async getMenuSettings() {
    return this.menuSettingsService.getMenuSettings();
  }

  @Get(":id")
  async getMenuSettingsById(@Param('id') id: string) {
    return this.menuSettingsService.getMenuSettingsById(id);

}

  @Get(':resId/restaurant')
  async getMenuSettingsByRestaurantId(@Param('resId') restaurantId: string) {
    return this.menuSettingsService.getMenuSettingsByRestaurantId(restaurantId);
  }
}