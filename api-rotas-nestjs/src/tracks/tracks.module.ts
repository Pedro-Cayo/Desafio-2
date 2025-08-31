import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { Track, TrackSchema } from './schema/track.schema';
import { CoordinatesModule } from '../coordinates/coordinates.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Track.name, schema: TrackSchema }]),
    CoordinatesModule,
  ],
  controllers: [TracksController],
  providers: [TracksService],
})
export class TracksModule {}