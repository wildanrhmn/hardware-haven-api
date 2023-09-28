import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";

import { UserService } from "./user.service";

import { ConfigModule, ConfigService } from "@nestjs/config";

import { userProviders } from "src/models/forum_user/user.provider";

@Module({
    imports:[
        PassportModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) =>{
                return{
                    secret: configService.get<string>('secretJwt'),
                    signOptions: {expiresIn: configService.get<number>('expirationJwt')},
                }
            }
        })
    ],
    providers: [UserService, ...userProviders],
    exports: [UserService]
})
export class UserModule {}