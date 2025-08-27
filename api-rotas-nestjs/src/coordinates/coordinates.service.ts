import { Injectable } from '@nestjs/common';
import { CreateCoordinateDto } from './dto/create-coordinate.dto';
import { UpdateCoordinateDto } from './dto/update-coordinate.dto';

@Injectable()
export class CoordinatesService {
  create(createCoordinateDto: CreateCoordinateDto) {
    return 'This action adds a new coordinate';
  }

  findAll() {
    return `This action returns all coordinates`;
  }

  findOne(id: number) {
    return `This action returns a #${id} coordinate`;
  }

  update(id: number, updateCoordinateDto: UpdateCoordinateDto) {
    return `This action updates a #${id} coordinate`;
  }

  remove(id: number) {
    return `This action removes a #${id} coordinate`;
  }
}
