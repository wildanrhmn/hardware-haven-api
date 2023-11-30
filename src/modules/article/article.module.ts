import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { ArticleService } from "./article.service";
import { articleProviders } from "src/models/articles/article.provider";

@Module({
    imports: [
        PassportModule,
    ],
    providers: [ArticleService, ...articleProviders],
    exports: [ArticleService],
})
export class ArticleModule {}