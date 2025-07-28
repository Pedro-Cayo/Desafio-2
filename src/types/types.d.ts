import { Request, Response } from 'express';
export type ExpressType = (req: Request, res: Response) => void
export {Request, Response}