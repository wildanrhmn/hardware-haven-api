import { Table, Model, Column, PrimaryKey, Unique } from "sequelize-typescript";

@Table({
    tableName: 'user',
    schema: 'forum_user',
    timestamps: false,
    indexes: [
        {
            name: 'user_pk',
            unique: true,
            fields: [{ name: 'user_id' }]
        },
    ],
})

export class User extends Model{
    @PrimaryKey
    @Column
    user_id: string;

    @Unique
    @Column
    username: string;

    @Unique
    @Column
    user_email: string;
  
    @Column
    password: string;
  
    @Unique
    @Column
    phone: string;
  
    @Column
    is_active: boolean;

    @Column
    created_at: Date;
  
    @Column
    updated_at: Date;
}