import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import appConfig from './app.config';
import databaseConfig from 'database.config';

import { AuthModule } from './modules/auth/auth.module';
import { HttpModule } from '@nestjs/axios';

import { AuthController } from './modules/auth/auth.controller';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: ['.env', 'local.env', 'prod.env'],
    load: [appConfig],
    isGlobal: true,
  }),
  SequelizeModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: databaseConfig,
  }),
  AuthModule,
  HttpModule,
],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
