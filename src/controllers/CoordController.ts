import { Request, Response } from 'express'
import Coord from '../models/Coord'
import { ExpressType } from '../types/types'

export default class CoordController {
    static coord: ExpressType = async (req: Request, res: Response) => {
    try {
          const info = req.body
        // Validação se está enviando um Array de pontos
        if (!Array.isArray(info)) {
              return res.status(400).json({ message: 'Esperado um array de pontos.' })
          }
        // Validações de Valores Númericos
        for(const coord of info){
            if (typeof coord.x !== 'number' || isNaN(coord.x)) {
                return res.status(422).json({ message: `Os valores de x devem ser númericos. O erro está no objeto de id ${coord.id}`})
              }
            if (typeof coord.y !== 'number' || isNaN(coord.y)) {
               return res.status(422).json({ message: `Os valores de y devem ser númericos. O erro está no objeto de id ${coord.id}` })
              }
            if (typeof coord.id !== 'number' || isNaN(coord.id)) {
              return res.status(422).json({ message: `Os valores do id devem ser númericos. O erro está no objeto de id ${coord.id}` })
              }
            if (!coord.x || !coord.y) {
                return res.status(422).json({ message: `Todos os pontos devem possuir as coordenadas x e y. O erro está no objeto de id ${coord.id}` })
              }
        // Validações de pares de coordenadas ou Id's iguais 
            const equalPairs = info.map((coord: any) => `${coord.x}, ${coord.y}`)
            const duplicatePairs = equalPairs.filter((pair: string, index: number) => equalPairs.indexOf(pair) !== index)
            if (duplicatePairs.length > 0) {    
                return res.status(422).json({
                message: `Coordenadas duplicadas detectadas: (${duplicatePairs[0]})`
                })
            }
            const equalId = info.map((coord: any) => coord.id)
            const duplicateId = equalId.filter((id: any, index: number) => equalId.indexOf(id) !== index)
            if (duplicateId.length > 0) {    
                return res.status(422).json({
                message: `Ids duplicados detectados: (${duplicateId[0]})`
                })
            }
        }
        // -----------------------------------------------------
          const savedCoords = new Coord({ Coordinates: info })
          await savedCoords.save()
          res.status(201).json(savedCoords)
    }catch(error) {
    console.error(error)
      res.status(500).json({ message: 'Erro ao salvar coordenadas.' })
    }
  }
        static getCoordsById: ExpressType = async (req, res) => {
          const id = req.params.id
          const coord = await Coord.findById(id)

          if(!coord){
          res.status(422).json({ message: 'Coordenadas não encontradas!',})
          return
          }
          res.status(200).json({coord})
        }
  }