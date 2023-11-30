import {IsNotEmpty, IsString, IsArray, ArrayMinSize, IsOptional} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger/dist';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsOptional()
  @IsArray()
  @ApiProperty({ type: [String] })
  attachments?: string[];
}
