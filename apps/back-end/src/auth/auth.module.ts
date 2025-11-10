import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        // Tenta acessar de várias formas para compatibilidade
        const secret = 
          process.env.JWT_SECRET || 
          configService.get<string>('JWT_SECRET') ||
          configService.get<string>('jwt.secret') ||
          'your-secret-key-change-in-production';
        
        const expiresIn = 
          process.env.JWT_EXPIRES_IN || 
          configService.get<string>('JWT_EXPIRES_IN') ||
          configService.get<string>('jwt.expiresIn') ||
          '1d';

        return {
          secret,
          signOptions: {
            expiresIn,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}

