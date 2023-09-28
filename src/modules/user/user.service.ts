import { Injectable, Inject } from "@nestjs/common";

import { User } from "src/models/forum_user/user.entity";

import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserService {
    constructor(
        @Inject('USER_REPOSITORY')
        private userRepository: typeof User,
        private jwtService: JwtService,
    ) {}

    async getAllUsers(): Promise<any> {
        try{
            const users = await this.userRepository.findAll({
                attributes: {
                    exclude: ['user_id', 'password']
                }
            });
            return{
                result: users,
            }
        } catch (err) {
            return {
                error: true,
                message: 'Unable to get users',
            }
        }
    }
}