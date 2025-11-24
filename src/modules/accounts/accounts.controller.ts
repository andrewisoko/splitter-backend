import { Controller,Post,Body,Request, NotFoundException} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/auth_guard/roles.guard';
import { Roles } from '../auth/auth_guard/roles.decorators';
import { JwtAuthGuard } from '../auth/auth_guard/auth.guard';
import { Role, User } from '../users/entities/user.entity';
import { NotFoundError } from 'rxjs';



@Controller('accounts')
export class AccountsController {
    constructor(private accountService:AccountsService,
    ){}

    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(Role.ADMIN,Role.USER) 
    @Post('create')
    createAccount(
        @Body() createAccountDto:{ username:string; currency:string; initialDeposit:number } 
    ){
        return this.accountService.createAccount(createAccountDto.username,
            createAccountDto.currency,
            createAccountDto.initialDeposit
        )
    }

    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(Role.ADMIN,Role.USER) 
    @Post('retrieve-account')
    async retrieveAccount(
        @Body() retrieveAccountDto:{accountId: number,password:string},
        @Request() req
    ){
        const { email} = req.user;
        return this.accountService.retrieveAccount(
            email,
            retrieveAccountDto.password,
            retrieveAccountDto.accountId
        )
    }

    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(Role.ADMIN,Role.USER) 
    @Post('find-all-accounts')
    async findAllAccounts(
        @Body() findAllAccountsDto:{password:string,email?:string},
        @Request() req
    ){
        if (req.user.role === Role.ADMIN){
        if(!findAllAccountsDto.email) throw new NotFoundException("email not found")
        return this.accountService.findAllAccounts(
            findAllAccountsDto.email,
            findAllAccountsDto.password
        )
        }
        const {email} = req.user
        return this.accountService.findAllAccounts(
            email,
            findAllAccountsDto.password
        )
    }

}
