import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

import { userProviders } from 'src/models/user/user.provider';
@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) =>{
                return{
                    secret: configService.get<string>('secretJwt'),
                    signOptions: {expiresIn: configService.get<number>('expirationJwt')},
                };
            },
        }),
    ],
    providers: [AuthService, JwtStrategy, ...userProviders ],
    exports: [AuthService],
})
export class AuthModule{}