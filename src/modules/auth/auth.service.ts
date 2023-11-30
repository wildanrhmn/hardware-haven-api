import { Injectable, Inject } from "@nestjs/common";
import {v4 as uuidv4} from 'uuid';

import { sequelize } from "src/utility/seq-helper";

import { User } from "src/models/user/user.entity";
import { Admin } from "src/models/admin/admin.entity";

import {JwtService} from '@nestjs/jwt';

import { crypt, decrypt } from "src/utility/auth-util";

import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { LoginAdminDto } from "./dto/login.admin.dto";
import { RefreshTokenDto } from "./dto/refresh.dto";
import { ChangePasswordDto } from "./dto/change_password.dto";
import { TokenPayload } from "src/types/token-payload";

@Injectable()
export class AuthService{
    constructor(
        @Inject('USER_REPOSITORY')
        private userRepository: typeof User,

        @Inject('ADMIN_REPOSITORY')
        private adminRepository: typeof Admin,

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

    async loginAdmin(payload: LoginAdminDto){
        const admin = await this.adminRepository.findOne({
            where: {
                username: payload.username,
            }
        })
        if(!admin){
            return{
                error: true,
                message: 'Admin with specified username not found',
            }
        }
        try{
            const accessToken = this.jwtService.sign(
                {
                    id_admin: admin.id_admin,
                    role: admin.role,
                    iss: 'forum',
                },
                {
                    expiresIn: process.env.JWT_EXPIRATION_TIME,
                }
            );
            const refreshToken = this.jwtService.sign(
                {
                    id_admin: admin.id_admin,
                    role: admin.role,
                    iss: 'forum',
                },
                {
                    expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME,
                }
            )
            if(decrypt(admin.password)   !== payload.password){
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

    async changePassword(payload: ChangePasswordDto, user: TokenPayload){
        try{
            const userDetail = await this.userRepository.findOne({
                where: {
                    user_id : user.user_id
                }
            })

            if(decrypt(userDetail.password) === payload.newPassword){
                return{
                    error: true,
                    message: 'New password cannot be same as old password',
                }
            }
            await this.userRepository.update({
                password: crypt(payload.newPassword),
                updated_at: new Date(),
            }, {where: { user_id: user.user_id }});

            return{
                result: null,
                message: 'Successfully change password!',
            }
        }catch(err){
            return{
                error: true,
                message: 'Failed to change password',
            }
        }
    }
}
