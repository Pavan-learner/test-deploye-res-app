import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { createAddonGroupDto } from './dto/createAddonGroup.dto';

@Injectable()
export class AddonsGroupService {
  constructor(private readonly prismaService: PrismaService) {}

  // This function is for creating a new addon group for the product
  async create(createAddonsGroupDto: createAddonGroupDto) {
    return this.prismaService.addonGroup.create({
      data:{
        name: createAddonsGroupDto.name,
        description: createAddonsGroupDto.description,
        minSelection: createAddonsGroupDto.minSelection,
        maxSelection: createAddonsGroupDto.maxSelection,
        isRequired: createAddonsGroupDto.isRequired,
        restaurantId: createAddonsGroupDto.restaurantId,
        },
    });
  }

  // This function is for updating an addon group

  async update(id: string, updateAddonsGroupDto: createAddonGroupDto) {
    return this.prismaService.addonGroup.update({
      where: { id },
      data: {
        name: updateAddonsGroupDto.name,
        description: updateAddonsGroupDto.description,
        minSelection: updateAddonsGroupDto.minSelection,
        maxSelection: updateAddonsGroupDto.maxSelection,
        isRequired: updateAddonsGroupDto.isRequired,
        restaurantId: updateAddonsGroupDto.restaurantId,
      },
    });
  }

  // this function is delete the addon group
  async delete(id: string) {
    return this.prismaService.addonGroup.delete({
      where: { id },
    });
  }

  // This function is for getting all addon groups for the product
  async findAll() {
    return this.prismaService.addonGroup.findMany({
      include: {
        addonGroupItems: true,
      },
    });
  }

  // This function is for getting a single addon group
  async findOne(id: string) {
    return this.prismaService.addonGroup.findUnique({
      where: { id },
      include: {
        addonGroupItems: true,
      },
    });
  }

}
