import { Test, TestingModule } from '@nestjs/testing';
import { CoordinatesService } from './coordinates.service';
import { getModelToken } from '@nestjs/mongoose';

describe('CoordinatesService', () => {
  let service: CoordinatesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoordinatesService,
        {
          provide: getModelToken('Coordinate'),
          useValue: { // Mock seu CoordinateModel aqui
            new: jest.fn().mockResolvedValue({}),
            constructor: jest.fn().mockResolvedValue({}),
            find: jest.fn(),
            findOne: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            findByIdAndDelete: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CoordinatesService>(CoordinatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});