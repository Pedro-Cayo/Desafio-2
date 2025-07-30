import Coord from '../models/Coord'
import { ExpressType } from '../types/types'
import {optimalTrack} from '../utils/calcFunctions'
import Track from '../models/Tracks'

export default class TrackController {
    static bestTrackById: ExpressType = async (req, res) => {
        try {
            const id = req.params.id
            const coord = await Coord.findById(id)
            if (!coord || !coord.Coordinates || coord.Coordinates.length < 2) {
                return res.status(404).json({ message: 'A coordenada não existe ou não há mais nenhuma coordenada para comparação.' })
            }
            const bestTrack = optimalTrack(coord.Coordinates);
            const idDuplicate = await Track.findOne({'OptimalTrack.id': id})
            if(idDuplicate){
                return res.status(409).json({ message: 'Já existe uma rota com esse id.' })
            }            
            const newTrack = new Track({
            OptimalTrack: [{
            id: id,
            order: bestTrack.order,
            totalDistance: bestTrack.totalDistance,
            }]
             })
            await newTrack.save()
            return res.status(200).json(bestTrack)
            
        } catch (error) {
            console.error(error)
        }
    }

    static historyById: ExpressType = async (req, res) => {
        try {
            
        } catch (error) {
            
        }
    }

}