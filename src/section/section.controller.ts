import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { SectionService } from './section.service';
import { CreateSectionDto } from './dto/createSection.dto';
import { UpdateSectionDto } from './dto/updateSection.dto';

@Controller('restaurant/section')
export class SectionController {
  constructor(private readonly sectionService: SectionService) {}

  @Post()
  async create(@Body() createSectionDto: CreateSectionDto) {
    return this.sectionService.create(createSectionDto);
  }

  @Patch(':id')
  async update(@Param('id') id: string ,@Body() updateSectionDto: UpdateSectionDto) {
    return this.sectionService.update(id, updateSectionDto);
  }


  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.sectionService.remove(id);
  }

  // Getting the sections based on the restaurant id
  @Get(':resid/restaurant')
  async findByRestaurantId(@Param('resid') id: string) {
    return this.sectionService.findByRestaurantId(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.sectionService.findOne(id);
  }

  @Get()
  async findAll() {
    return this.sectionService.findAll();
  }

  

}
