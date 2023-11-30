import { Injectable, Inject } from "@nestjs/common";
import { v4 as uuidv4 } from 'uuid';

import { sequelize } from "src/utility/seq-helper";
import { crypt, decrypt } from "src/utility/auth-util";

import { Admin } from "src/models/admin/admin.entity";
import { Article } from "src/models/articles/article.entity";

import { AdminTokenPayload } from "src/types/token-payload";

import { CreateAdminDto } from "./dto/admin.dto";

@Injectable()
export class AdminService {
    constructor(
        @Inject('ADMIN_REPOSITORY')
        private adminRepository: typeof Admin
    ) { }

    async getAllAdmins(authToken: AdminTokenPayload): Promise<any> {
        if(!authToken.id_admin){
            return{
                error: true,
                status: 401,
                message: 'Unauthorized',
            }
        }

        if(authToken.role !== 'super'){
            return{
                error: true,
                status: 401,
                message: 'Unauthorized',
            }
        }
        try {
            const admin = await this.adminRepository.findAll({
                attributes: {
                    exclude: ['password']
                },
                include:[
                    { model: Article, as: 'articles', attributes: {exclude: ['id_admin']}}
                ]
            })

            if (!admin) {
                return {
                    error: true,
                    message: 'Admin not found',
                }
            }

            return {
                result: admin,
                message: 'Successfully get all admin',
            }
        } catch (err) {
            return {
                error: true,
                message: 'Unable to get admin',
            }
        }
    }

    async getAdminDetail(payload: AdminTokenPayload): Promise<any> {
        try {
            const admin = await this.adminRepository.findOne({
                where: {
                    id_admin: payload.id_admin,
                }
            })
            return {
                result: admin,
                message: 'Successfully get admin detail',
            }
        } catch (err) {
            return {
                error: true,
                message: 'Unable to get admin',
            }
        }
    }

    async createAdmin(payload: CreateAdminDto, authToken: AdminTokenPayload): Promise<any> {
        if (authToken.role !== 'super') {
            return {
                error: true,
                status: 401,
                message: 'Only super admin can create admin!',
            }
        }

        const trx = await sequelize.transaction();

        try {
            const checkExist = await this.adminRepository.findOne({
                where: {
                    username: payload.username,
                }
            })
            if (checkExist) {
                return {
                    error: true,
                    message: 'Admin already exist',
                }
            }
            const uuid = uuidv4();
            const admin = await this.adminRepository.create({
                id_admin: uuid,
                username: payload.username,
                password: crypt(payload.password),
                role: payload.role,
            }, { transaction: trx });

            await trx.commit();
            return {
                result: admin,
                message: 'Successfully create new admin!',
            }
        } catch (err) {
            await trx.rollback();
            return {
                result: null,
                error: err,
                message: 'Failed to create new admin!',
            }
        }
    }
}