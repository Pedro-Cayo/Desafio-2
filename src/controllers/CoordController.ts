import { Request, Response } from 'express'
import Coords from '../models/Coord'
import { ExpressType } from '../types/types'

class CoordController {
  static coord: ExpressType = async (req: Request, res: Response) => {
    const {coordX, coordY} = req.body

    if(!)
  }
}

export default CoordController
