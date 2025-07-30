import { Request, Response } from 'express';
import { Date } from 'mongoose';
export type ExpressType = (req: Request, res: Response, next: function()) => void
export type Locations = { id: number; x: number; y: number };

export type BestTrack = {
  order: (string | number)[];
  totalDistance: number;
};

export type TrackHistory = {
  trackId: string,
  originalCoordsId: string,
  trackDate: Date,
  totalDistance: number
}
