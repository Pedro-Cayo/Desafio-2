import { Request, Response } from 'express'
import Coord from '../models/Coord'
import { ExpressType } from '../types/types'

export default class CoordController {
    static coord: ExpressType = async (req: Request, res: Response) => {
    try {
          const info = req.body
        
        
        for(const coord of info){
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
        try {
        const id = req.params.id
        const coord = await Coord.findById(id)

        if(!coord){
          res.status(422).json({ message: 'Coordenadas não encontradas!',})
          return
        }
        res.status(200).json({coord}) 
        } catch (error) {
        res.status(500).json({ message: 'Erro ao obter as Coordenadas.' })
          }
          
        }
        static patchCoords: ExpressType = async (req, res) => {
        try {
        const id = req.params.id
        const info = req.body
        const coord = await Coord.findById(id)
        const updatedData = [{}]

        if(!coord){
          res.status(422).json({ message: 'Coordenadas não encontradas!',})
          return
        }
        
        } catch (error) {
        res.status(500).json({ message: 'Erro ao obter as Coordenadas.' })
          }
          
        }
  }