import { Controller, Get, Param, Delete, UseGuards, HttpCode, HttpStatus ,Query, ValidationPipe} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { GetHistoryRequestDto } from './dto/get-history-request.dto';
import { GetHistoryResponseDto } from './dto/get-history-response.dto';
import { TracksService } from './tracks.service';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('tracks')
@Controller('tracks')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Get('history')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Obter histórico de rotas calculadas' })
  @ApiResponse({ status: 200, description: 'Histórico obtido com sucesso', type: GetHistoryResponseDto, isArray: true, })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 429, description: 'Muitas requisições' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Limite de resultados' })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Offset para paginação' })
  async getHistory(
    @Query(new ValidationPipe({ transform: true })) query: GetHistoryRequestDto
  ): Promise<GetHistoryResponseDto> {
    return this.tracksService.getHistory(query.limit, query.offset);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Throttle({ default: { limit: 10, ttl: 60000 } }) 
  @ApiOperation({ summary: 'Calcular rota otimizada para conjunto de pontos' })
  @ApiResponse({ status: 200, description: 'Rota calculada com sucesso' })
  @ApiResponse({ status: 404, description: 'Conjunto de pontos não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 429, description: 'Muitas requisições' })
  calculateTrack(@Param('id') id: string) {
    return this.tracksService.calculateTrack(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar rota calculada' })
  @ApiResponse({ status: 204, description: 'Rota deletada com sucesso' })
  @ApiResponse({ status: 404, description: 'Rota não encontrada' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  deleteTrack(@Param('id') id: string) {
    return this.tracksService.deleteTrack(id);
  }
}
