import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CoordinatesService } from './coordinates.service';
import { CreateCoordinateDto } from './dto/create-coordinate.dto';
import { UpdateCoordinateDto } from './dto/update-coordinate.dto';

@Controller('coordinates')
export class CoordinatesController {
  constructor(private readonly coordinatesService: CoordinatesService) {}

  @Post()
  create(@Body() createCoordinateDto: CreateCoordinateDto) {
    return this.coordinatesService.create(createCoordinateDto);
  }

  @Get()
  findAll() {
    return this.coordinatesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coordinatesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoordinateDto: UpdateCoordinateDto) {
    return this.coordinatesService.update(+id, updateCoordinateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coordinatesService.remove(+id);
  }
}
