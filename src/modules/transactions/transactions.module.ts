import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transactions } from './entities/transactions.entity';
import { AccountsModule } from '../accounts/accounts.module';
import { Account } from '../accounts/entities/account.entity';
import { AccountsService } from '../accounts/accounts.service';
import { User } from '../users/entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { TransactionsOps } from './transactionsOps';
import { ConversionCurrencies } from '../accounts/currency-conversion';



@Module({
  imports:[
    ConfigModule,
    AccountsModule,
    TypeOrmModule.forFeature([Transactions,Account,User])
  ],
  providers: [
    TransactionsService,
    ConfigService,
    AccountsService,
    AuthService,
    UsersService,
    JwtService,
    TransactionsOps,
    ConversionCurrencies
  ],
  controllers: [TransactionsController]
})
export class TransactionsModule {}
