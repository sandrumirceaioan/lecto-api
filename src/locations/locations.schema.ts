import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as MongooseSchema } from 'mongoose';
import { GalleryImage } from './locations.types';

export type LocationsDocument = Location & Document;

@Schema()
export class Location {
    @Prop({ required: true, unique: true })
    locatie: string;

    @Prop({ required: true, unique: true })
    url: string;

    @Prop({ required: false, type: {} })
    imagine: GalleryImage;

    @Prop({ required: false })
    galerie: GalleryImage[];

    @Prop({ required: true })
    descriere: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Resort' })
    resort: Types.ObjectId;

    @Prop({ default: false })
    status: boolean;
    
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    createdBy?: Types.ObjectId;

    @Prop({ default: new Date() })
    createdAt?: Date;
}

export const LocationSchema = SchemaFactory.createForClass(Location);