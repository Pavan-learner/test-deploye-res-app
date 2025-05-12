import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { UpdateMenuDto } from './dto/updateMenu.dto';
import { CreateMenuDto } from './dto/createMenu.dto';

@Injectable()
export class MenuService {
  constructor(private readonly prismaService: PrismaService) {}

  // Method to create a menu i.e product
  async createMenu(menuData: CreateMenuDto) {
    try {
      return await this.prismaService.menu.create({
        data: {
          name: menuData.name,
          description: menuData.description,
          basePrice: menuData.price,
          restaurantId: menuData.restaurantId,
          categoryId: menuData.categoryId,
        },
      });
    } catch (error) {
      console.error(error);
      throw new Error('Error creating menu');
    }
  }

  // Method to update the menu i.e product
  async updateMenu(id: string, updateMenuData: UpdateMenuDto) {
    try {
      return await this.prismaService.menu.update({
        where: { id },
        data: {
          name: updateMenuData.name,
          description: updateMenuData.description,
          basePrice: updateMenuData.price,
          isAvailable: updateMenuData.isAvailable,
          hasVariants: updateMenuData.hasVairants,
          taxInclusive: updateMenuData.taxInclusive,
          restaurantId: updateMenuData.restaurantId,
          categoryId: updateMenuData.categoryId,
        },
      });
    } catch (error) {
      console.error(error);
      throw new Error('Error updating menu');
    }
  }

  // Method to get all the menu i.e product
  async getAllMenu(page: number, limit: number) {
    try {
      // here we are storing the value that is used to skip the records based on the page
      /* 
        page  = 1 limit = 10
      offset = 1-0 * 10 = (0)

        page = 2 limit = 10
      offset = 2-1 * 10 = 10 

        page = 3 limit = 10 
      offset = 3-1 * 10 = 20 

      */
      const offset = (page - 1) * limit;

      const menus = await this.prismaService.menu.findMany({
        skip: offset,
        take: limit,
        orderBy: {
          createdAt: 'asc',
        },
      });

      // Getting the total number of categories in the database
      const total = await this.prismaService.menu.count();

      const hasPreviousPage = offset > 0;
      const hasNextPage = offset + limit < Math.ceil(total / limit);

      return {
        menus,
        totalRecords: total,
        page,
        limit,
        hasPreviousPage,
        hasNextPage,
      };
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching menu');
    }
  }

  // Method to get single menu i.e product by id
  async getMenuById(id: string) {
    try {
      return await this.prismaService.menu.findUnique({
        where: { id },
        include: {
          category: true,
          menuVariants: true,
        },
      });
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching menu by id');
    }
  }

  // method to delete the menu i.e product by id
  async deleteMenu(id: string) {
    try {
      return await this.prismaService.menu.delete({
        where: { id },
      });
    } catch (error) {
      console.error(error);
      throw new Error('Error deleting menu');
    }
  }

