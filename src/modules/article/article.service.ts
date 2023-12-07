import { Injectable, Inject } from "@nestjs/common";
import { Article } from "src/models/articles/article.entity";
import { ArticleComment } from '../../models/article_comments/articleComment.entity';

import { sequelize } from "src/utility/seq-helper";
import { DeleteArticleDto, CommentArticleDto, EditCommentArticleDto, DeleteCommentArticleDto } from "./dto/article.dto";
import { AdminTokenPayload } from "src/types/token-payload";

import { v4 as uuidv4 } from 'uuid';
import cloudinary from "src/utility/cloudinary/cloudinary";
import { Admin } from "src/models/admin/admin.entity";
import { User } from "src/models/user/user.entity";

const streamifier = require('streamifier');

@Injectable()
export class ArticleService {
    constructor(
        @Inject('ARTICLE_REPOSITORY')
        private articleRepository: typeof Article,
        @Inject('ARTICLECOMMENT_REPOSITORY')
        private articleCommentRepository: typeof ArticleComment
    ) { }

    async getAllArticles(): Promise<any> {
        try {
            const articles = await this.articleRepository.findAll({
                attributes: {
                    exclude: ['id_admin']
                },
                include: [
                    { model: Admin, attributes: { exclude: ['password'] } },
                    {
                        model: ArticleComment, attributes: { exclude: ['id_admin', 'user_id', 'id_article'] },
                        include: [{ model: User, attributes: { exclude: ['password'] } }, { model: Admin, attributes: { exclude: ['password'] } }]
                    }
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

    async createArticle(payload: any, authToken: AdminTokenPayload): Promise<any> {
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
            let url_attachments = [];

            if (payload.attachments?.length > 0) {
                url_attachments = await Promise.all(payload.attachments.map((attachment) => {
                    return new Promise((resolve, reject) => {
                        let upload_stream = cloudinary.uploader.upload_stream((error, result) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve({
                                    url: result.url,
                                    public_id: result.public_id
                                });
                            }
                        });
                        streamifier.createReadStream(attachment.buffer).pipe(upload_stream);
                    });
                }));
            }

            const article = await this.articleRepository.create({
                id_article: uuid,
                title: payload.title,
                description: payload.description,
                attachments: url_attachments,
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
                message: err,
            }
        }
    }

    async editArticle(payload: any, authToken: AdminTokenPayload): Promise<any> {
        if (authToken.role !== 'moderator') {
            return {
                error: true,
                status: 401,
                message: 'Only moderator can create article',
            }
        }
        const trx = await sequelize.transaction();

        try {
            const article = await this.articleRepository.findOne({
                where: {
                    id_article: payload.id_article
                }
            });

            let new_attachments = [];

            if (payload.attachments?.length > 0) {
                new_attachments = await Promise.all(payload.attachments.map((attachment) => {
                    return new Promise((resolve, reject) => {
                        let upload_stream = cloudinary.uploader.upload_stream((error, result) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve({
                                    url: result.url,
                                    public_id: result.public_id
                                });

                                article.attachments.map((attachment: { public_id: string }) => {
                                    if (attachment.public_id !== result.public_id) {
                                        cloudinary.uploader.destroy(attachment.public_id);
                                    }
                                });

                            }
                        });
                        streamifier.createReadStream(attachment.buffer).pipe(upload_stream);
                    });
                }));
            } else {
                article.attachments.map((attachment: { public_id: string, url: string }) => {
                    new_attachments.push({
                        url: attachment.url,
                        public_id: attachment.public_id
                    })
                })
            }

            await this.articleRepository.update({
                title: payload.title,
                description: payload.description,
                attachments: new_attachments,
                updated_at: new Date()
            }, { where: { id_article: payload.id_article } });

            await trx.commit();

            return {
                message: `Successfully edit article: ${payload.id_article}`,
            }
        } catch (err) {
            await trx.rollback();
            return {
                error: true,
                message: err,
            }
        }
    }

    async deleteArticle(payload: DeleteArticleDto, authToken: AdminTokenPayload): Promise<any> {
        if (authToken.role !== 'moderator') {
            return {
                error: true,
                status: 401,
                message: 'Only moderator can delete article',
            }
        }
        const article = await this.articleRepository.findOne({
            where: {
                id_article: payload.id_article
            }
        })

        if (!article) {
            return {
                error: true,
                status: 404,
                message: 'Article not found',
            }
        }

        article.attachments.map((attachment: { public_id: string }) => {
            cloudinary.uploader.destroy(attachment.public_id);
        })

        await this.articleRepository.destroy({
            where: {
                id_article: payload.id_article
            }
        })

        return {
            message: `Successfully delete article: ${payload.id_article}`,
        }
    }

    async commentArticle(payload: CommentArticleDto, user: any): Promise<any> {
        const trx = await sequelize.transaction();

        try {
            const uuid = uuidv4();
            await this.articleCommentRepository.create({
                id_comment: uuid,
                id_article: payload.id_article,
                user_id: user.user_id ? user.user_id : null,
                id_admin: user.id_admin ? user.id_admin : null,
                content: payload.content
            }, { transaction: trx });

            await trx.commit();

            return {
                message: 'Successfully comment article',
            }
        } catch (err) {
            await trx.rollback();
            return {
                error: true,
                message: err
            }
        }
    }

    async editCommentArticle(payload: EditCommentArticleDto, user: any): Promise<any> {
        try {
            const comment = await this.articleCommentRepository.findOne({
                where: {
                    id_comment: payload.id_comment
                }
            })

            if (comment.user_id !== user.user_id ? user.user_id : null) {
                return {
                    error: true,
                    status: 401,
                    message: 'You are not allowed to edit this comment'
                }
            }

            if (comment.id_admin !== user.id_admin ? user.id_admin : null) {
                return {
                    error: true,
                    status: 401,
                    message: 'You are not allowed to edit this comment'
                }
            }

            await this.articleCommentRepository.update({
                content: payload.content,
                updated_at: new Date()
            }, { where: { id_comment: payload.id_comment } });

        } catch (err) {
            return {
                error: true,
                message: err
            }
        }
    }

    async DeleteArticleComment(payload: DeleteCommentArticleDto, user: any): Promise<any> {
        try {
            const comment = await this.articleCommentRepository.findOne({
                where: {
                    id_comment: payload.id_comment
                }
            })

            if (comment.user_id !== user.user_id ? user.user_id : null) {
                return {
                    error: true,
                    status: 401,
                    message: 'You are not allowed to delete this comment'
                }
            }

            if (comment.id_admin !== user.id_admin ? user.id_admin : null) {
                return {
                    error: true,
                    status: 401,
                    message: 'You are not allowed to delete this comment'
                }
            }

            await this.articleCommentRepository.destroy({
                where: {
                    id_comment: payload.id_comment
                }
            })

            return {
                message: 'Successfully delete comment'
            }
            
        } catch (err) {
            return {
                error: true,
                message: err
            }
        }
    }
}