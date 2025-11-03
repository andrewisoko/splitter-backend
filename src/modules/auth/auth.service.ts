import { Injectable,Logger,UnauthorizedException } from '@nestjs/common';
import { InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm'
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';



@Injectable()
export class AuthService {
    constructor( private readonly userService:UsersService){}
    
    async validateUser(name:string,email:string,password:string){
        const user = this.userService.findUserByEmail(email)
        return user
    }

    async login(user:User){
        const payload = {
            sub : user.id,
            name: user.fullName,
            email: user.email,
        }

        return "access token and jwt"
    }
}

