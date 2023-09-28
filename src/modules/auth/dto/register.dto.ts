import {IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, Matches} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger/dist';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsEmail()
  @IsString()
  @ApiProperty()
  user_email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'Password too weak'})
  @ApiProperty()
  password: string;

  @IsString()
  @ApiProperty()
  phone: string;

}
