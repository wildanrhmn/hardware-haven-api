import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';

import { userProviders } from 'src/models/user/user.provider';
import { adminProviders } from 'src/models/admin/admin.provider';

import { CommonUserJwtStrategy, AdminJwtStrategy, CombinedJwtStrategy } from './jwt.strategy';
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
    providers: [AuthService, CommonUserJwtStrategy, AdminJwtStrategy,CombinedJwtStrategy, ...userProviders, ...adminProviders ],
    exports: [AuthService, CommonUserJwtStrategy, AdminJwtStrategy, CombinedJwtStrategy],
})
export class AuthModule{}