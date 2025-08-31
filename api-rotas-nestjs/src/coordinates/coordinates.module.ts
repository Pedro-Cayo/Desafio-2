import { Module } from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose'
import { CoordinatesService } from './coordinates.service';
import { CoordinatesController } from './coordinates.controller';
import {Coordinate, CoordinateSchema} from './schema/coordinate.schema'

@Module({
  imports: [
    MongooseModule.forFeature([{name: Coordinate.name , schema: CoordinateSchema}])
  ],
  controllers: [CoordinatesController],
  providers: [CoordinatesService],
  exports: [CoordinatesService, MongooseModule]
})
export class CoordinatesModule {}
