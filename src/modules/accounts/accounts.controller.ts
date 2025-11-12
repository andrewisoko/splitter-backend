import { Controller,Post,Body } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';


@Controller('accounts')
export class AccountsController {
    constructor(private accountService:AccountsService,
    ){}

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


    @UseGuards(AuthGuard('jwt'))
    @Post('find-all-accounts')
    async findAllAccounts(
        @Body() findAllAccountsDto:{email:string; password: string}
    ){
        return this.accountService.findAllAccounts(findAllAccountsDto.email,
            findAllAccountsDto.password
        )
    }


    @UseGuards(AuthGuard('jwt'))
    @Post('deposit')
    deposit(
          @Body() depositAccountDto:{deposit:number,accountId: number}
    ){
        return this.accountService.deposit(depositAccountDto.accountId,depositAccountDto.deposit)
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('withdraw')
    withdraw(
       @Body() withdrawAccountDto:{withdraw:number,accountId: number}
    ){
        return this.accountService.withdraw(withdrawAccountDto.accountId,withdrawAccountDto.withdraw)
    }

}
