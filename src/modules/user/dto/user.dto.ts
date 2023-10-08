import {IsNotEmpty, IsString} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger/dist';

export class GetUserDetailDto{
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    user_id: string;
}