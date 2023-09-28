import { Injectable, Inject } from "@nestjs/common";
import {v4 as uuidv4} from 'uuid';

import { sequelize } from "src/utility/seq-helper";

import { User } from "src/models/forum_user/user.entity";

import {JwtService} from '@nestjs/jwt';

import { RegisterDto } from "./dto/register.dto";

import { crypt, decrypt } from "src/utility/auth-util";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh.dto";

@Injectable()
export class AuthService{
    constructor(
        @Inject('USER_REPOSITORY')
        private userRepository: typeof User,
        private readonly jwtService: JwtService,
    ){}

    async register(payload: RegisterDto){
        const checkExist = await this.userRepository.findOne({
            where: {
                user_email: payload.user_email,
            },
        })
        if(checkExist){
            return{
                error: true,
                message: 'User already exist',
            }
        }
        const trx = await sequelize.transaction();
        try{
            const accessToken = this.jwtService.sign(
                {
                    email: payload.user_email,
                    iss: 'forum',
                },
                {
                    expiresIn: process.env.JWT_EXPIRATION_TIME,
                }
            );
            const uuid = uuidv4();
            const user = await this.userRepository.create({
                user_id: uuid,
                username: payload.username,
                password: crypt(payload.password),
                user_email: payload.user_email,
                phone: payload.phone,
            }, {transaction: trx});
    
            await trx.commit();
            return{
                result: user,
                message: 'Successfully created new user!',
                accessToken: accessToken,
            }
        }catch(err){
            await trx.rollback();
            return{
                result: null,
                error: err,
                message: 'Failed to create new user!',
            }
        }
    }

    async login(payload: LoginDto){
        const user = await this.userRepository.findOne({
            where: {
                username: payload.username,
            }
        })
        if(!user){
            return{
                error: true,
                message: 'User with specified username not found',
            }
        }
        try{
            const accessToken = this.jwtService.sign(
                {
                    user_id: user.user_id,
                    iss: 'forum',
                },
                {
                    expiresIn: process.env.JWT_EXPIRATION_TIME,
                }
            );
            const refreshToken = this.jwtService.sign(
                {
                    user_id: user.user_id,
                    iss: 'forum',
                },
                {
                    expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME,
                }
            )
            if(decrypt(user.password) !== payload.password){
                return{
                    message: 'Invalid password',
                    error: true,
                }
            }
            return{
                result: {accessToken: accessToken, refreshToken: refreshToken},
                message: 'Login Success.',
            }
        }catch(err){
            return{
                result: null,
                error: err,
                message: 'Failed to validate user',
            }
        }
    }

    async refresh(payload: RefreshTokenDto){
        try{
            const decoded = this.jwtService.verify(payload.refreshToken);
            const user = await this.userRepository.findOne({
                where: {
                    user_id: decoded.user_id,
                }
            })
            if(!user){
                return{
                    error: true,
                    message: 'User not found',
                }
            }
            const newAccessToken = this.jwtService.sign(
                {
                    user_id: user.user_id,
                    iss: 'forum',
                },
                {
                    expiresIn: process.env.JWT_EXPIRATION_TIME,
                }
            );
            const newRefreshToken = this.jwtService.sign(
                {
                    user_id: user.user_id,
                    iss: 'forum',
                },
                {
                    expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME,
                }
            )
            return{
                result: {accessToken: newAccessToken, refreshToken: newRefreshToken},
                success: true,
            }
        }catch(err){
            return{
                result: null,
                error: err,
                message: 'Failed to refresh token',
            }

        }
    }
}
