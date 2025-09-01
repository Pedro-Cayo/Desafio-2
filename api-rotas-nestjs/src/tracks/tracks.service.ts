import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Track, TrackDocument } from './schema/track.schema';
import { Coordinate, CoordinateDocument } from '../coordinates/schema/coordinate.schema';
import { Locations } from '../types/types';
import { optimalTrack } from '../utils/calcFunctions';
import { GetHistoryResponseDto } from './dto/get-history-response.dto';

@Injectable()
export class TracksService {
  constructor(
    @InjectModel(Track.name) public trackModel: Model<TrackDocument>,
    @InjectModel(Coordinate.name) public coordinateModel: Model<CoordinateDocument>,
  ) {}

  async calculateTrack(pontosId: string): Promise<any> {
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
    
    const rotaOtimizada = optimalTrack(pontos);

    const savedTrack = await this.trackModel.create({
      pontosId,
      ordem: rotaOtimizada.order,
      distanciaTotal: rotaOtimizada.totalDistance,
      dataCalculo: new Date()
    });

    const result = {
      trackId: savedTrack._id,
      trackOrder: savedTrack.ordem,
      originalCoordsId: savedTrack.pontosId,
      trackDate: savedTrack.dataCalculo.toISOString(),
      totalDistance: parseFloat(savedTrack.distanciaTotal.toFixed(2))
    };

    return result;
  }

  async getHistory(limit?: number, offset?: number): Promise<GetHistoryResponseDto> {
    const query = this.trackModel.find()
      .sort({ dataCalculo: -1 });

    if (offset) {
      query.skip(Number(offset));
    }

    if (limit) {
      query.limit(Number(limit));
    }

    const tracks = await query.exec();
    const total = await this.trackModel.countDocuments();

    return {
      history: tracks.map(track => ({
        trackId: (track._id as any).toString(),
        trackOrder: track.ordem.map((id: any) => Number(id)),
        originalCoordsId: track.pontosId,
        trackDate: track.dataCalculo.toISOString(),
        totalDistance: parseFloat(track.distanciaTotal.toFixed(2))
      })),
      total,
    };
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