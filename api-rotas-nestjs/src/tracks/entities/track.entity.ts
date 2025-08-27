import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CoordDocument = HydratedDocument<Track>

@Schema({timestamps: true})
export class Track {

    @Prop({ required: true, type: String })
    id: string

    @Prop({ required: true, type: Number })
    order: [string];

    @Prop({ required: true, type: Number })
    totalDistance: number; 
}
export const TrackSchema = SchemaFactory.createForClass(Track)