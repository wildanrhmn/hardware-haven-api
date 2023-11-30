import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { UserService } from "./user.service";

import { userProviders } from "src/models/user/user.provider";

@Module({
    imports:[
        PassportModule,
    ],
    providers: [UserService, ...userProviders],
    exports: [UserService]
})
export class UserModule {}