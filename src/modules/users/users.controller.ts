import { Body, Controller, Get, ParseIntPipe,Param, Patch, Delete,Request, UnauthorizedException} from '@nestjs/common';
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
    @Roles(Role.ADMIN,Role.USER)
    @Delete(':id')
       deleteUser(
        @Param('id',ParseIntPipe) idUser:number,
        @Request() req
    ){
        const {id} = req.user
        if(req.user.role === Role.ADMIN){
            // return this.usersService.deleteUser(idUser) 
            return "User Succesfully deleted"
        };

        if(idUser != id) throw new UnauthorizedException("id not belonging to account")
            return "User Succesfully deleted"
        // return this.usersService.deleteUser(idUser) 
    }
 
    @UseGuards(JwtAuthGuard,RolesGuard)  
    @Roles(Role.ADMIN,Role.USER)
    @Patch(':id')

    updateUser(
        @Param('id',ParseIntPipe) idUser:number,
        @Request() req,
        @Body() data: UpdateUserDto,
    ):Promise<User>{
        const {id} = req.user

        if(req.user.role === Role.ADMIN){
          return this.usersService.updateUser(idUser,data)  
        }

        if(idUser != id) throw new UnauthorizedException("id not belonging to account");
        return this.usersService.updateUser(idUser,data);
    }
 
}

