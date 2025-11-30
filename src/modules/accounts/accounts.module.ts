import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { User } from '../users/entities/user.entity';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { Transactions } from '../transactions/entities/transactions.entity';
import { ConversionCurrencies } from './currency-conversion';

@Module({
  imports:[
    TypeOrmModule.forFeature([Account,User,Transactions]),
    UsersModule,
    ConfigModule,
  ],
  providers: [
    AccountsService,
    AuthService,
    JwtService,
    ConversionCurrencies
  ],
  controllers: [AccountsController]
})
export class AccountsModule {}

