import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';



@Module({
  imports: [PassportModule,
    JwtModule.registerAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory: (configService:ConfigService) => ({
        global: true,
        secret: configService.get<string>("JWT_KEY"),
        signOptions: {expiresIn:'60s'}
      })
    })
  ],
  providers: [AuthService],
  controllers: [AuthController,JwtStrategy]
})
export class AuthModule {}
