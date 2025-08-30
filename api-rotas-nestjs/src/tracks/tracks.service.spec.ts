import { Test, TestingModule } from '@nestjs/testing';
import { TracksService } from './tracks.service';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Track } from './entities/track.entity';
import { Coordinate } from '../coordinates/entities/coordinate.entity';
import { Model } from 'mongoose';

describe('TracksService', () => {
  let service: TracksService;
  let trackModel: Model<any>;
  let coordinateModel: Model<any>;

  const mockTrack = {
    _id: { toString: () => 'mockTrackId' },
    pontosId: 'mockCoordsId',
    ordem: [1, 2, 3],
    distanciaTotal: 10,
    dataCalculo: new Date()
  };

  const mockTrackModel = {
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndDelete: jest.fn(),
    countDocuments: jest.fn(),
    find: jest.fn(() => ({
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([mockTrack]),
    })),
    create: jest.fn().mockResolvedValue(mockTrack),
  };
  
  const mockCoordinateModel = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TracksService,
        {
          provide: getModelToken(Track.name),
          useValue: mockTrackModel,
        },
        {
          provide: getModelToken(Coordinate.name),
          useValue: mockCoordinateModel,
        },
      ],
    }).compile();

    service = module.get<TracksService>(TracksService);
    trackModel = module.get<Model<any>>(getModelToken(Track.name));
    coordinateModel = module.get<Model<any>>(getModelToken(Coordinate.name));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateTrack', () => {
    it('should successfully calculate and save the track', async () => {
      const mockCoords = {
        pontos: [
          { id: 1, x: 0, y: 0 },
          { id: 2, x: 3, y: 4 }
        ],
        save: jest.fn()
      };
      jest.spyOn(coordinateModel, 'findById').mockResolvedValue(mockCoords);
      jest.spyOn(trackModel, 'findOne').mockResolvedValue(null);
      
      const result = await service.calculateTrack('mockId');
      expect(trackModel.create).toHaveBeenCalled();
      expect(result).toHaveProperty('trackId');
      expect(result.trackOrder.length).toBeGreaterThan(0);
    });

    it('should throw NotFoundException if the coordinates arent found', async () => {
      jest.spyOn(coordinateModel, 'findById').mockResolvedValue(null);
      await expect(service.calculateTrack('nonExistentId')).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException if the track already exist for the ID of coordinates', async () => {
      jest.spyOn(coordinateModel, 'findById').mockResolvedValue({ pontos: [] });
      jest.spyOn(trackModel, 'findOne').mockResolvedValue({});
      await expect(service.calculateTrack('existingId')).rejects.toThrow(ConflictException);
    });
  });

  describe('getHistory', () => {
    it('should return the history of tracks with pagination', async () => {
      const mockTracks = [{
        _id: { toString: () => 'track1' },
        pontosId: 'coords1',
        ordem: ['1', '2'],
        distanciaTotal: 5,
        dataCalculo: new Date()
      }];
      
      const findMock = {
          sort: () => findMock,
          skip: () => findMock,
          limit: () => findMock,
          exec: () => Promise.resolve(mockTracks),
      };
      
      jest.spyOn(trackModel, 'find').mockReturnValue(findMock as any);
      jest.spyOn(trackModel, 'countDocuments').mockResolvedValue(1);

      const result = await service.getHistory(10, 0);
      expect(result.history).toHaveLength(mockTracks.length);
      expect(result.total).toBe(1);
    });

    it('should return a empty array if there is no tracks', async () => {
      const findMock = {
        sort: () => findMock,
        skip: () => findMock,
        limit: () => findMock,
        exec: () => Promise.resolve([]),
      };
      jest.spyOn(trackModel, 'find').mockReturnValue(findMock as any);
      jest.spyOn(trackModel, 'countDocuments').mockResolvedValue(0);

      const result = await service.getHistory();
      expect(result.history).toHaveLength(0);
      expect(result.total).toBe(0);
    });
  });

  describe('deleteTrack', () => {
    it('should delete a track successfully', async () => {
      jest.spyOn(trackModel, 'findById').mockResolvedValue({ _id: 'mockId' });
      jest.spyOn(trackModel, 'findByIdAndDelete').mockResolvedValue({});
      const result = await service.deleteTrack('mockId');
      expect(trackModel.findByIdAndDelete).toHaveBeenCalledWith('mockId');
      expect(result).toEqual({ message: 'Rota deletada com sucesso' });
    });
    
    it('should throw NotFoundException if the track wasnt found', async () => {
      jest.spyOn(trackModel, 'findById').mockResolvedValue(null);
      await expect(service.deleteTrack('nonExistentId')).rejects.toThrow(NotFoundException);
    });
  });
});
