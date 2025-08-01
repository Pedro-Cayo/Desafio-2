import {Request, Response } from 'express'
import Coord from '../models/Coord'
import { ExpressType } from '../types/types'

export default class CoordController {
    static coord: ExpressType = async (req: Request, res: Response) => {
    try {
          const info = req.body
        // Validação de existência e tamanho
          if (!info || !Array.isArray(info) || info.length < 2) {
            return res.status(400).json({
            message: 'É necessário fornecer ao menos dois pares de coordenadas'
        })
      }
        for(const coord of info){
        // Validações de pares de coordenadas
            const equalPairs = info.map((coord: any) => `${coord.x}, ${coord.y}`)
            const duplicatePairs = equalPairs.filter((pair: string, index: number) => equalPairs.indexOf(pair) !== index)
            if (duplicatePairs.length > 0) {    
              return res.status(422).json({
                message: `Coordenadas duplicadas detectadas: (${duplicatePairs[0]})`
              })
            }
        // Validação se ids duplicados
            const equalId = info.map((coord: any) => coord.id)
            const duplicateId = equalId.filter((id: any, index: number) => equalId.indexOf(id) !== index)
            if (duplicateId.length > 0) {    
                return res.status(422).json({
                message: `Ids duplicados detectados: (${duplicateId[0]})`
                })
            }
        }
          const savedCoords = new Coord({ Coordinates: info })
          await savedCoords.save()
          res.status(201).json(savedCoords)
    }catch(error) {
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
      if(!coord){
        res.status(422).json({ message: 'Coordenadas não encontradas!',})
        return
      }
      // Verificação se as coordenadas colocadas em um id diferente, já existem em outro id.
      const duplicatedCoords = coord.Coordinates
      let hasChanges: boolean = false
      for (const data of info) {
        const duplicatedPairs = duplicatedCoords.find(
          c => c.id !== data.id && c.x === data.x && c.y === data.y
        )
      if (duplicatedPairs) {
        return res.status(400).json({
          message: `Coordenadas (x: ${data.x}, y: ${data.y}) já estão em uso pelo ID ${duplicatedPairs.id}.`
        })
      }
      const updatedData = coord.Coordinates.findIndex(c => c.id === data.id)
        if(updatedData !== -1){
          const updated = coord.Coordinates[updatedData]
        if (updated.x !== data.x || updated.y !== data.y) {
          coord.Coordinates[updatedData].x = data.x
          coord.Coordinates[updatedData].y = data.y
          hasChanges = true
        }
        } else {
        // Adicionando um objeto de pontos extra na array.
          coord.Coordinates.push ({
            id: data.id,
            x: data.x,
            y: data.y,
          })
        hasChanges = true
          }
        }
        // Atualização dos pontos & Verificação se houve alterações
      if (!hasChanges) {
      return res.status(200).json({
        message: 'Não houve nada para se atualizar. O id e as coordenadas são iguais.',
      })
    }
      await coord.save()
      res.status(200).json({message: `Coordenadas Atualizadas com Sucesso!`, coord: coord})
        
      } catch (error) {
        res.status(500).json({ message: 'Erro ao obter as Coordenadas.' })
        }
          
      }
  }