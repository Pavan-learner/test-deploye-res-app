import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { AddonsGroupService } from './addons_group.service';
import { createAddonGroupDto } from './dto/createAddonGroup.dto';
import { updateAddonGroupDto } from './dto/updateAddonGroup.dto';

@Controller('restaurant/addons-group')
export class AddonsGroupController {
  constructor(private readonly addonsGroupService: AddonsGroupService) {}


  // This route is for creating a new addon group for the product
  @Post()
  async create(@Body () createadddonsGroupDto: createAddonGroupDto) {
    return this.addonsGroupService.create(createadddonsGroupDto);
  }

  // This route is for getting all addon groups for the product
  @Patch(':id')
  async update(@Param('id') id : string ,  @Body() updateadddonsGroupDto: updateAddonGroupDto) {
    return this.addonsGroupService.update(id , updateadddonsGroupDto);
  }

  // Deleting the addon group
  @Delete(':id')
  async delete(@Param('id') id : string , ) {
    return this.addonsGroupService.delete(id);
  }

  // Getting all the addon groups
  @Get()
  async findAll() {
    return this.addonsGroupService.findAll();
  }

  // Getting a single addon group
  @Get(':id')
  async findOne(@Param('id') id : string) {
    return this.addonsGroupService.findOne(id);
  }
  
}
