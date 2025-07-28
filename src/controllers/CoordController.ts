import { Request, Response } from 'express'
import Coord from '../models/Coord'
import { ExpressType } from '../types/types'

class CoordController {
  static coord: ExpressType = async (req: Request, res: Response) => {
    const {id, x, y} = req.body
    // Create a new Coord
    const coord = new Coord ({
        id,
        x,
        y
    })
    try {
        const newCoord = await coord.save()
        res.status(201).json({
            message: 'Coordenada Adicionada',
            newCoord,
        })
    } catch (error) {
        res.status(500).json({message: error})
    }
  }
}

export default CoordController