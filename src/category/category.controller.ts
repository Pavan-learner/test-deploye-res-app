import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { UpdateCategoryDto } from './dto/updateCategory.dto';
import { CategoryService } from './category.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('restaurant/category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}
    
    @Post()
    createCategory(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.createCategory(createCategoryDto);
    }

    @Patch(':id')
    updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoryService.updateCategory(id, updateCategoryDto);
    }

    @ApiOperation({ summary: "Delete category by id" })
    @Delete(':id')
    deleteCategory(@Param('id') id: string) {
        return this.categoryService.deleteCategory(id);
    }

    @ApiOperation({ summary: "Get all categories" })
    @Get(':page/:limit')
    async getAllCategories(@Param('page' , ParseIntPipe) page: number, @Param('limit' , ParseIntPipe) limit: number) {
        return this.categoryService.getAllCategories(page , limit)
    }

    @ApiOperation({ summary: "Get all categories of the restaurant" })
    @Get(':resId/restaurant/:page/:limit')
    getAllCategoriesByRestaurant(@Param('resId') resId: string , @Param('page' , ParseIntPipe) page: number, @Param('limit' , ParseIntPipe) limit: number) {
        return this.categoryService.getAllCategoriesByRestaurant(resId , page , limit);
    }

    
    @ApiOperation({ summary: "Get single category of the restaurant by the category id" })
    @Get(':id/category/:resid/restaurant')
    getCategoriesByRestaurant(@Param('id') id: string , @Param('resid') resid: string) {
        return this.categoryService.getCategoryByRestaurant(id , resid);
    }

    @ApiOperation({summary: "Get single category by id [CRUD route]"})
    @Get(':id')
    getCategory(@Param('id') id: string) {
        return this.categoryService.getCategory(id);
    }   

   
}
