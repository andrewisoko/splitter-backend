import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm'

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>){    
    }

    findUserByEmail(email:string){
        this.userRepository.findOneBy({email})
    }

    createUser(){
        this.userRepository.create()
    }

    deleteUser(user:User){
        this.userRepository.delete(user)
    }
}
