import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule,ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AccountsModule } from './modules/accounts/accounts.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/users/entities/user.entity';




@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true,
    envFilePath: __dirname + '/../.env',
  }), UsersModule, AccountsModule, TransactionsModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory:(configService:ConfigService) => {

          console.log('ENV LOADED:', {
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          user: configService.get('DB_USER'),
          pass: configService.get('DB_PASS'),
          name: configService.get('DB_NAME'),
        });

        return{
            type: 'postgres',
            host: configService.get<string>('DB_HOST'),
            port: parseInt(configService.get<string>('DB_PORT') ?? '5432', 10), 
            username: configService.get<string>('DB_USER'),
            password: configService.get<string>('DB_PASS'),
            database: configService.get<string>('DB_NAME'),
            entities: [User],
            synchronize: true
            
        }
      }
    })
 
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
