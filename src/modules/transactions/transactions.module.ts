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
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { TransactionsOutcome } from './transactions.outcome';
import { DataSourceConnection } from '../data.source';


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
    DataSourceConnection,
    TransactionsOutcome
  ],
  controllers: [TransactionsController]
})
export class TransactionsModule {}
