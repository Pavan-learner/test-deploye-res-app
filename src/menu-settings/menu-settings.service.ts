import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { UpdateMenuSettingsDto } from './dto/updateMenuSettings.dto';
import { CreateMenuSettingsDto } from './dto/createMenuSettings.dto';

@Injectable()
export class MenuSettingsService {
    constructor(private readonly prismaService : PrismaService) {}

    async createMenuSettings(createMenuSettingsDto : CreateMenuSettingsDto) {
        
        return this.prismaService.menuSettings.create({
            data: {
                view : createMenuSettingsDto.view,
                isShowImage : createMenuSettingsDto.isShowImage,
                isHidePrice : createMenuSettingsDto.isHidePrice,
                surchargeStatus : createMenuSettingsDto.surchargeStatus,
                surcharge : createMenuSettingsDto.surcharge,
                restaurantId : createMenuSettingsDto.restaurantId,
            },
        });
    }

    async updateMenuSettings(id : string ,  updatemenuSettings : UpdateMenuSettingsDto) {
        return this.prismaService.menuSettings.update({
            where: { id: id },
            data: {
                view : updatemenuSettings.view,
                isShowImage : updatemenuSettings.isShowImage,
                isHidePrice : updatemenuSettings.isHidePrice,
                surchargeStatus : updatemenuSettings.surchargeStatus,
                surcharge : updatemenuSettings.surcharge,
                restaurantId : updatemenuSettings.restaurantId,
            },
        });
    }

    async deleteMenuSettings(id : string ) {
        return this.prismaService.menuSettings.delete({
            where: { id: id },
        });
    }
    async getMenuSettings() {
        return this.prismaService.menuSettings.findMany();
    }
    async getMenuSettingsById(id : string) {
        return this.prismaService.menuSettings.findUnique({
            where: { id: id },
        });
    }

    async getMenuSettingsByRestaurantId(restaurantId : string) {
        return this.prismaService.menuSettings.findMany({
            where: { restaurantId: restaurantId },
        });
    }
}
