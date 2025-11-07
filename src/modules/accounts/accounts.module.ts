import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Account]),
    UsersModule,
    ConfigModule,
  ],
  providers: [AccountsService],
  controllers: [AccountsController]
})
export class AccountModule {}

