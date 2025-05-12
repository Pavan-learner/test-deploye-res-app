import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AddonService } from './addon.service';
import { createAddonDto } from './dto/createaddon.dto';
import { UpdateAddonDto } from './dto/updateaddon.dto';

@Controller('restaurant/addon')
export class AddonController {
  constructor(private readonly addonService: AddonService) {}

  @Post()
  async createAddon(@Body() createAddonDto: createAddonDto) {
    return this.addonService.createAddon(createAddonDto);
  }

  // updating the addon
  @Patch(':id')
  async updateAddon(
    @Param('id') id: string,
    @Body() updateAddonDto: UpdateAddonDto,
  ) {
    return this.addonService.updateAddon(updateAddonDto , id);
  }

  // deleting the addon
  @Delete(':id')
  async deleteAddon(@Param('id') id: string) {
    return this.addonService.deleteAddon(id);
  }

  // getting the addon by id
  @Get(':id')
  async getAddonById(@Param('id') id: string) {
    return this.addonService.getAddonById(id);
  }

  // getting all the addons
  @Get()
  async getAllAddons() {
    return this.addonService.getAllAddons();
  }
}
