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
    @Body('fullname') fullName:string,
    @Body('email') email:string,
    @Body('password') password: string,
    @Body('number') number:number,
    ){
        const hashedpassword = await bcrypt.hash(password,10)
        return this.userService.createUser({fullName,email,number,password:hashedpassword})
    }

    @Post('login')
    async login(
    @Body('email') email:string,
    @Body('password') password:string,
    ){
        const user = await this.authService.validateUser(email,password)
        return this.authService.login(user)
    }
}
