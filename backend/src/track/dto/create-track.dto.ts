import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsMongoId,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateTrackDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly artist: string;

  @IsString()
  readonly text: string;

  @IsNumber()
  @IsOptional()
  readonly listens?: number;

  @IsString()
  @IsOptional()
  readonly picture?: string;

  @IsString()
  @IsOptional()
  readonly audio?: string;

  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true })
  readonly comments?: Types.ObjectId[];
}
