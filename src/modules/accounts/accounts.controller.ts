import { Controller,Post,Body } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../users/entities/user.entity';
import { loginDto as LoginDto } from '../auth/login.dto';

@Controller('accounts')
export class AccountsController {
    constructor(private accountService:AccountsService,
                private authService:AuthService,
    ){}

    @Post('create')
    createAccount(
        @Body() createAccountDto:{ username: string; currency: string; balance: number }
    ){
        return this.accountService.createAccount(createAccountDto.username,createAccountDto.currency,createAccountDto.balance)
    }

    @Post('retrieve-account')
    retrieveAccount(
        @Body() loginDto:LoginDto,accountDto:{accountID:number}
    ){
        return this.accountService.retrieveAccount(loginDto.email,loginDto.password,accountDto.accountID)
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
