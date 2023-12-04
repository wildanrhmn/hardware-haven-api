import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { ArticleService } from "./article.service";
import { articleProviders } from "src/models/articles/article.provider";
import { articleCommentProviders } from "src/models/article_comments/articleComment.provider";

@Module({
    imports: [
        PassportModule,
    ],
    providers: [ArticleService, ...articleProviders, ...articleCommentProviders],
    exports: [ArticleService],
})
export class ArticleModule {}