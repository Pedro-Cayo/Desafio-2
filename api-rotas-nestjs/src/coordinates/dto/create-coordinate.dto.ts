import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PontoDeEntregaDto {
    @ApiProperty({ description: 'Identificador único do ponto', example: 1 })
    @IsNumber()
    @IsNotEmpty()
    id: number;

    @ApiProperty({ description: 'Coordenada X do ponto', example: 10 })
    @IsNumber()
    x: number;

    @ApiProperty({ description: 'Coordenada Y do ponto', example: 20 })
    @IsNumber()
    y: number;
}

export class CreateCoordinateDto {
    @ApiProperty({ 
        description: 'Array de pontos de entrega',
        type: [PontoDeEntregaDto],
        example: [
            { id: 1, x: 10, y: 20 },
            { id: 2, x: 15, y: 25 }
        ]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PontoDeEntregaDto)
    pontos: PontoDeEntregaDto[];
}