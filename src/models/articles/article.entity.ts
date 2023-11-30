import { Table, Model, Column, PrimaryKey, ForeignKey, BelongsTo, HasOne } from "sequelize-typescript";
import { DataTypes } from "sequelize";
import { Admin } from "../admin/admin.entity";


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
        type: DataTypes.ARRAY(DataTypes.STRING)
    })
    attachments: string[];

    @Column({
        type: DataTypes.ARRAY(DataTypes.STRING)
    })
    likes: string[];

    @Column({
        type: DataTypes.ARRAY(DataTypes.JSON)
    })
    comments: object[];

    @ForeignKey(() => Admin)
    @Column
    id_admin: string;

    @BelongsTo(() => Admin, {foreignKey: 'id_admin'})
    author: Admin;

}