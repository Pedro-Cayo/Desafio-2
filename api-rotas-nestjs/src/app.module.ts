import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';

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
      useFactory: async (configService: ConfigService) => ({
      uri: configService.get<string>('DATABASE_URL'),
      }),
    inject: [ConfigService],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ([{
        ttl: +configService.get<number>('THROTTLE_TTL', 60),
        limit: +configService.get<number>('THROTTLE_LIMIT', 100),
      }]),
    }),
    CoordinatesModule,
    TracksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
