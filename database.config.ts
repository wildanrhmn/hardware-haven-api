import {SequelizeModuleOptions} from '@nestjs/sequelize';
import {ConfigService} from '@nestjs/config';

import { User } from 'src/models/forum_user/user.entity';

export default (configService: ConfigService): SequelizeModuleOptions => ({
    dialect: 'postgres',
    host: configService.get<string>('database.host'),
    port: parseInt(configService.get<string>('database.port'), 10),
    database: configService.get<string>('database.database'),
    username: configService.get<string>('database.username'),
    password: configService.get<string>('database.password'),
    models: [User],
  });