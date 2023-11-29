import {IsNotEmpty, IsString, MinLength, MaxLength} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger/dist';

export class LoginAdminDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  @ApiProperty()
  password: string;
}
