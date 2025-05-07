import { Controller, Get, Post, Body } from '@nestjs/common';
import { TotemService } from '../services/totem.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ColorAnalysisDto } from 'src/domain/dtos/color-analysis.dto';

@ApiTags('Totem')
@Controller('totem')
@ApiBearerAuth()
export class TotemController {
  constructor(private readonly totemService: TotemService) {}

  @Get('courses')
  @ApiOperation({ summary: 'Listar todos os cursos' })
  @ApiResponse({ status: 200, description: 'Lista de cursos retornada com sucesso' })
  async listCourses() {
    return this.totemService.listCourses();
  }

  @Post('interactions')
  @ApiOperation({ summary: 'Criar uma nova interação' })
  @ApiResponse({ status: 201, description: 'Interação criada com sucesso' })
  async createInteraction(@Body() body: { totemId: string; selectedColor: string; courseIds: number[] }) {
    const { totemId, selectedColor, courseIds } = body;
    return this.totemService.createInteraction(totemId, selectedColor, courseIds);
  }

  @Post('analyze-colors')
  @ApiOperation({ summary: 'Analisar as cores selecionadas e determinar a escola de interesse' })
  @ApiResponse({ status: 200, description: 'Análise concluída com sucesso' })
  async analyzeColors(@Body() data: ColorAnalysisDto) {
    return this.totemService.analyzeColors(data);
  }
}
