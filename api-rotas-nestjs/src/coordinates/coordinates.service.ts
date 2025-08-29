import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCoordinateDto } from './dto/create-coordinate.dto';
import { UpdateCoordinateDto } from './dto/update-coordinate.dto';
import { Coordinate, CoordinateDocument } from './entities/coordinate.entity';

@Injectable()
export class CoordinatesService {
  constructor(
    @InjectModel(Coordinate.name) private coordinateModel: Model<CoordinateDocument>
  ) {}

  async create(createCoordinateDto: CreateCoordinateDto) {
    const { pontos } = createCoordinateDto;
    if (pontos.length < 2) {
      throw new BadRequestException('É necessário pelo menos 2 pontos de entrega');
    }

    const ids = pontos.map(p => p.id);
    const idsUnicos = new Set(ids);
    if (ids.length !== idsUnicos.size) {
      throw new BadRequestException('IDs dos pontos devem ser únicos');
    }

    const coordinate = new this.coordinateModel({ pontos });
    const saved = await coordinate.save();
    
    return {
      id: saved._id,
      pontos: saved.pontos,
      createdAt: saved.createdAt
    };
  }

  async findOne(id: string) {
    try {
      const coordinate = await this.coordinateModel.findById(id);
      if (!coordinate) {
        throw new NotFoundException('Conjunto de pontos não encontrado');
      }
      
      return {
        id: coordinate._id,
        pontos: coordinate.pontos,
        createdAt: coordinate.createdAt
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Conjunto de pontos não encontrado');
    }
  }

  async update(id: string, updateCoordinateDto: UpdateCoordinateDto) {
    const { pontos } = updateCoordinateDto;
    const coordinate = await this.coordinateModel.findById(id);
    if (!coordinate) {
      throw new NotFoundException('Conjunto de pontos não encontrado');
    }
    const novosIds = pontos.map(p => p.id);
    const novosIdsUnicos = new Set(novosIds);
    if (novosIds.length !== novosIdsUnicos.size) {
      throw new BadRequestException('IDs dos pontos devem ser únicos');
    }
    for (const novoPonto of pontos) {
      const indiceExistente = coordinate.pontos.findIndex(p => String(p.id) === String(novoPonto.id));
      if (indiceExistente >= 0) {
        coordinate.pontos[indiceExistente] = { ...novoPonto, id: String(novoPonto.id) };
      } else {
        coordinate.pontos.push({ ...novoPonto, id: String(novoPonto.id) });
      }
    }

    const updated = await coordinate.save();
    
    return {
      id: updated._id,
      pontos: updated.pontos,
      updatedAt: updated.updatedAt
    };
  }
}
