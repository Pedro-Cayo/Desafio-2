import { Test, TestingModule } from '@nestjs/testing';
import { CoordinatesService } from './coordinates.service';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Coordinate } from './schema/coordinate.schema';
import { CreateCoordinateDto } from './dto/create-coordinate.dto';
import { UpdateCoordinateDto } from './dto/update-coordinate.dto';
import { Model } from 'mongoose';

describe('CoordinatesService', () => {
  let service: CoordinatesService;
  let model: Model<any>;

  const mockCoordinateModel = {
    findById: jest.fn(),
    create: jest.fn(),
  };

  const mockCoordinate = {
    _id: 'mockId',
    pontos: [{ id: 1, x: 10, y: 20 }],
    createdAt: new Date(),
    updatedAt: new Date(),
    save: jest.fn().mockResolvedValue({
      _id: 'mockId',
      pontos: [{ id: 1, x: 10, y: 20 }],
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  };

  const mockModelClass = jest.fn().mockImplementation(() => {
    return mockCoordinate;
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoordinatesService,
        {
          provide: getModelToken(Coordinate.name),
          useValue: {
            ...mockCoordinateModel,
            constructor: mockModelClass,
          },
        },
      ],
    }).compile();

    service = module.get<CoordinatesService>(CoordinatesService);
    model = module.get<Model<any>>(getModelToken(Coordinate.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
  it('should successfully create a new set of coordinates', async () => {
    const createDto: CreateCoordinateDto = {
      pontos: [
        { id: 1, x: 10, y: 20 },
        { id: 2, x: 15, y: 25 },
      ],
    };

    const mockSavedCoordinate = {
      _id: 'mockId',
      pontos: createDto.pontos,
      createdAt: new Date(),
    };

    mockCoordinateModel.create.mockResolvedValue(mockSavedCoordinate);

    const result = await service.create(createDto);

    expect(model.create).toHaveBeenCalledWith({ pontos: createDto.pontos });

    expect(result).toEqual({
      id: mockSavedCoordinate._id,
      pontos: mockSavedCoordinate.pontos,
      createdAt: mockSavedCoordinate.createdAt,
    });
  });

    it('should throw a BadRequestException error if the set have less than 2 coordinates', async () => {
      const createDto: CreateCoordinateDto = {
        pontos: [{ id: 1, x: 10, y: 20 }]
      };
      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw a BadRequestException error if the coordinates IDs arent unique', async () => {
      const createDto: CreateCoordinateDto = {
        pontos: [
          { id: 1, x: 10, y: 20 },
          { id: 1, x: 15, y: 25 }
        ]
      };
      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findOne', () => {
    it('should found a set of coordinates per ID', async () => {
      const mockCoordinate = {
        _id: 'mockId',
        pontos: [{ id: '1', x: 10, y: 20 }],
        createdAt: new Date(),
      };
      jest.spyOn(model, 'findById').mockResolvedValue(mockCoordinate as any);

      const result = await service.findOne('mockId');
      expect(result).toEqual({
        id: 'mockId',
        pontos: mockCoordinate.pontos,
        createdAt: mockCoordinate.createdAt,
      });
    });

    it('shoulde throw a NotFoundException error if the ID wasnt found', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(null);
      await expect(service.findOne('nonExistentId')).rejects.toThrow(NotFoundException);
    });
    
    it('should throw a NotFoundException error if the ID is invalid (format)', async () => {
      jest.spyOn(model, 'findById').mockRejectedValue(new Error());
      await expect(service.findOne('invalidIdFormat')).rejects.toThrow(NotFoundException);
    });
  });
  
  describe('update', () => {
    it('should successfully update a set of coordinates', async () => {
      const existingCoordinate = {
        _id: 'mockId',
        pontos: [{ id: '1', x: 10, y: 20 }],
        save: jest.fn().mockResolvedValue({
          _id: 'mockId',
          pontos: [{ id: '1', x: 12, y: 22 }],
          updatedAt: new Date()
        })
      };
      
      jest.spyOn(model, 'findById').mockResolvedValue(existingCoordinate as any);

      const updateDto: UpdateCoordinateDto = {
        pontos: [{ id: 1, x: 12, y: 22 }]
      };
      
      const result = await service.update('mockId', updateDto);
      expect(existingCoordinate.save).toHaveBeenCalled();
      expect(result.pontos).toEqual([{ id: '1', x: 12, y: 22 }]);
    });

    it('should throw a NotFoundException error if the set of coordinates arent found', async () => {
      jest.spyOn(model, 'findById').mockResolvedValue(null);
      const updateDto: UpdateCoordinateDto = { pontos: [{ id: 1, x: 12, y: 22 }] };
      await expect(service.update('nonExistentId', updateDto)).rejects.toThrow(NotFoundException);
    });

    it('should add new coordinates if the IDs dont exist', async () => {
      const existingCoordinate = {
        _id: 'mockId',
        pontos: [{ id: '1', x: 10, y: 20 }],
        save: jest.fn().mockResolvedValue({
          _id: 'mockId',
          pontos: [{ id: '1', x: 10, y: 20 }, { id: '2', x: 30, y: 40 }],
          updatedAt: new Date()
        })
      };
      jest.spyOn(model, 'findById').mockResolvedValue(existingCoordinate as any);
      
      const updateDto: UpdateCoordinateDto = { pontos: [{ id: 2, x: 30, y: 40 }] };
      const result = await service.update('mockId', updateDto);
      expect(existingCoordinate.pontos).toHaveLength(2);
      expect(result.pontos).toEqual([{ id: '1', x: 10, y: 20 }, { id: '2', x: 30, y: 40 }]);
    });

    it('should throw a BadRequestException error if the IDs of the coordinates to be updated arent unique', async () => {
      const existingCoordinate = {
        _id: 'mockId',
        pontos: [{ id: '1', x: 10, y: 20 }],
        save: jest.fn()
      };
      jest.spyOn(model, 'findById').mockResolvedValue(existingCoordinate as any);
      const updateDto: UpdateCoordinateDto = {
        pontos: [
          { id: 2, x: 30, y: 40 },
          { id: 2, x: 50, y: 60 }
        ]
      };
      await expect(service.update('mockId', updateDto)).rejects.toThrow(BadRequestException);
    });
  });
});