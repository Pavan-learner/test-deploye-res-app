import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateCategoryDto } from './dto/updateCategory.dto';
import { CreateCategoryDto } from './dto/createCategory.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  // for creating new category
  async createCategory(createCategoryDto: CreateCategoryDto) {
    try {
      const category =  await this.prismaService.category.create({
        data: {
          name: createCategoryDto.name,
          restaurantId: createCategoryDto.restaurantId,
          description: createCategoryDto.description,
          image: createCategoryDto.image,
          isActive: createCategoryDto.isActive!,
          sortOrder : createCategoryDto.sortOrder,
        },
      });

      return category;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error creating category');
    }
  }

  // for updating the category
  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
    const category =  await this.prismaService.category.update({
        where: { id },
        data: {
          name: updateCategoryDto.name,
          restaurantId: updateCategoryDto.restaurantId,
          description: updateCategoryDto.description,
          image: updateCategoryDto.image,
          isActive: updateCategoryDto.isActive!,
          sortOrder : updateCategoryDto.sortOrder,
        },
      });

      return category;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error updating category');
    }
  }

  // for getting the single category by the id
  async getCategory(id: string) {
    try {
      const category = await this.prismaService.category.findUnique({
        where: { id },
      });

      return category;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new NotFoundException('Category not found');
      }
      throw new InternalServerErrorException('Error fetching category');
    }
  }

  // for getting all the categories based on the offset method
  async getAllCategories(page: number, limit: number) {
    try {

      console.log("the page and limit are : ",page , limit)
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

      const categories = await this.prismaService.category.findMany({
        skip: offset,
        take: limit,
        orderBy: {
          createdAt: 'asc',
        },
      });

      // Getting the total number of categories in the database
      const total = await this.prismaService.category.count();

      const hasPreviousPage = offset > 0;
      const hasNextPage = offset + limit < Math.ceil(total / limit);

      return {
        categories,
        totalRecords: total,
        page,
        limit,
        hasPreviousPage,
        hasNextPage,
      };

      // return await this.prismaService.category.findMany();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error fetching categories');
    }
  }

  // for deleting the category by id

  async deleteCategory(id: string) {
    try {
      // in single query we are deleting the category by the id that is passed
      return await this.prismaService.category.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      // if the category is not found or already deleted then prisma will throw an error so here
      // we are checking the error is instance of Prisma or i.e is the error related to the prima if it is
      // then the category was found and it was already deleted
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new NotFoundException('Category not found or already deleted');
      }
      throw new InternalServerErrorException('Error deleting category');
    }
  }

  // These two methods for getting the categories based on the restaurant id or the data which belongs to the restaurant
  async getCategoryByRestaurant(id: string, restaurantId: string) {
    try {
      return await this.prismaService.category.findMany({
        where: {
          id: id,
          restaurantId: restaurantId,
        },
      });
    } catch (error) {
      console.log(error)
      throw new InternalServerErrorException(
        'Error fetching categories for restaurant',
      );
    }
  }

  async getAllCategoriesByRestaurant(
    restaurantId: string,
    page: number,
    limit: number,
  ) {
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

      const categories = await this.prismaService.category.findMany({
        skip: offset,
        take: limit,
        where: {
          restaurantId: restaurantId,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      // Getting the total number of categories in the database
      const total = await this.prismaService.category.count();

      const hasPreviousPage = offset > 0;
      const hasNextPage = offset + limit < Math.ceil(total / limit);

      return {
        categories,
        totalRecords: total,
        page,
        limit,
        hasPreviousPage,
        hasNextPage,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching categories for restaurant',
      );
    }
  }
}
