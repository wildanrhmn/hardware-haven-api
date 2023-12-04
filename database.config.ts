import {SequelizeModuleOptions} from '@nestjs/sequelize';
import {ConfigService} from '@nestjs/config';

import { User } from 'src/models/user/user.entity';
import { Admin } from 'src/models/admin/admin.entity';
import { Article } from 'src/models/articles/article.entity';
import { ArticleComment } from 'src/models/article_comments/articleComment.entity';

export default (configService: ConfigService): SequelizeModuleOptions => ({
    dialect: 'postgres',
    host: configService.get<string>('database.host'),
    port: parseInt(configService.get<string>('database.port'), 10),
    database: configService.get<string>('database.database'),
    username: configService.get<string>('database.username'),
    password: configService.get<string>('database.password'),
    models: [User, Admin, Article, ArticleComment ],
  });