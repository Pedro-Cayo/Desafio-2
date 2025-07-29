import {Request, Response } from 'express'
import Coord from '../models/Coord'
import { ExpressType } from '../types/types'
import { coordDistances } from '../utils/calcFunctions'
import { Locations } from '../types/types'

export default class TrackController {
    static bestTrackById: ExpressType = async (req: Request, res: Response) => {
        try {
            const info: Locations[] = req.body
            const id = req.params.id
            const coord = await Coord.findById(id)
           
            if (!coord || !coord.Coordinates || coord.Coordinates.length < 2) {
                return res.status(404).json({ message: 'A coordenada não existe ou não há outra para comparação.' })
            }
            const origin = coord.Coordinates[0]
            const results = coord.Coordinates.slice(1).map(nextId =>({
                originId: origin.id,
                nextId: nextId.id,
                distance: coordDistances(origin, nextId)
            }))
            return res.status(200).json({
            message: `Distâncias calculadas a partir do ponto ID ${origin.id}`, results})
            
        } catch (error) {
            console.error(error)
        }
    }}