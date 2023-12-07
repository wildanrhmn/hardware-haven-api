import { Table, Model, Column, PrimaryKey, ForeignKey, BelongsTo } from "sequelize-typescript";

import { Article } from "../articles/article.entity";
import { Admin } from "../admin/admin.entity";
import { User } from "../user/user.entity";

@Table({
    tableName: 'article_comments',
    schema: 'forum_user',
    timestamps: false,
    indexes: [
        {
            name: 'article_comments_pk',
            unique: true,
            fields: [{ name: 'id_comment' }]
        },
    ],
})

export class ArticleComment extends Model{
    @PrimaryKey
    @Column
    id_comment: string;

    @Column
    content: string;

    @Column
    created_at: Date;
  
    @Column
    updated_at: Date;
  
    @ForeignKey(() => Article)
    @Column
    id_article: string;

    @ForeignKey(() => User)
    @Column
    user_id: string;

    @ForeignKey(() => Admin)
    @Column
    id_admin: string;

    @BelongsTo(() => User, {foreignKey: 'user_id'})
    user: User;

    @BelongsTo(() => Admin, { foreignKey: 'id_admin' })
    admin: Admin;

}