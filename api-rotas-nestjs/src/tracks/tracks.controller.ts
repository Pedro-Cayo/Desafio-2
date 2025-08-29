import { Controller, Get, Param, Delete, Query} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery} from '@nestjs/swagger';
import { TracksService } from './tracks.service';

@ApiTags('tracks')
@Controller('tracks')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Get('history')
  @ApiOperation({ summary: 'Obter histórico de rotas calculadas' })
  @ApiResponse({ status: 200, description: 'Histórico obtido com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limite de resultados' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Offset para paginação' })
  getHistory(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number
  ) {
    return this.tracksService.getHistory(limit, offset);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Calcular rota otimizada para conjunto de pontos' })
  @ApiResponse({ status: 200, description: 'Rota calculada com sucesso' })
  @ApiResponse({ status: 404, description: 'Conjunto de pontos não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  calculateTrack(@Param('id') id: string) {
    return this.tracksService.calculateTrack(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletar rota calculada' })
  @ApiResponse({ status: 204, description: 'Rota deletada com sucesso' })
  @ApiResponse({ status: 404, description: 'Rota não encontrada' })
  deleteTrack(@Param('id') id: string) {
    return this.tracksService.deleteTrack(id);
  }
}
