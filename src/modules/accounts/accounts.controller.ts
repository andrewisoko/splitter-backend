import { Controller,Post,Body } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { loginDto as LoginDto } from '../auth/login.dto';
import { AuthService } from '../auth/auth.service';

@Controller('accounts')
export class AccountsController {
    constructor(private accountService:AccountsService,
    ){}

    @Post('create')
    createAccount(
        @Body() createAccountDto:{ username: string; currency: string; balance: number }
    ){
        return this.accountService.createAccount(createAccountDto.username,
            createAccountDto.currency,
            createAccountDto.balance
        )
    }

    @Post('retrieve-account')
    async retrieveAccount(
        @Body() retrieveAccountDto:{email:string; password: string; accountId: number}
    ){
        return this.accountService.retrieveAccount(retrieveAccountDto.email,
            retrieveAccountDto.password,
            retrieveAccountDto.accountId
        )
    }

    @Post('deposit')
    deposit(
        @Body() deposit:number,accountDto:{accountID:number}
    ){
        return this.accountService.deposit(deposit,accountDto.accountID)
    }

    @Post('withdraw')
    withdraw(
        @Body() withdraw:number,accountDto:{accountID:number}
    ){
        return this.accountService.deposit(withdraw,accountDto.accountID)
    }

}
