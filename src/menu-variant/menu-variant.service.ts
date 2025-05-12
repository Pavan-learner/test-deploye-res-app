import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class MenuVariantService {
  constructor(private readonly prismaService: PrismaService) {}

  // creating new menu variant
  async createMenuVariant(createMenuVariantDto: any) {
    try {
      const menu_variant = await this.prismaService.menuVariant.create({
        data: createMenuVariantDto,
      });

      if (menu_variant) {
        return { message: 'Menu variant created successfully' };
      }
    } catch (error) {
      console.error(error);
      throw new Error('Error creating menu variant');
    }
  }

  // delete menu variant
  async deleteMenuVariant(id: string) {
    try {
      const menuVariant = await this.prismaService.menuVariant.delete({
        where: { id },
      });

      if (menuVariant) {
        return { message: 'Menu variant deleted successfully' };
      }
    } catch (error) {
      console.error(error);
      throw new Error('Error deleting menu variant');
    }
  }
}
