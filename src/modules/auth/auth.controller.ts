import { Body, Controller, Post } from '@nestjs/common';
import { AuthDTO } from './auth.dto';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';


@Controller('auth')
export class AuthController {
 constructor( private userService:UsersService, 
    private authService:AuthService
){}

    @Post('register')
    async createUser(
    @Body() authDto:AuthDTO
    ){
        const hashedpassword = await bcrypt.hash(authDto.password,10)
        return this.userService.createUser({
            fullName:authDto.fullName,
            userName:authDto.userName,
            email:authDto.email,
            number:authDto.number,
            password:hashedpassword
        })
    }

    @Post('login')
    async login(
    @Body() authDto:AuthDTO
    ){
        const user = await this.authService.validateUser(authDto.email,authDto.password)
        return this.authService.login(user)
    }
}
