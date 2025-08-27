import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoordinatesModule } from './coordinates/coordinates.module';
import { TracksModule } from './tracks/tracks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule], 
      useFactory: async (ConfigService: ConfigService) => ({
        uri: ConfigService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    CoordinatesModule,
    TracksModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
