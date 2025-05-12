import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createMerchantDto } from './dto/createMerchant.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class OnboardingService {
  constructor(private readonly prismaService: PrismaService) {}

  async merchant(merchantDto: createMerchantDto) {
    // check if the user already exists in the database or not
    const existingUser = await this.prismaService.user.findUnique({
      where: {
        username: merchantDto?.username,
      },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    // in the first step we will create a new user in the database then we will get the id so we can create the admin
    // getting the encrypted password
    const hashedPassword = await this.hashPassword(merchantDto.password);

    const user = await this.prismaService.user.create({
      data: {
        email: merchantDto.email,
        username: merchantDto.username,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    // creating the restaurant  with with provided data from reigsterDTo
    const restaurant = await this.prismaService.restaurant.create({
      data: {
        name: merchantDto.restaurantName,
        userId: user.id, // Assuming you have a userId field in your restaurant model
        status: 'ACTIVE',
      },
    });

    // check if the restaurant is created or not
    if (!restaurant) {
      throw new InternalServerErrorException('Restaurant creation failed');
    }

    return {
        id: user.id,    
        email: user.email,
        username: user.username,
        role: user.role,
        restaurantId: restaurant.id, // Assuming you have a restaurantId field in your user model
    };
  }

  // Helper functions
  // helper functions to hash and compare passwords
  async hashPassword(password: string): Promise<string> {
    // hash the password using bcrypt or any other library

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword; // replace with actual hashing logic
  }

  async comparePassword(password: string, hashedPassword: string) {
    // compare the password using bcrypt or any other library
    const isMatch = await bcrypt.compare(password, hashedPassword);

    return isMatch; // replace with actual comparison logic
  }
}
