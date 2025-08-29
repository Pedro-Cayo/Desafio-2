import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DeliveryPointsDto } from './create-coordinate.dto';

export class UpdateCoordinateDto {
    @ApiProperty({ 
        description: 'Array de pontos de entrega para atualizar ou adicionar',
        type: [DeliveryPointsDto],
        example: [
            { id: 1, x: 12, y: 22 },
            { id: 3, x: 18, y: 30 }
        ]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => DeliveryPointsDto)
    pontos: DeliveryPointsDto[];
}