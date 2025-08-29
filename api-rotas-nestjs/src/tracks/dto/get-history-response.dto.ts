import { ApiProperty } from '@nestjs/swagger';

export class TrackHistoryDto {
  @ApiProperty({ description: 'ID da rota', type: String })
  trackId: string;

  @ApiProperty({ description: 'Ordem da rota', type: [Number] })
  trackOrder: number[];

  @ApiProperty({ description: 'ID das coordenadas originais', type: String })
  originalCoordsId: string;

  @ApiProperty({ description: 'Data de cálculo da rota', type: String, format: 'date-time' })
  trackDate: string;

  @ApiProperty({ description: 'Distância total da rota', type: Number })
  totalDistance: number;
}

export class GetHistoryResponseDto {
  @ApiProperty({ description: 'Lista de históricos de rotas', type: [TrackHistoryDto] })
  history: TrackHistoryDto[];

  @ApiProperty({ description: 'Total de resultados encontrados', type: Number })
  total: number;
}
