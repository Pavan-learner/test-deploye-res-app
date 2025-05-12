import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserDto } from './dto/createUser.dto';
import { updadteUserDto } from './dto/updateUser.dto';
import { User } from 'generated/prisma';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';

@Controller('restaurant/users')
export class UsersController {
  constructor(private readonly userSevice: UsersService) {}

  // Creation of the user
  @Post()
  // @ApiCreatedResponse({
  //   description: 'Created Succesfully',
  //   type: User,
  //   isArray: false,
  // })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async createUser(
    @Body() createUserDto: createUserDto,
  ): Promise<User | { message: string; statusCode: number }> {
    return await this.userSevice.createUser(createUserDto);
  }

  // Updating the user
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: updadteUserDto,
  ) {
    return this.userSevice.updateUser(id, updateUserDto);
  }

  // Deleting the user
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return await this.userSevice.deleteUser(id);
  }

 // based on the restaurant id, it will return the users of that restaurant  
 @ApiOperation({ summary: 'Get all users by restaurant ID' })
 @Get(':resid/restaurant')
 async getRestaurantUsers(@Param('resid') id: string) {
   return await this.userSevice.getUsersByRestaurantId(id);
 }

  // Getting the user by id
  @Get(':id')
  async getUser(@Param('id') id: string) {
    return await this.userSevice.getUserById(id);
  }
}
