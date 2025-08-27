import { PartialType } from '@nestjs/mapped-types';
import { CreateCoordinateDto } from './create-coordinate.dto';

export class UpdateCoordinateDto extends PartialType(CreateCoordinateDto) {}
