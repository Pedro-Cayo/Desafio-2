import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { AuthGuard } from '../src/auth/auth.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { JwtService } from '@nestjs/jwt';

class MockAuthGuard {
  canActivate() {
    return true;
  }
}

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard)
      .useClass(MockAuthGuard)
      .overrideModule(MongooseModule) 
      .useModule({
        module: MongooseModule,
        imports: [
          MongooseModule.forRoot(mongoUri),
        ],
        providers: [JwtService], // Adiciona JwtService para evitar erros de dependência
        exports: [MongooseModule],
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await mongoServer.stop();
  });

  describe('CoordinatesController (/coordinates)', () => {
    const createDto = {
      pontos: [{ id: 1, x: 10, y: 20 }, { id: 2, x: 15, y: 25 }],
    };
    
    it('POST / deve criar um novo conjunto de pontos', async () => {
      const response = await request(app.getHttpServer())
        .post('/coordinates')
        .send(createDto)
        .expect(201);
      
      expect(response.body).toHaveProperty('id');
      expect(response.body.pontos).toEqual(expect.arrayContaining(createDto.pontos.map(p => expect.objectContaining(p))));
    });

    it('GET /:id deve retornar um conjunto de pontos existente', async () => {
      const postResponse = await request(app.getHttpServer())
        .post('/coordinates')
        .send(createDto);
      
      const id = postResponse.body.id;
      
      const getResponse = await request(app.getHttpServer())
        .get(`/coordinates/${id}`)
        .expect(200);

      expect(getResponse.body).toHaveProperty('id', id);
      expect(getResponse.body).toHaveProperty('pontos');
    });

    it('PATCH /:id deve atualizar um conjunto de pontos', async () => {
      const postResponse = await request(app.getHttpServer())
        .post('/coordinates')
        .send(createDto);
      
      const id = postResponse.body.id;
      const updateDto = {
        pontos: [{ id: 1, x: 30, y: 40 }],
      };
      
      const patchResponse = await request(app.getHttpServer())
        .patch(`/coordinates/${id}`)
        .send(updateDto)
        .expect(200);
      
      expect(patchResponse.body.pontos).toContainEqual(expect.objectContaining({ id: 1, x: 30, y: 40 }));
    });
  });

  describe('TracksController (/tracks)', () => {
    let coordinateId: string;

    beforeEach(async () => {
      const coordResponse = await request(app.getHttpServer())
        .post('/coordinates')
        .send({
          pontos: [{ id: 1, x: 10, y: 10 }, { id: 2, x: 20, y: 20 }],
        });
      coordinateId = coordResponse.body.id;
    });

    it('GET /:id deve calcular a rota otimizada', async () => {
      const response = await request(app.getHttpServer())
        .get(`/tracks/${coordinateId}`)
        .expect(200);
      
      expect(response.body).toHaveProperty('trackId');
      expect(response.body).toHaveProperty('trackOrder');
      expect(response.body.trackOrder.length).toBeGreaterThan(0);
    });

    it('GET /history deve retornar o histórico de rotas', async () => {
      await request(app.getHttpServer()).get(`/tracks/${coordinateId}`);
      
      const response = await request(app.getHttpServer())
        .get('/tracks/history')
        .expect(200);

      expect(response.body).toHaveProperty('history');
      expect(response.body.history.length).toBeGreaterThan(0);
    });

    it('DELETE /:id deve deletar uma rota existente', async () => {
      const calculateResponse = await request(app.getHttpServer())
        .get(`/tracks/${coordinateId}`);
      const trackId = calculateResponse.body.trackId;
      
      await request(app.getHttpServer())
        .delete(`/tracks/${trackId}`)
        .expect(200);
        
      await request(app.getHttpServer())
        .get(`/tracks/${trackId}`)
        .expect(404);
    });
  });
});
