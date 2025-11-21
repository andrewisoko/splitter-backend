import { Controller,Post,Body,Get, Query, NotFoundException} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { TRANSACTIONS_TYPE } from './entities/transactions.entity';
import { GetTransactionsDto } from './dto/create_transactions.DTO';
import { NotFoundError } from 'rxjs';


@Controller('transactions')
export class TransactionsController {
    constructor(private transactionsService:TransactionsService){}


    
    // @UseGuards(AuthGuard('jwt'))
    @Post("create")
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

    // @UseGuards(AuthGuard('jwt'))
    @Post("deposit")
    depositTransaction(
        @Body() depositTransactionsDto:{accountId:number,deposit:number}
    ){
         if (! depositTransactionsDto.accountId) throw new NotFoundException("Incorrect key declaration")
        return this.transactionsService.depositTransaction(
             depositTransactionsDto.accountId,
            depositTransactionsDto.deposit,
        )
    }

    // @UseGuards(AuthGuard('jwt'))
    @Post("withdraw")
    withdrawTransaction(
        @Body() withdrawTransactionsDto:{accountId:number,withdraw:number}
    ){
        if (! withdrawTransactionsDto.accountId) throw new NotFoundException("Incorrect key declaration");

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
