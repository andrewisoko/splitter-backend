import { DataSource } from 'typeorm';
import { Account } from './accounts/entities/account.entity';
import { Transactions } from './transactions/entities/transactions.entity';
import { User } from './users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';


@Injectable()
export class DataSourceConnection {
  constructor(private readonly configService: ConfigService ){}

  async createDataSource(){

    const dataDource = new DataSource({
      type: 'postgres',
      host: this.configService.get<string>('DB_HOST'),
      port: Number(this.configService.get<string>('DB_PORT') ?? 5432),
      username: this.configService.get<string>('DB_USER'),
      password: this.configService.get<string>('DB_PASS'),
      database: this.configService.get<string>('DB_NAME'),
      entities: [User, Account, Transactions],
      synchronize: true,
    });

    const AppDataSource = this.createDataSource();
    await AppDataSource.initialize().
        then(()=>
        console.log('Data Source has been initialised!')
        )
        .catch((err)=>
        console.error('Error during Data Source initialisation', err)
        )
      
      return AppDataSource.createQueryRunner();
    
      }
  }


