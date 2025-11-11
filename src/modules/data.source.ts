import { DataSource } from 'typeorm';
import { Account } from './accounts/entities/account.entity';
import { Transactions } from './transactions/entities/transactions.entity';
import { User } from './users/entities/user.entity';
import { ConfigService } from '@nestjs/config';



export function createDataSource(configService: ConfigService): DataSource {
  return new DataSource({
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: Number(configService.get<string>('DB_PORT') ?? 5432),
    username: configService.get<string>('DB_USER'),
    password: configService.get<string>('DB_PASS'),
    database: configService.get<string>('DB_NAME'),
    entities: [User, Account, Transactions],
    synchronize: true,
  });
}

