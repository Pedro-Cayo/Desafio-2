import { Request, Response } from 'express';
export type ExpressType = (req: Request, res: Response, next: function()) => void
export {Request, Response}

export type BestTrack = {
  order: (string | number)[];
  totalDistance: number;
};

export type Locations = { id: number; x: number; y: number };