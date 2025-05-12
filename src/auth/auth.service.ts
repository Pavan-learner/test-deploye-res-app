import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import JWT_SECRET_KEY from 'src/util/constant';
import { ResetPasswordDto } from './dto/resetPassword.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // This function is used to register a new admin user in the system.
  async register_admin(registerDto: RegisterDto) {
    // check if the user already exists in the database or not
    const existingUser = await this.prismaService.user.findUnique({
      where: {
        username: registerDto?.username,
      },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    // in the first step we will create a new user in the database then we will get the id so we can create the admin
    // getting the encrypted password
    const hashedPassword = await this.hashPassword(registerDto.password);

    const user = await this.prismaService.user.create({
      data: {
        email: registerDto.email,
        username: registerDto.username,
        password: hashedPassword,
        role: 'ADMIN', // use the restaurant ID here
      },
    });

    // creating the restaurant  with with provided data from reigsterDTo
    const restaurant = await this.prismaService.restaurant.create({
      data: {
        name: registerDto.restaurantName,
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

  async login(loginDto: LoginDto) {
    console.log('loginDto', loginDto);

    console.log('the jwt secret key', JWT_SECRET_KEY);
    // check if the user already exists in the database or not
    // based on the provided inputs like email or username because
    // here we are implmenting two type of login one is with username and another one is with email id
    const existingUser = await this.prismaService.user.findFirst({
      where: {
        OR: [
          { email: loginDto?.email || undefined },
          { username: loginDto?.username || undefined },
        ],
      },
    });

    if (!existingUser) {
      throw new NotFoundException('User not exist');
    }

    // check if the password is correct or not
    const isMatch = await this.comparePassword(
      loginDto.password,
      existingUser.password!,
    );

    if (!isMatch) {
      throw new ConflictException('Invalid credentials');
    }

    // if the user is found and the password is correct, generate a JWT token
    const access_token = await this.signintoken({
      id: existingUser.id,
      email: existingUser.email!,
      role: existingUser.role!,
      restaurantId: existingUser.restaurantId!,
      username: existingUser.username!,
    });

    // Refresh token generation
    const refresh_token = await this.jwtService.signAsync(
      {
        id: existingUser.id,
        email: existingUser.email!,
        role: existingUser.role!,
        restaurantId: existingUser.restaurantId!,
        username: existingUser.username!,
      },
      {
        secret: JWT_SECRET_KEY,
        expiresIn: '30d', // Set the expiration time for the refresh token
      },
    );

    // update the refresh token and the access token in the user table
    const updateUser = await this.prismaService.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        refreshToken: refresh_token,
        accessToken: access_token,
      },
    });

    // check if the user is updated or not
    if (!updateUser) {
      throw new InternalServerErrorException('User update failed');
    }

    // return the user data and the access token
    return {
      access_token: access_token,
      refresh_token: refresh_token,
      user: {
        id: updateUser.id,
        email: updateUser.email,
        username: updateUser.username,
        role: updateUser.role,
        restaurantId: updateUser.restaurantId,
      },
    };
  }

  // this is for changing the password
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    // check if the user already exists in the database or not
    const existingUser = await this.prismaService.user.findFirst({
      where: {
        OR: [
          { email: resetPasswordDto?.email },
          { username: resetPasswordDto?.username },
        ],
      },
    });
    if (!existingUser) {
      throw new NotFoundException('User not exist');
    }

    // hash the new password
    const hashedPassword = await this.hashPassword(resetPasswordDto.password);

    const changePassword = await this.prismaService.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        ...existingUser,
        password: hashedPassword,
      },
    });

    if (!changePassword) {
      throw new InternalServerErrorException('Password change failed');
    }

    return {
      changePassword,
    };
  }

  // ? helper functions to hash and compare passwords
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

  // this is for returning of the access token
  async signintoken(args: {
    id: string;
    email: string;
    role: string;
    restaurantId: string;
    username: string;
  }) {
    const payload = args;
    return this.jwtService.signAsync(payload, {
      secret: JWT_SECRET_KEY,
      expiresIn: '15d',
    });
  }
}
