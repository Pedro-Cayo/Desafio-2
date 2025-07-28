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
        const info = req.body
        // Validações de Valores Númericos
        for(const coord of info){
            if (typeof coord.x !== 'number' || isNaN(coord.x)) {
                res.status(422).json({ message: 'O valor de x deve ser númerico.'})
              }
            if (typeof coord.y !== 'number' || isNaN(coord.y)) {
                res.status(422).json({ message: 'O valor de y deve ser númerico.' })
              }
            if (typeof coord.id !== 'number' || isNaN(coord.id)) {
                res.status(422).json({ message: 'O valor do id deve ser númerico.' })
              } 
            const equalPairs = info.map((coord: any) => `${coord.x}, ${coord.y}`)
            const duplicates = equalPairs.filter((pair: string, index: number) => equalPairs.indexOf(pair) !== index)
            if (duplicates.length > 0) {    
                return res.status(422).json({
                message: `Coordenadas duplicadas detectadas: (${duplicates[0]})`
                })
            }
        }
        
    console.error(error)
      res.status(500).json({ message: 'Erro ao salvar coordenadas.' })
    }
  }
  }   