import { Injectable, Inject } from "@nestjs/common";
import { Article } from "src/models/articles/article.entity";

import { sequelize } from "src/utility/seq-helper";
import { CreateArticleDto } from "./dto/article.dto";
import { AdminTokenPayload } from "src/types/token-payload";

import { v4 as uuidv4 } from 'uuid';
import { Admin } from "src/models/admin/admin.entity";

@Injectable()
export class ArticleService {
    constructor(
        @Inject('ARTICLE_REPOSITORY')
        private articleRepository: typeof Article
    ) { }

    async getAllArticles(): Promise<any> {
        try {
            const articles = await this.articleRepository.findAll({
                attributes: {
                    exclude: ['id_admin']
                },
                include:[
                    { model: Admin, attributes: {exclude: ['password']}}
                ]
            });
            return {
                result: articles,
                message: 'Successfully get all articles',
            }
        } catch (err) {
            return {
                error: true,
                message: err,
            }
        }
    }

    async createArticle(payload: CreateArticleDto, authToken: AdminTokenPayload): Promise<any> {
        if (authToken.role !== 'moderator') {
            return {
                error: true,
                status: 401,
                message: 'Only moderator can create article',
            }
        }
        const trx = await sequelize.transaction();
        try {
            const uuid = uuidv4();
            const article = await this.articleRepository.create({
                id_article: uuid,
                title: payload.title,
                description: payload.description,
                attachments: payload.attachments ? payload.attachments : [],
                id_admin: authToken.id_admin,
            }, { transaction: trx });

            await trx.commit();
            return {
                result: article,
                message: 'Successfully create article',
            }
        } catch (err) {
            await trx.rollback();
            return {
                error: true,
                message: 'Unable to create article',
            }
        }
    }
}