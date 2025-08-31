import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TrackDocument = Track & Document;

@Schema({ timestamps: true })
export class Track {
  @Prop({ type: [String], required: true })
  pontosId: string;

  @Prop({ type: [String], required: true })
  ordem: string[];

  @Prop({ type: Number, required: true })
  distanciaTotal: number;

  @Prop({ type: Date, default: Date.now })
  dataCalculo: Date;
}
export const TrackSchema = SchemaFactory.createForClass(Track);