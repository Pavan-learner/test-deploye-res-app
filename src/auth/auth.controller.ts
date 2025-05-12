import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { updadteUserDto } from 'src/users/dto/updateUser.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    
    @Post('register')
    async register_admin(@Body() registerDto: RegisterDto) {
        return this.authService.register_admin(registerDto);
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Patch('reset-password')
    async resetPassword(@Body() resetPasswordDto : ResetPasswordDto){
        return this.authService.resetPassword(resetPasswordDto);
    }
}