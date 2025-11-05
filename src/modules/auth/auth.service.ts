import { Injectable,Logger,UnauthorizedException } from '@nestjs/common';
import { InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm'
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';



@Injectable()
export class AuthService {
    constructor( private readonly userService:UsersService,
        private readonly jwtService:JwtService
    ){}
    
    async validateUser(email:string,password:string){
        const user = await this.userService.findUserByEmail(email)
        if (!user) throw new UnauthorizedException('Invalid credentials')

        const isValidPassword = await bcrypt.compare(password,user.password)
        if (!isValidPassword) throw new UnauthorizedException('Incorrect password')
        
        return user

    }

    async login(user:User){
        const payload = { 
            sub : user.id,
            name: user.fullName,
            email: user.email,
        }

        return {access_token: this.jwtService.sign(payload)}
    }
}

