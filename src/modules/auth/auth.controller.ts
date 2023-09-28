import { AuthService } from "./auth.service";
import {Body, Controller, Request, Get, Post, HttpException, UseGuards} from '@nestjs/common';
import { ApiTags } from "@nestjs/swagger/dist/decorators";

import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh.dto";

@ApiTags('auth')
@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService){}
    @Post('/login')
    async login(@Body() payload: LoginDto){
        const result = await this.authService.login(payload);

        if (result.error) {
            throw new HttpException(result.message, 400);
          }
        return result;
    }

    @Post('/register')
    async register(@Body() payload: RegisterDto){
        const result = await this.authService.register(payload);

        if (result.error) {
            throw new HttpException(result.message, 400);
          }
          return result;
    }

    @Post('/refresh')
    async refresh(@Body() payload: RefreshTokenDto){
        const result = await this.authService.refresh(payload);

        if (result.error) {
            throw new HttpException(result.message, 400);
          }
          return result;
    }
}