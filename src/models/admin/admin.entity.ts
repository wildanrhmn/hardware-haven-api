import { Table, Model, Column, PrimaryKey, Unique, HasMany } from "sequelize-typescript";
import { Article } from "../articles/article.entity";
@Table({
    tableName: 'admin',
    schema: 'forum_user',
    timestamps: false,
    indexes: [
        {
            name: 'admin_pk',
            unique: true,
            fields: [{ name: 'id_admin' }]
        },
    ],
})

export class Admin extends Model{
    @PrimaryKey
    @Column
    id_admin: string;

    @Unique
    @Column
    username: string;

    @Column
    password: string;

    @Column
    role: string;

    @HasMany(() => Article, { as: 'articles' })
    articles: Article[];
}
