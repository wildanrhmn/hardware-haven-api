import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";

import { ConfigModule, ConfigService } from "@nestjs/config";

import { adminProviders } from "src/models/admin/admin.provider";
import { AdminService } from "./admin.service";

import { CommonUserJwtStrategy, AdminJwtStrategy } from "../auth/jwt.strategy";


@Module({
    imports: [
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                return{
                    secret: configService.get<string>('secretJwt'),
                    signOptions: {expiresIn: configService.get<number>('expirationJwt')},
                }
            }
        }),
    ],
    providers: [AdminService, CommonUserJwtStrategy, AdminJwtStrategy, ...adminProviders],
    exports: [AdminService, CommonUserJwtStrategy, AdminJwtStrategy],
})

export class AdminModule {}