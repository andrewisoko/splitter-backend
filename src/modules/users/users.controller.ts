import { Body, Controller, Get, ParseIntPipe,Param, Patch, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { User,Role } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from '../auth/auth_guard/roles.guard';
import { Roles } from '../auth/auth_guard/roles.decorators';
import { JwtAuthGuard } from '../auth/auth_guard/auth.guard';
import { UseGuards } from '@nestjs/common';


@Controller('users')
export class UsersController {
    constructor( private usersService:UsersService){}

    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(Role.ADMIN)
    @Get(':id')
    findUser(@Param('id',ParseIntPipe) id:number):Promise<User|null>{
        return this.usersService.findUserById(id)
    }

    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(Role.ADMIN)
    @Delete(':id')
       deleteUser(@Param('id',ParseIntPipe) id:number){
        return this.usersService.deleteUser(id) 
    }
 
    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(Role.USER)
    @Patch(':id')
    updateUser(
        @Param('id',ParseIntPipe) id:number,
        @Body() data: UpdateUserDto,
    ):Promise<User>{
        return this.usersService.updateUser(id,data)
    }

}

