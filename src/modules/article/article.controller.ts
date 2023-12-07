import { Controller, Request, Get, HttpException, UseGuards, Post, Body } from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data/dist/decorators/form-data';

import { ArticleService } from './article.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { CreateArticleDto, EditArticleDto, DeleteArticleDto, CommentArticleDto } from './dto/article.dto';

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
    @FormDataRequest()
    async createArticle(@Body() payload: CreateArticleDto, @Request() req: any): Promise<any> {
        const admin = req.user;
        const result = await this.articleService.createArticle(payload, admin);

        if (result.error) {
            throw new HttpException(result.message, result.status);
          }
          return result;
    }

    @Post('/edit')
    @ApiBearerAuth('Authorization')
    @UseGuards(AuthGuard('admin-jwt'))
    @FormDataRequest()
    async editArticle(@Body() payload: EditArticleDto, @Request() req: any): Promise<any> {
        const admin = req.user;
        const result = await this.articleService.editArticle(payload, admin);

        if (result.error) {
            throw new HttpException(result.message, result.status);
          }
          return result;
    }

    @Post('/delete')
    @ApiBearerAuth('Authorization')
    @UseGuards(AuthGuard('admin-jwt'))
    @FormDataRequest()
    async deleteArticle(@Body() payload: DeleteArticleDto, @Request() req: any): Promise<any> {
        const admin = req.user;
        const result = await this.articleService.deleteArticle(payload, admin);

        if (result.error) {
            throw new HttpException(result.message, result.status);
          }
          return result;
    }

    @Post('/comment')
    @ApiBearerAuth('Authorization')
    @UseGuards(AuthGuard('combined-jwt'))
    async articleComment(@Body() payload: CommentArticleDto, @Request() req: any): Promise<any> {
        const user = req.user;
        console.log(user)
        const result = await this.articleService.commentArticle(payload, user);

        if (result.error) {
            throw new HttpException(result.message, result.status);
          }
          return result;
    }
}