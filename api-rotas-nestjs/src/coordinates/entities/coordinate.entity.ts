import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CoordDocument = HydratedDocument<Coordinate>

@Schema({timestamps: true})
export class Coordinate {
    @Prop({ required: true, type: String })
    id: string

    @Prop({ required: true, type: Number })
    x: number;

    @Prop({ required: true, type: Number })
    y: number; 
}
export const CoordinateSchema = SchemaFactory.createForClass(Coordinate)