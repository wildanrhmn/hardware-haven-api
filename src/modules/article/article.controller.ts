import { Controller, Request, Get, HttpException, UseGuards, Post, Body, Req } from '@nestjs/common';

import { ArticleService } from './article.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { CreateArticleDto } from './dto/article.dto';

@ApiTags('article')
@Controller('article')
export class ArticleController {
    constructor(
        private readonly articleService: ArticleService,
    ) { }

    @Get('/')
    async getAllArticles(): Promise<any> {
        const result = await this.articleService.getAllArticles();

        if (result.error) {
            throw new HttpException(result.message, result.status);
        }
        return result;
    }

    @Post('/create')
    @ApiBearerAuth('Authorization')
    @UseGuards(AuthGuard('admin-jwt'))
    async createArticle(@Body() payload: CreateArticleDto, @Request() req: any): Promise<any> {
        const admin = req.user;
        const result = await this.articleService.createArticle(payload, admin);

        if (result.error) {
            throw new HttpException(result.message, result.status);
          }
          return result;
    }
}