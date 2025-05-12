import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { UpdateSectionDto } from './dto/updateSection.dto';

@Injectable()
export class SectionService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createSectionDto: any) {
    return this.prismaService.section.create({ data: createSectionDto });
  }

  async update(id: string, updateSectionDto: UpdateSectionDto) {
    return this.prismaService.section.update({
      where: { id },
      data: updateSectionDto,
    });
  }

  async remove(id: string) {
    return this.prismaService.section.delete({ where: { id } });
  }

  async findByRestaurantId(id: string) {
    return this.prismaService.section.findMany({
      where: { restaurantId: id },
    });
  }

  async findOne(id: string) {
    return this.prismaService.section.findUnique({ where: { id } });
  }

  async findAll() {
    return this.prismaService.section.findMany();
  }
}
