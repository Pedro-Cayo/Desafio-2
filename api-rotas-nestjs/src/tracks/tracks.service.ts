import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Track, TrackDocument } from './entities/track.entity';
import { Coordinate, CoordinateDocument } from '../coordinates/entities/coordinate.entity';
import {Locations, TrackHistory} from '../types/types'
import {optimalTrack} from '../utils/calcFunctions'

@Injectable()
export class TracksService {
  constructor(
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    @InjectModel(Coordinate.name) private coordinateModel: Model<CoordinateDocument>,
  ) {}

  async calculateTrack(pontosId: string) {
    const coordinate = await this.coordinateModel.findById(pontosId);
    if (!coordinate) {
      throw new NotFoundException('Conjunto de pontos não encontrado');
    }

    const existingTrack = await this.trackModel.findOne({ pontosId });
    if (existingTrack) {
      throw new ConflictException('Já existe uma rota calculada para este conjunto de pontos');
    }
    const pontos: Locations[] = coordinate.pontos.map((p: any, index: number) => ({
    id: p.id ?? index,  
    x: p.x,
    y: p.y,
    }));
    
    const rotaOtimizada = optimalTrack(pontos)

    const track = new this.trackModel({
      pontosId,
      ordem: rotaOtimizada.order,
      distanciaTotal: rotaOtimizada.totalDistance,
      dataCalculo: new Date()
    });

    const savedTrack = await track.save();

    const history: TrackHistory = {
    trackId: savedTrack._id,
    trackOrder: savedTrack.ordem,
    originalCoordsId: savedTrack.pontosId,
    trackDate: savedTrack.dataCalculo.toISOString(),
    totalDistance: savedTrack.distanciaTotal
  };

    return history;
  }

  async getHistory(limit?: number, offset?: number): Promise<TrackHistory[]> {
    const query = this.trackModel.find()
      .sort({ dataCalculo: -1 });

    if (offset) {
      query.skip(Number(offset));
    }

    if (limit) {
      query.limit(Number(limit));
    }

    const tracks = await query.exec();

    return tracks.map(track => ({
    trackId: track._id,
    trackOrder: track.ordem,
    originalCoordsId: track.pontosId,
    trackDate: track.dataCalculo.toISOString(),
    totalDistance: track.distanciaTotal
    }));
  }

  async deleteTrack(id: string) {
    const track = await this.trackModel.findById(id);
    if (!track) {
      throw new NotFoundException('Rota não encontrada');
    }

    await this.trackModel.findByIdAndDelete(id);
    
    return {
      message: 'Rota deletada com sucesso'
    };
  }
}