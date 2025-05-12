import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { createAddonDto } from './dto/createaddon.dto';
import { updateAddonGroupDto } from 'src/addons_group/dto/updateAddonGroup.dto';
import { UpdateAddonDto } from './dto/updateaddon.dto';

@Injectable()
export class AddonService {
  constructor(private readonly prismaService: PrismaService) {}

  async createAddon(createAddonDto: createAddonDto) {
    return await this.prismaService.addonGroupItem.create({
      data: {
        name: createAddonDto.name,
        price: createAddonDto.price,
        addonGroupId: createAddonDto.addonGroupId,
        isAvailable: createAddonDto.isAvailable,
        menuId: createAddonDto.menuId,
      },
    });
  }

  async updateAddon(updateAddonDto: UpdateAddonDto , id : string) {
    return await this.prismaService.addonGroupItem.update({
      where: { id: id},
      data: {
        name: updateAddonDto.name,
        price: updateAddonDto.price,
        addonGroupId: updateAddonDto.addonGroupId,
        isAvailable: updateAddonDto.isAvailable,
        menuId: updateAddonDto.menuId,
      },
    });
  }

  async deleteAddon(id: string) {
    return await this.prismaService.addonGroupItem.delete({
      where: { id },
    });
  }

  async getAddonById(id: string) {
    return await this.prismaService.addonGroupItem.findUnique({
      where: { id },
    });
  }

  async getAllAddons() {
    return await this.prismaService.addonGroupItem.findMany();
  }

  async getAddonByGroupId(groupId: string) {
    return await this.prismaService.addonGroupItem.findMany({
      where: { addonGroupId: groupId },
    });
  }
}
