import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TeacherImage } from './teachers.types';

export type TeacherDocument = Teacher & Document;

@Schema()
export class Teacher {
    @Prop({ required: true })
    nume: string;

    @Prop({ required: false })
    experienta: string;

    @Prop({ required: false })
    descriere: string;

    @Prop({ required: false, type: {} })
    imagine: TeacherImage;

    @Prop({ required: false, type: {} })
    email: string;

    @Prop({ required: false, type: {} })
    telefon: string;

    @Prop({})
    createdBy?: string;

    @Prop({ default: new Date() })
    createdAt?: Date;
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);