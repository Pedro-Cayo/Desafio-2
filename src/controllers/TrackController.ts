import Coord from '../models/Coord'
import { ExpressType, TrackHistory } from '../types/types'
import {optimalTrack} from '../utils/calcFunctions'
import Track from '../models/Tracks'
import { format } from "date-fns";

export default class TrackController {
    static bestTrackById: ExpressType = async (req, res) => {
        try {
            const id = req.params.id
            const coord = await Coord.findById(id)
            if (!coord || !coord.Coordinates || coord.Coordinates.length < 2) {
                return res.status(404).json({ message: 'A coordenada não existe ou não há mais nenhuma coordenada para comparação.' })
            }
            const bestTrack = optimalTrack(coord.Coordinates)
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
            return res.status(404).json({message: `Conjunto de pontos não encontrado.}`})
        }
    }

    static history: ExpressType = async (req, res) => {
        try {
            const tracks = await Track.find().sort({ createdAt: -1 })
            const formatedTracks: TrackHistory[] = tracks.map((track) =>{
                const properties = track.OptimalTrack[0]
                return{
                    trackId: track.id,
                    trackOrder: properties.order,
                    originalCoordsId: properties.id,
                    trackDate: format(new Date(track.createdAt as any), 'dd/MM/yyyy HH:mm'),
                    totalDistance: properties.totalDistance,
                }
            })
            return res.status(200).json(formatedTracks)
        } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Erro ao acessar o histórico.' })
        }
    }
    static deleteTracks: ExpressType = async (req, res) => {
        try {
            const id = req.params.id
            const mongoDbId = await Track.findById(id)
            if(!id || !mongoDbId){
            return res.status(404).json({message: `O Id desse conjunto de pontos não existe.}`})   
            }
            await Track.findByIdAndDelete(id)
            res.status(200).json({message: `Track de Id: ${id} removido com sucesso!`})
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: 'Erro ao deletar a Track do servidor.' })
        }
    }
}