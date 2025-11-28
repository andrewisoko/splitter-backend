import { Controller,Post,Body,Get, Query,Request, NotFoundException, Logger} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
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
    constructor(private transactionsService:TransactionsService,
    ){}


    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(Role.ADMIN,Role.USER) 
    @Post("transfer")
    @UseFilters(new ForeignKeyExceptionFilter())

    transferFunds(
        @Body() transferFundsDto:{accountAId: number, accountBId: number, amount: number, username?:string},
        @Request() req
    ){
        const {username} = req.user;
        
        if (! transferFundsDto.accountAId) throw new NotFoundException("Incorrect key declaration");
        if (! transferFundsDto.accountBId) throw new NotFoundException("Incorrect key declaration");

        if(req.user.role === Role.ADMIN){

            if(!transferFundsDto.username) throw new NotFoundException("username not found");

            return this.transactionsService.transferFunds(
             transferFundsDto.accountAId,
            transferFundsDto.accountBId,
            transferFundsDto.amount,
            transferFundsDto.username
            );
        };
        return this.transactionsService.transferFunds(
             transferFundsDto.accountAId,
            transferFundsDto.accountBId,
            transferFundsDto.amount,
            username
        );
    };

    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(Role.ADMIN,Role.USER) 
    @Post("deposit")
    @UseFilters(new ForeignKeyExceptionFilter())

    depositTransaction(
        @Body() depositTransactionsDto:{accountId:number,deposit:number,username:string},
        @Request() req
    ){
        const {username} = req.user;

        if (! depositTransactionsDto.accountId) throw new NotFoundException("Incorrect key declaration");
        
        if(req.user.role === Role.ADMIN){

            if(!depositTransactionsDto.username) throw new NotFoundException("username not found");

            return this.transactionsService.depositTransaction(
            depositTransactionsDto.accountId,
            depositTransactionsDto.deposit,
            depositTransactionsDto.username
            );
        };

        return this.transactionsService.depositTransaction(
            depositTransactionsDto.accountId,
            depositTransactionsDto.deposit,
            username
        )
    }

    @UseGuards(JwtAuthGuard,RolesGuard)
    @Roles(Role.ADMIN,Role.USER) 
    @Post("withdraw")
    @UseFilters(new ForeignKeyExceptionFilter())
    withdrawTransaction(
        @Body() withdrawTransactionsDto:{accountId:number,withdraw:number,username:string},
        @Request() req

    ){ 
        const {username} = req.user
        if (! withdrawTransactionsDto.accountId) throw new NotFoundException("Incorrect key declaration");

        if(req.user.role === Role.ADMIN){
            if(!withdrawTransactionsDto.username) throw new NotFoundException("username not found")
                
            return this.transactionsService.withdrawTransaction(
                withdrawTransactionsDto.accountId,
                withdrawTransactionsDto.withdraw,
                withdrawTransactionsDto.username
                );
        }

        return this.transactionsService.withdrawTransaction(
            withdrawTransactionsDto.accountId,
            withdrawTransactionsDto.withdraw,
            username
        )
    }
    
    // @UseGuards(JwtAuthGuard,RolesGuard)
    // @Roles(Role.ADMIN,Role.USER) 
    @Get()
    async getTransactions(
    @Query() filters: GetTransactionsDto 
    ) {
        return await this.transactionsService.getTransactions(filters);
    }

    // @Get()
    // async conversionTest(
    //     @Query('conversionCurrency') conversionCurrency: string
    //     ) {
    //     const client = this.conv.oandaClient(this.configService);

    //     await this.conv.oandaGetCurrencies(client);
    //     const conversion = await this.conv.oandaConversions(client, conversionCurrency);

    //     return { conversion };
    //     }
    
}
