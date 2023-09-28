import {Controller, Get} from '@nestjs/common';
import {HttpException} from '@nestjs/common';
import {AppService} from './app.service';

@Controller('App')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async checkSequelizeConnection() {
    const result = await this.appService.checkSequelizeConnection();
    console.log(result)
    if (result?.error) {
      throw new HttpException(result, 500);
    }
    return result;
  }
}
