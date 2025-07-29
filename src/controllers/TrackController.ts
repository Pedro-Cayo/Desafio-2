import {Request, Response } from 'express'
import Coord from '../models/Coord'
import { ExpressType } from '../types/types'
import {optimalTrack} from '../utils/calcFunctions'

export default class TrackController {
    static bestTrackById: ExpressType = async (req: Request, res: Response) => {
        try {
            const id = req.params.id
            const coord = await Coord.findById(id)
            if (!coord || !coord.Coordinates || coord.Coordinates.length < 2) {
                return res.status(404).json({ message: 'A coordenada não existe ou não há mais nenhuma coordenada para comparação.' })
            }
            const bestTrack = optimalTrack(coord.Coordinates);
            return res.status(200).json(bestTrack);
            
        } catch (error) {
            console.error(error)
        }
    }}