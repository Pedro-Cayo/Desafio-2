import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CoordinateDocument = Coordinate & Document;

@Schema({timestamps: true})
export class Coordinate {
    @Prop([{
    id: { type: Number, required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true }
  }])
  pontos: Array<{
    id: string;
    x: number;
    y: number;
  }>;

  createdAt?: Date;
  updatedAt?: Date;
}

export const CoordinateSchema = SchemaFactory.createForClass(Coordinate);