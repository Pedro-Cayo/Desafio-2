import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TrackDocument = Track & Document;

@Schema({ timestamps: true })
export class Track {
  @Prop({ required: true })
  pontosId: string;

  @Prop([String])
  ordem: string[];

  @Prop({ required: true })
  distanciaTotal: number;

  @Prop({ default: Date.now })
  dataCalculo: Date;
}
export const TrackSchema = SchemaFactory.createForClass(Track);