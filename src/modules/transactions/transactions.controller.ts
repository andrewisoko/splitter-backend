import { Controller,Post,Body} from '@nestjs/common';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
    constructor(private transactionsService:TransactionsService){}

    @Post("create")
    async createTransation(
        @Body() createTransactionDto: {amount:number,accountA:number,accountB:number}
    ){
        return await this.transactionsService.createTransaction(
            createTransactionDto.amount,
            createTransactionDto.accountA,
            createTransactionDto.accountB
        )
    }

}
