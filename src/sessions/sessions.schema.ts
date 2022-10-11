import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { Types, Schema as MongooseSchema } from 'mongoose';
import { CourseCertification, CoursePrices } from 'src/courses/courses.types';
import { SessionType } from './sessions.types';

export type SessionDocument = Session & Document;

@Schema()
export class SessionCourse {
    @Prop({ required: true, type: {} })
    course: { type: MongooseSchema.Types.ObjectId, ref: 'Course' };

    @Prop({ type: {} })
    options: {
        discounts: [{ type: MongooseSchema.Types.ObjectId, ref: 'Discount' }];
        teachers: [{ type: MongooseSchema.Types.ObjectId, ref: 'Teacher' }];
        certificare?: CourseCertification;
        pret: CoursePrices;
    }
}

@Schema()
export class Session {
    @Prop({ required: true })
    titlu: string;

    @Prop({ required: true })
    url: string;

    @Prop({ required: true })
    type: SessionType;

    @Prop({ default: true })
    status: boolean;

    @Prop({ required: false })
    descriere: string;

    @Prop({ required: true, type: {} })
    inscriere: {
        start: Date;
        end: Date;
    };

    @Prop({ required: true, type: {} })
    perioada: {
        start: Date;
        end: Date;
    };

    @Prop({ type: [] })
    cursuri: SessionCourse[];

    @Prop({ type: {} })
    locatie: { type: MongooseSchema.Types.ObjectId, ref: 'Location' };

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    createdBy?: Types.ObjectId;

    @Prop({ default: new Date() })
    createdAt?: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);