import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as MongooseSchema } from 'mongoose';

export type SettingsDocument = Settings & Document;

@Schema({ collection: 'settings' })
export class Settings {

    @Prop({ required: true })
    title: string;
    
    @Prop({ required: true })
    summary: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    currency: string;

    @Prop({ required: false, type: {} })
    company: {
        name: string;
        description: string;
        cui: string;
        j: string;
    };

    @Prop({ required: false, type: {} })
    contact: {
        address: string;
        phones: {
            type: string;
            number: string;
            person: string;
        }[];
        email: string;
        web: string;
    }

    @Prop({ required: false, type: {} })
    social: {
        facebook: string;
        twitter: string;
        instagram: string;
        linkedin: string;
        youtube: string;
    }

    @Prop({ required: false, type: {} })
    meta: {
        title: string;
        description: string;
        keywords: string;
        author: string;
        robots: string;
    };

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    createdBy?: Types.ObjectId;

    @Prop({ default: new Date() })
    createdAt?: Date;
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);