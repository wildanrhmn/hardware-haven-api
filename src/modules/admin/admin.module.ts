import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";

import { adminProviders } from "src/models/admin/admin.provider";
import { AdminService } from "./admin.service";

@Module({
    imports: [
        PassportModule,
    ],
    providers: [AdminService, ...adminProviders],
    exports: [AdminService],
})

export class AdminModule {}