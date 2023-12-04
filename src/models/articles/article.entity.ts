import { Table, Model, Column, PrimaryKey, ForeignKey, BelongsTo, HasOne, HasMany } from "sequelize-typescript";
import { DataTypes } from "sequelize";
import { Admin } from "../admin/admin.entity";
import { ArticleComment } from "../article_comments/articleComment.entity";

@Table({
    tableName: 'articles',
    schema: 'forum_user',
    timestamps: false,
    indexes: [
        {
            name: 'articles_pk',
            unique: true,
            fields: [{ name: 'id_article' }]
        }
    ]
})

export class Article extends Model{
    @PrimaryKey
    @Column
    id_article: string;

    @Column
    title: string;

    @Column
    description: string;

    @Column
    created_at: Date;

    @Column
    updated_at: Date;

    @Column({
        type: DataTypes.ARRAY(DataTypes.JSON)
    })
    attachments: object[];

    @Column({
        type: DataTypes.ARRAY(DataTypes.STRING)
    })
    likes: string[];

    @ForeignKey(() => Admin)
    @Column
    id_admin: string;

    @BelongsTo(() => Admin, {foreignKey: 'id_admin'})
    author: Admin;

    @HasMany(() => ArticleComment, {foreignKey: 'id_article', as: 'comments'})
    comments: ArticleComment[];

}