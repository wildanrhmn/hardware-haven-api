import {Controller, Request, Get, HttpException, UseGuards, Post} from '@nestjs/common';
import { UserService } from "./user.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from '@nestjs/passport';

@ApiTags('user')
@Controller('user')
export class UserController{
   constructor(private readonly userService: UserService) {}
   @Get('/')
   @UseGuards(AuthGuard('admin-jwt'))
   @ApiBearerAuth('Authorization')
   async getAllUsers(){
    const result = await this.userService.getAllUsers();
    
    if (result.error) {
        throw new HttpException(result.message, 400);
      }
      return result;
   }

   @UseGuards(AuthGuard('common-user-jwt'))
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

   @UseGuards(AuthGuard('common-user-jwt'))
   @ApiBearerAuth('Authorization')
   @Post('/verify-email')
   async userVerifyEmail(@Request() req: any){
      const user = req.user;
      const result = await this.userService.verifyEmail(user);

      if (result.error) {
          throw new HttpException(result.message, 400);
      }
      return result;
   }
}