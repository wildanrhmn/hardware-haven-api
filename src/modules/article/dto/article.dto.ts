import {IsNotEmpty, IsString, IsArray, IsOptional} from 'class-validator';
import { IsFiles, HasMimeType } from 'nestjs-form-data/dist/decorators';
import { FileSystemStoredFile } from 'nestjs-form-data/dist/classes/storage';

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
  @IsFiles()
  @HasMimeType(['image/jpeg', 'image/png'], { each: true })
  attachments?: FileSystemStoredFile[];
  
}

export class EditArticleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  id_article: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsOptional()
  @IsFiles()
  @HasMimeType(['image/jpeg', 'image/png'], { each: true })
  attachments?: FileSystemStoredFile[];
}

export class DeleteArticleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  id_article: string;
}

export class CommentArticleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  id_article: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  content: string;
}

export class EditCommentArticleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  id_comment: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  content: string;

}
export class DeleteCommentArticleDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  id_comment: string;
}

