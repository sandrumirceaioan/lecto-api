import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  role: 'admin' | 'user';

  @Prop({ required: false })
  status: boolean;

  @Prop({ required: true })
  atHash: string;

  @Prop({ required: false })
  rtHash?: string;

  @Prop()
  createdBy?: string;

  @Prop({ default: new Date() })
  createdAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);