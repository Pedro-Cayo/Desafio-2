import { Request, Response } from 'express'
import Coord from '../models/Coord'
import { ExpressType } from '../types/types'

export default class CoordController {
    static coord: ExpressType = async (req: Request, res: Response) => {
    try {
          const info = req.body
          if (!Array.isArray(info)) {
              return res.status(400).json({ message: 'Esperado um array de pontos.' })
          }
          for (const coord of info) {
              if (!coord.x || !coord.y) {
                return res.status(422).json({ message: 'Todos os pontos devem possuir as coordenadas x e y.' })
              }
            }
          const savedCoords = await Coord.insertMany(info)
          res.status(201).json(savedCoords)
    }catch(error) {
        console.error(error)
        res.status(500).json({message: 'Erro ao salvar coordenadas'})
    }
  }
  }   