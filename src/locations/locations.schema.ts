import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { GalleryImage } from './locations.types';

export type LocationsDocument = Location & Document;

@Schema()
export class Location {
    @Prop({ required: true, unique: true })
    locatie: string;

    @Prop({ required: false, type: {} })
    imagine: GalleryImage;

    @Prop({ required: false })
    galerie: GalleryImage[];

    @Prop({ required: true })
    descriere: string;

    @Prop({ required: true })
    oras: string;

    @Prop({ required: true })
    judet: string;

    @Prop({ default: false })
    status: boolean;
    
    @Prop({})
    createdBy?: string;

    @Prop({ default: new Date() })
    createdAt?: Date;
}

export const LocationSchema = SchemaFactory.createForClass(Location);