  // Method to get all the menu i.e products of the restaurant (res id)
  async getAllMenuByRestaurantId(
    restaurantId: string,
    page: number,
    limit: number,
  ) {
    try {
      // first we are fetching the menu settings by restaurant id
      const menuSettings = await this.prismaService.menuSettings.findFirst({
        where: { restaurantId },
        include: {
          restaurant: true,
        },
      });

      const offset = (page - 1) * limit;

      // Getting the menu based on the restaurant
      const resMenus = await this.prismaService.menu.findMany({
        skip: offset,
        take: limit,
        orderBy: {
          createdAt: 'asc',
        },
        where: { restaurantId },
        include: {
          category: true,
          menuVariants: true,
          addonGroupsItems: true,
        },
      });

       // Getting the total number of categories in the database 
       const total = await this.prismaService.menu.count();

       const hasPreviousPage = offset > 0;
       const hasNextPage = offset + limit  < (Math.ceil(total / limit))

      // here we are checking if resstaurant has surcharge enabled then we are adding the surcharge to the menu price and variant price and addon group price
      if (menuSettings?.surchargeStatus === true) {
        return resMenus.map((value) => {
          const surchargeAmount =
            (value.basePrice * menuSettings.surcharge!) / 100;
          return {
            ...value,
            basePrice: value.basePrice + surchargeAmount,
            // here we are adding the surcharge to the base price of the menu variants and addon groups
            menuVariants: value.menuVariants.map((variant) => {
              const variantSurchargeAmount =
                (variant.price * menuSettings.surcharge!) / 100;
              return {
                ...variant,
                price: variant.price + variantSurchargeAmount,
              };
            }),

            // here we are adding the surcharge to the base price of the addon groups
            addonGroupsItems: value.addonGroupsItems.map((addon) => {
              const addonSurchargeAmount =
                (addon.price! * menuSettings.surcharge!) / 100;
              return {
                ...addon,
                price: addon.price! + addonSurchargeAmount,
              };
            }),
          };
        });
      }

      // if surcharge is not enabled then we are returning the menu as it is
      return {
        totalRecords: total,
        page,
        limit,
        hasPreviousPage,
        hasNextPage,
        resMenus
      };

    } catch (error) {
      console.error(error);
      throw new Error('Error fetching menu by restaurant id');
    }
  }

  // method to get the menu i.e product by restaurant id and menu id
  async getMenuByRestaurantId(id: string, restaurantId: string) {
    try {
      const menu = await this.prismaService.menu.findFirst({
        where: {
          id: id,
          restaurantId: restaurantId, // Uncomment this to filter by restaurant ID
        },
        include: {
          category: true,
          menuVariants: true,
          addonGroupsItems: true,
        },
      });

      if (!menu) {
        throw new NotFoundException(
          `Menu with ID ${id} not found for restaurant ${restaurantId}`,
        );
      }

      return menu; // Add this return statement
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching menu by restaurant id and menu id');
    }
  }

  // this method is usedd to get all the menu i.e products of the restaurant (res id) and category id
  async getAllMenuByRestaurantAndCategory(
    restaurantId: string,
    categoryId: string,
    page: number,
    limit: number,
  ) {
    try {
      const offset = (page - 1) * limit;
     // Getting the total number of categories in the database 
     const total = await this.prismaService.discount.count();

     const hasPreviousPage = offset > 0;
     const hasNextPage = offset + limit  < (Math.ceil(total / limit))

     const menus = await this.prismaService.menu.findMany({
        skip: offset,
        take: limit,
        orderBy: {
          createdAt: 'asc',
        },
        where: {
          restaurantId: restaurantId,
          categoryId: categoryId,
        },
        include: {
          category: true,
          menuVariants: true,
          addonGroupsItems: true,
        },
      });

      if (!menus) {
        throw new NotFoundException(
          `Menu with restaurant ID ${restaurantId} and category ID ${categoryId} not found`,
        );
      }

      return {
        totalRecords: total,
        page,
        limit,
        hasPreviousPage,
        hasNextPage,
        menus
      };

    } catch (error) {
      console.error(error);
      throw new Error('Error fetching menu by restaurant id and category id');
    }
  }

  // this method is used to get menu with variants and with addon groups 
  // ? not added yet to the controller
  async getMenusWithVariantsAndAddonGroups(restaurantId: string , page: number,
    limit: number,) {
    try {
      const offset = (page - 1) * limit;

      const total = await this.prismaService.menu.count();
      const hasPreviousPage = offset > 0;
      const hasNextPage = offset + limit < Math.ceil(total / limit);

      const menus = await this.prismaService.menu.findMany({
        skip: offset,
        take: limit,
        orderBy: {
          createdAt: 'asc',
        },
        where: {
          restaurantId: restaurantId,
        },
        include: {
          menuVariants: true,
          addonGroupsItems: true,
        },
      });

      return {
        menus,
        totalRecords: total,
        page,
        limit,
        hasPreviousPage,
        hasNextPage,
      };
    } catch (error) {
      console.error(error);
      throw new Error('Error fetching menu with variants and addon groups');
    }
  }
}
