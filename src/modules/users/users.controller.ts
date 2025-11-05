import { Body, Controller, Get, ParseIntPipe,Param, Patch, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
    constructor( private usersService:UsersService){}

    @Get(':id')
    findUser(@Param('id',ParseIntPipe) id:number):Promise<User|null>{
        return this.usersService.findUserById(id)
    }

    @Delete(':id')
       deleteUser(@Param('id',ParseIntPipe) id:number){
        return this.usersService.deleteUser(id) 
    }
 

    @Patch(':id')
    updateUser(
        @Param('id',ParseIntPipe) id:number,
        @Body() data: UpdateUserDto,
    ):Promise<User>{
        return this.usersService.updateUser(id,data)
    }

}

