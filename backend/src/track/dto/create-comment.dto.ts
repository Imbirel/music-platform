import { IsString, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCommentDto {
  @IsString()
  readonly username: string;

  @IsString()
  readonly text: string;

  @IsMongoId()
  readonly trackId: Types.ObjectId;
}
