import {IsNotEmpty, IsString, MinLength, MaxLength, Matches} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger/dist';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'Password too weak'})
  @ApiProperty()
  password: string;
}
