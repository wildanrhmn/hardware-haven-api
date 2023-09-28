import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { BaseResponseInterceptor } from './utility/interceptors/base-response.interceptor';
import {v4 as uuidv4} from 'uuid';

async function bootstrap() {
  try{
    const PORT = process.env.PORT || 3002;
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({ logger: true, genReqId: () => uuidv4(), }));
    app.setGlobalPrefix('dev/v1');
    app.enableCors({origin: '*'});
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.useGlobalInterceptors(new BaseResponseInterceptor());
    await app.listen(PORT, '0.0.0.0');
  }catch(err){
    console.error(err);
    process.exit(1);
  }
}
bootstrap();
