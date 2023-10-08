import {Controller, Request, Get, HttpException, UseGuards} from '@nestjs/common';
import { UserService } from "./user.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('user')
@Controller('user')
export class UserController{
   constructor(private readonly userService: UserService) {}
   @Get('/')
   async getAllUsers(){
    const result = await this.userService.getAllUsers();
    
    if (result.error) {
        throw new HttpException(result.message, 400);
      }
      return result;
   }

   @UseGuards(JwtAuthGuard)
   @ApiBearerAuth('Authorization')
   @Get('/user-detail')
   async getDetailUser(@Request() req: any ){
    const user = req.user;
    const result = await this.userService.getDetailUser(user);
    
    if (result.error) {
        throw new HttpException(result.message, 400);
      }
      return result;
   }
}