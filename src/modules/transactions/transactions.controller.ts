import { Controller,Post,Body} from '@nestjs/common';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
    constructor(private transactionsService:TransactionsService){}

    @Post("create")
    transferFunds(
        @Body() createTransferFundsDto:{accountAId: number, accountBId: number, amount: number}
    ){
        return this.transactionsService.transferFunds(
             createTransferFundsDto.accountAId,
            createTransferFundsDto.accountBId,
            createTransferFundsDto.amount
        )
    }
  

}
