import { Request, Response } from 'express';
export type ExpressType = (req: Request, res: Response, next: function()) => void
export {Request, Response}