import { Controller,Post,Body,Get, Query, NotFoundException} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { GetTransactionsDto } from './dto/create_transactions.DTO';
import { UseFilters } from '@nestjs/common';
import { ForeignKeyExceptionFilter } from '../../foreign-key-exception.filter';
import { RolesGuard } from '../auth/auth_guard/roles.guard';
import { Roles } from '../auth/auth_guard/roles.decorators';
import { JwtAuthGuard } from '../auth/auth_guard/auth.guard';
import { Role } from '../users/entities/user.entity';



@Controller('transactions')
export class TransactionsController {
    constructor(private transactionsService:TransactionsService){}


    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(Role.ADMIN) 
    @UseGuards(AuthGuard('jwt'))
    @Post("create")
    @UseFilters(new ForeignKeyExceptionFilter())
    transferFunds(
        @Body() transferFundsDto:{accountAId: number, accountBId: number, amount: number}
    ){
        if (! transferFundsDto.accountAId) throw new NotFoundException("Incorrect key declaration");
        if (! transferFundsDto.accountBId) throw new NotFoundException("Incorrect key declaration");

        return this.transactionsService.transferFunds(
             transferFundsDto.accountAId,
            transferFundsDto.accountBId,
            transferFundsDto.amount
        );
    }

    // @UseGuards(JwtAuthGuard,RolesGuard)
    // @Roles(Role.ADMIN) 
    @UseGuards(AuthGuard('jwt'))
    @Post("deposit")
    @UseFilters(new ForeignKeyExceptionFilter())
    depositTransaction(
        @Body() depositTransactionsDto:{accountId:number,deposit:number}
    ){
         if (! depositTransactionsDto.accountId) throw new NotFoundException("Incorrect key declaration")
        return this.transactionsService.depositTransaction(
             depositTransactionsDto.accountId,
            depositTransactionsDto.deposit,
        )
    }

    // @UseGuards(JwtAuthGuard,RolesGuard)
    // @Roles(Role.ADMIN) 
    @UseGuards(AuthGuard('jwt'))
    @Post("withdraw")
    @UseFilters(new ForeignKeyExceptionFilter())
    withdrawTransaction(
        @Body() withdrawTransactionsDto:{accountId:number,withdraw:number}
    ){
        if (! withdrawTransactionsDto.accountId) throw new NotFoundException("Incorrect key declaration");

        return this.transactionsService.withdrawTransaction(
             withdrawTransactionsDto.accountId,
            withdrawTransactionsDto.withdraw,
        )
    }
    
    // @UseGuards(JwtAuthGuard,RolesGuard)
    // @Roles(Role.ADMIN) 
    @UseGuards(AuthGuard('jwt'))
    @Get()
    async getTransactions(
    @Query() filters: GetTransactionsDto 
    ) {
        return await this.transactionsService.getTransactions(filters);
    }

}
