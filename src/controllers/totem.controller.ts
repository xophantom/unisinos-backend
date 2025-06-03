import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TotemService } from '../services/totem.service';
import { Course } from '../entities/course.entity';
import { ColorAnalysisDto } from 'src/domain/dtos/color-analysis.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ColorAnalysisResponseDto } from 'src/domain/dtos/color-analysis-response.dto';
import { RegisterInteractionDto } from 'src/domain/dtos/register-interaction.dto';
import { Interaction } from '../entities/interaction.entity';

@ApiTags('totem')
@Controller('totem')
@ApiBearerAuth()
export class TotemController {
  constructor(private readonly totemService: TotemService) {}

  @Get('courses')
  @ApiOperation({ summary: 'Lista todos os cursos' })
  @ApiResponse({ status: 200, type: [Course] })
  async listCourses(): Promise<Course[]> {
    return this.totemService.listCourses();
  }

  @Post(':totemId/analyze-colors')
  @ApiOperation({ summary: 'Analisa as cores selecionadas e retorna as escolas correspondentes' })
  @ApiResponse({ status: 201, type: ColorAnalysisResponseDto })
  async analyzeColors(
    @Param('totemId') totemId: string,
    @Body() data: ColorAnalysisDto,
  ): Promise<ColorAnalysisResponseDto> {
    return this.totemService.analyzeColors(totemId, data);
  }

  @Post(':totemId/register-interaction')
  @ApiOperation({ summary: 'Registra a interação final com as cores e cursos selecionados' })
  @ApiResponse({ status: 201, type: Interaction })
  async registerInteraction(
    @Param('totemId') totemId: string,
    @Body() data: RegisterInteractionDto,
  ): Promise<Interaction> {
    return this.totemService.registerFinalInteraction(totemId, data.selectedColors, data.courseIds);
  }
}
