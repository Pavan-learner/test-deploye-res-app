import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { updadteUserDto } from './dto/updateUser.dto';
import { createUserDto } from './dto/createUser.dto';
import { PrismaService } from 'src/prisma/prisma.service';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  // Getting single user by id
  async getUserById(id: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching user by ID or user may not exist');
    }
  }

  // based on the restaurant id, it will return the users of that restaurant
  async getUsersByRestaurantId(id: string) {
    try {
      const users = await this.prismaService.user.findMany({
        where: {
          restaurantId: id,
        },
      });

      if (!users) {
       throw new NotFoundException('No users found for this restaurant');
      }

      return users;
    } catch (error) {
      throw new Error('Error fetching users by restaurant ID');
    }
  }


  // Creation of the user
  async createUser(createUserDto: createUserDto) {
    // Logic to create a user

    try {
      // Check if the user already exists in the database or not

      const existingUser = await this.prismaService.user.findUnique({
        where: {
          email: createUserDto.email,
        },
      });

      if (existingUser) {
       throw new ConflictException('User already exists');
      }

      if (createUserDto.role !== 'ADMIN' && createUserDto.role !== 'EMPLOYEE') {
        return {
          message: 'Invalid role',
          statusCode: 400,
        };
      }

      // encrypting the user password 
      const hashedPassword = await this.hashPassword(createUserDto.password);

      // Create a new user
      const user = await this.prismaService.user.create({
        data: {
          email: createUserDto.email,
          name: createUserDto.name,
          username: createUserDto.username,
          password: hashedPassword,
          role: createUserDto.role,
          restaurantId: createUserDto.restaurantId,
        },
      });
      return user;
    } catch (error) {
      throw new Error('Error creating user');
    }
  }


  // Updating the user
  async updateUser(id: string, updateUserDto: updadteUserDto) {
    // Logic to update a user

    try {
      // If updateUserDto is an instance of a class
      if (updateUserDto.role !== 'EMPLOYEE') {
        return {
          message: 'Invalid role',
          statusCode: 400,
        };
      }

      // if the user wants to update his password 
      const hanshedPassword = await this.hashPassword(updateUserDto.password);

      const updateUser = await this.prismaService.user.update({
        where: { id },
        data: {
          email: updateUserDto.email,
          name: updateUserDto.name,
          username: updateUserDto.username,
          password: hanshedPassword,
          restaurantId: updateUserDto.restaurantId,
        },
      });

      if (!updateUser) {
        throw new NotFoundException('User not found');
      }

      return updateUser;
    } catch (error) {
      throw new Error('Error updating user');
    }
  }

  // Deleting the user
  async deleteUser(id: string) {
    try {
      // First check if user exists in the database or not
      const foundUser = await this.prismaService.user.findUnique({
        where: {
          id,
        },
      });

      if (!foundUser) {
       throw new NotFoundException('User not found');
      }

      // If user exists, delete the user
      const deletedUser = await this.prismaService.user.delete({
        where: {
          id,
        },
      });

      return {
        success : true,
      };
    } catch (error) {
      throw new Error('Error deleting user');
    }
  }

  // Getting all users
  async getAllUsers() {
    try {
      const users = await this.prismaService.user.findMany();
      if (!users) {
       throw new NotFoundException('No users found');
      }
      return users;
    } catch (error) {
      throw new Error('Error fetching all users');
    }
  }


  //  // ? helper functions to hash and compare passwords
    async hashPassword(password: string): Promise<string> {
      // hash the password using bcrypt or any other library
  
      const salt = await bcrypt.genSalt(10);
  
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword; // replace with actual hashing logic
    }
}
