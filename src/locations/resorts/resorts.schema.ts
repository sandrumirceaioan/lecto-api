import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as MongooseSchema } from 'mongoose';
import { GalleryImage } from './resorts.types';

export type ResortsDocument = Resort & Document;

@Schema()
export class Resort {
    @Prop({ required: true })
    resort: string;

    @Prop({ required: true, unique: true })
    url: string;

    @Prop({ required: false, type: {} })
    imagine: GalleryImage;

    @Prop({ required: false })
    descriere: string;

    @Prop({ required: true })
    oras: string;

    @Prop({ required: true })
    judet: string;

    @Prop({ default: false })
    status: boolean;
    
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    createdBy?: Types.ObjectId;

    @Prop({ default: new Date() })
    createdAt?: Date;
}

export const ResortSchema = SchemaFactory.createForClass(Resort);