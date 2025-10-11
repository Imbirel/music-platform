import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class Comment {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  text: string;

  @Prop({ type: Types.ObjectId, ref: 'Track', required: true })
  track: Types.ObjectId;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
