import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as MongooseSchema } from 'mongoose';
import { PageImage } from './pages.types';

export type PageDocument = Page & Document;

@Schema()
export class Page {
    @Prop({ required: true })
    titlu: string;

    @Prop({ required: true, unique: true })
    url: string;

    @Prop({ required: false, type: {} })
    imagine: PageImage;

    @Prop({ required: false })
    descriere: string;

    @Prop({ default: false })
    status: boolean;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    createdBy?: Types.ObjectId;

    @Prop({ default: new Date() })
    createdAt?: Date;
}

export const PageSchema = SchemaFactory.createForClass(Page);