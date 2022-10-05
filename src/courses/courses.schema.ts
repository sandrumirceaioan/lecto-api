import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CourseCertification, CourseImage, CoursePrices } from './courses.types';

export type CourseDocument = Course & Document;

@Schema()
export class Course {
    @Prop({ required: true })
    titlu: string;

    @Prop({ required: true, unique: true })
    url: string;

    @Prop({ required: false, type: {} })
    imagine: CourseImage;

    @Prop({ required: false })
    descriere: string;

    @Prop({ required: true, type: {} })
    certificare: CourseCertification;

    @Prop({ required: true, type: {} })
    pret: CoursePrices;

    @Prop({ default: false })
    status: boolean;

    @Prop({})
    createdBy?: string;

    @Prop({ default: new Date() })
    createdAt?: Date;
}

export const CourseSchema = SchemaFactory.createForClass(Course);