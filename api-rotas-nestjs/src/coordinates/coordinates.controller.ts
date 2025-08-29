import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse} from '@nestjs/swagger';
import { CoordinatesService } from './coordinates.service';
import { CreateCoordinateDto } from './dto/create-coordinate.dto';
import { UpdateCoordinateDto } from './dto/update-coordinate.dto';

@ApiTags('coordinates')
@Controller('coordinates')
export class CoordinatesController {
  constructor(private readonly coordinatesService: CoordinatesService) {}

  @Post()
  @ApiOperation({ summary: 'Criação de coordenadas de pontos de entrega' })
  @ApiResponse({ status: 201, description: 'Coordenadas criadas com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  create(@Body() createCoordinateDto: CreateCoordinateDto) {
    return this.coordinatesService.create(createCoordinateDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar pontos de entrega por ID' })
  @ApiResponse({ status: 200, description: 'Pontos encontrados' })
  @ApiResponse({ status: 404, description: 'Pontos não encontrados' })
  findOne(@Param('id') id: string) {
    return this.coordinatesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar ou adicionar coordenadas ao conjunto de pontos existente' })
  @ApiResponse({ status: 200, description: 'Pontos atualizados com sucesso' })
  @ApiResponse({ status: 404, description: 'Conjunto de pontos não encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  update(@Param('id') id: string, @Body() updateCoordinateDto: UpdateCoordinateDto) {
    return this.coordinatesService.update(id, updateCoordinateDto);
  }
}
