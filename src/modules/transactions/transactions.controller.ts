import { Controller,Post,Body,Get, Query} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { TRANSACTIONS_TYPE } from './entities/transactions.entity';
import { GetTransactionsDto } from './dto/create_transactions.DTO';


@Controller('transactions')
export class TransactionsController {
    constructor(private transactionsService:TransactionsService){}


    
    @UseGuards(AuthGuard('jwt'))
    @Post("create")
    transferFunds(
        @Body() TransferFundsDto:{accountAId: number, accountBId: number, amount: number}
    ){
        return this.transactionsService.transferFunds(
             TransferFundsDto.accountAId,
            TransferFundsDto.accountBId,
            TransferFundsDto.amount
        )
    }

    @UseGuards(AuthGuard('jwt'))
    @Post("deposit")
    depositTransaction(
        @Body() DepositTransactionsDto:{accountId:number,deposit:number}
    ){
        return this.transactionsService.depositTransaction(
             DepositTransactionsDto.accountId,
            DepositTransactionsDto.deposit,
        )
    }

    @UseGuards(AuthGuard('jwt'))
    @Post("withdraw")
    withdrawTransaction(
        @Body() withdrawTransactionsDto:{accountId:number,withdraw:number}
    ){
        return this.transactionsService.withdrawTransaction(
             withdrawTransactionsDto.accountId,
            withdrawTransactionsDto.withdraw,
        )
    }
  
     // @UseGuards(AuthGuard('jwt'))
    @Get()
    async getTransactions(
    @Query() filters: GetTransactionsDto 
    ) {
            return await this.transactionsService.getTransactions(filters);
    }

}
