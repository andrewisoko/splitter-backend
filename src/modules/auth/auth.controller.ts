import { Body, Controller, Post } from '@nestjs/common';
import { registerDto as RegisterDto } from './register.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { loginDto, loginDto as LoginDto } from './login.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '../users/entities/user.entity';


@Controller('auth')
export class AuthController {
 constructor( private userService:UsersService, 
    private authService:AuthService
){}

    @Post('register')
    async createUser(
    @Body() registerDto:RegisterDto
    ){
        const hashedpassword = await bcrypt.hash(registerDto.password,10)

        return this.userService.createUser({
            role:Role.USER,
            fullName:registerDto.fullName,
            userName:registerDto.userName,
            email:registerDto.email,
            number:registerDto.number,
            password:hashedpassword
        })
    }

    @Post('login')
    async login(
    @Body() loginDto:LoginDto
    ){
        const user = await this.authService.validateUser(loginDto.email,loginDto.password)
        return this.authService.login(user)
    }

    @Post('password-reset')
    async resetPassword(
          @Body() loginDto:LoginDto
    ){
        const hashedpassword = await bcrypt.hash(loginDto.password,10)
        return this.authService.resetPassword(loginDto.email,hashedpassword)
    }
  
}
