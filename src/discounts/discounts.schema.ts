import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as MongooseSchema } from 'mongoose';
import { CategorieDiscount, DiscountFidelitate, DiscountInscriere, DiscountVolum } from './discounts.types';

export type DiscountDocument = Discount & Document;

@Schema()
export class Discount {
    @Prop({ required: true })
    categorie: CategorieDiscount;

    @Prop()
    volum?: DiscountVolum[];

    @Prop()
    inscriere?: DiscountInscriere[];

    @Prop()
    fidelitate?: DiscountFidelitate[];

    @Prop()
    descriere: string;

    @Prop({ default: false })
    activ: boolean;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    createdBy?: Types.ObjectId;

    @Prop({ default: new Date() })
    createdAt?: Date;
}

export const DiscountSchema = SchemaFactory.createForClass(Discount);