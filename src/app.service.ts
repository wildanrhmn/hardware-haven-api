import {Injectable} from '@nestjs/common';
import {sequelize} from './utility/seq-helper';

@Injectable()
export class AppService {
  async checkSequelizeConnection(): Promise<any> {
    try {
      await sequelize.authenticate();
      return {result: 'Connection has been established successfully.', error: null, message: 'Connection has been established successfully.'};
    } catch (error) {
      return {result: null, error: error, message: 'Unable to connect to the database:'};
    }
  }
}
