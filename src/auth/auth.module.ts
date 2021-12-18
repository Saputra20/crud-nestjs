import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { JwtStategy } from './jwt.stategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    UserModule,
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('jwt'),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStategy],
  controllers: [AuthController],
})
export class AuthModule {}
