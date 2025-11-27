import { Controller,Post,Body,Request, NotFoundException} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/auth_guard/roles.guard';
import { Roles } from '../auth/auth_guard/roles.decorators';
import { JwtAuthGuard } from '../auth/auth_guard/auth.guard';
import { Role } from '../users/entities/user.entity';
import { Logger } from '@nestjs/common';




@Controller('accounts')
export class AccountsController {
    constructor(private accountService:AccountsService,
    ){}

    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(Role.ADMIN,Role.USER) 
    @Post('create')

    createAccount(
        @Body() createAccountDto:{ currency:string; initialDeposit:number, username?:string; },
        @Request() req
    ){
        const {username} = req.user
        if(req.user.role === Role.ADMIN){

            if(!createAccountDto.username) throw new NotFoundException("username not found")
            return this.accountService.createAccount(
                createAccountDto.currency,
                createAccountDto.initialDeposit,
                createAccountDto.username,
            )

        };
        return this.accountService.createAccount(
        createAccountDto.currency,
        createAccountDto.initialDeposit,
        username
     )    
    }

    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(Role.ADMIN,Role.USER) 
    @Post('retrieve-account')

    async retrieveAccount(
        @Body() retrieveAccountDto:{accountId: number,password:string,email?:string},
        @Request() req
    ){

        const { email} = req.user;
        if(req.user.role === Role.ADMIN){
            
            if(!retrieveAccountDto.email) throw new NotFoundException("email not found");
            return this.accountService.retrieveAccount(
            retrieveAccountDto.password,
            retrieveAccountDto.accountId,
            retrieveAccountDto.email
            )};

        return this.accountService.retrieveAccount(
            retrieveAccountDto.password,
            retrieveAccountDto.accountId,
            email
        );
    };

    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(Role.ADMIN,Role.USER) 
    @Post('find-all-accounts')
    async findAllAccounts(
        @Body() findAllAccountsDto:{password:string,email?:string},
        @Request() req
    ){
        if (req.user.role === Role.ADMIN){

        if(!findAllAccountsDto.email) throw new NotFoundException("email not found");

        return this.accountService.findAllAccounts(
            findAllAccountsDto.password,
            findAllAccountsDto.email
        )
        };
        const {email} = req.user
        return this.accountService.findAllAccounts(
            findAllAccountsDto.password,
            email
        )
    }

    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(Role.ADMIN,Role.USER) 
    @Post('delete')

    async deleteAccount(
        @Body() deleteAccountDto:{accountId:number,username?:string},
        @Request() req
    ){
        const {username} = req.user;

        if (req.user.role === Role.ADMIN){
            if(!deleteAccountDto.username) throw new NotFoundException("username not found");
            return this.accountService.deleteAccount(
                deleteAccountDto.accountId,
                deleteAccountDto.username
            );
        
        }
        return this.accountService.deleteAccount(
            deleteAccountDto.accountId,
            username
        )

    }

}
