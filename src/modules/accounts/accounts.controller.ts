import { Controller,Post,Body } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/auth_guard/roles.guard';
import { Roles } from '../auth/auth_guard/roles.decorators';
import { JwtAuthGuard } from '../auth/auth_guard/auth.guard';
import { Role } from '../users/entities/user.entity';


@Controller('accounts')
export class AccountsController {
    constructor(private accountService:AccountsService,
    ){}

    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(Role.ADMIN) 
    @UseGuards(AuthGuard('jwt'))
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
    @Roles(Role.ADMIN) 
    @UseGuards(AuthGuard('jwt'))
    @Post('retrieve-account')
    async retrieveAccount(
        @Body() retrieveAccountDto:{email:string; password: string; accountId: number}
    ){
        return this.accountService.retrieveAccount(retrieveAccountDto.email,
            retrieveAccountDto.password,
            retrieveAccountDto.accountId
        )
    }

    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(Role.ADMIN) 
    @UseGuards(AuthGuard('jwt'))
    @Post('find-all-accounts')
    async findAllAccounts(
        @Body() findAllAccountsDto:{email:string; password: string}
    ){
        return this.accountService.findAllAccounts(findAllAccountsDto.email,
            findAllAccountsDto.password
        )
    }

}
