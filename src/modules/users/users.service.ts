import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm'
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>){    
    }

    findUserByEmail(email:string){
        return this.userRepository.findOneBy({email})
    }

    findUserById(id:number){
        return this.userRepository.findOneBy({id})
    }

    createUser(data:Partial<User>){
        const user = this.userRepository.create(data)
        return this.userRepository.save(user)
    }

    async updateUser(id: number, data:UpdateUserDto):Promise<User>{
        const user = await this.userRepository.findOne({where:{id}})
        if (!user) throw new NotFoundException(`User with id:${id} not found`)
        
        Object.assign(id,data)
        return this.userRepository.save(user)
    }

    deleteUser(id:number){
        return this.userRepository.delete(id)
    }
}
