import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsString,
} from 'class-validator';

export class CreateEmailDto {
  @IsArray()
  @IsEmail({}, { each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  to: string[];

  @IsString()
  subject: string;

  @IsString()
  html: string;
}
