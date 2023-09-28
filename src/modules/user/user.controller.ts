import {Body, Controller, Request, Get, Post, HttpException, UseGuards} from '@nestjs/common';
import { UserService } from "./user.service";
import { ApiTags } from "@nestjs/swagger";

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
}