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
    data: { type: MongooseSchema.Types.ObjectId, ref: 'Course' }

    @Prop({ required: true })
    teachers: [{ type: MongooseSchema.Types.ObjectId, ref: 'Teacher' }];

    @Prop({ required: false, type: {} })
    discounts: {
        volum: [],
        inscriere: [],
        fidelitate: []
    };
    @Prop({ type: {} })
    options: {
        certificare?: CourseCertification;
        pret: CoursePrices;
    }
}

@Schema()
export class SessionLocation {
    @Prop({ required: true, type: {} })
    data: { type: MongooseSchema.Types.ObjectId, ref: 'Location' }
    
    @Prop({ required: false })
    oferte: [];
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

    @Prop({ required: true })
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

    @Prop({ required: true, type: [] })
    cursuri: SessionCourse[];

    @Prop({ required: false, type: {} })
    locatii: SessionLocation[];

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    createdBy?: Types.ObjectId;

    @Prop({ default: new Date() })
    createdAt?: Date;
}

export const SessionSchema = SchemaFactory.createForClass(Session);