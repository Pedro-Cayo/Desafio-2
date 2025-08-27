import {Type} from 'class-transformer'
import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

class CoordinateDto {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsNumber()
    x: number

    @IsNumber()
    y: number
}

export class CreateCoordinateDto {
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => CoordinateDto)
    coordinate: CoordinateDto[];
}
