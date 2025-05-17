import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Course } from '../entities/course.entity';
import { Interaction } from '../entities/interaction.entity';
import { School } from '../entities/school.entity';
import { ColorAnalysisDto } from 'src/domain/dtos/color-analysis.dto';
import { ColorAnalysisResponseDto, SchoolAnalysis } from 'src/domain/dtos/color-analysis-response.dto';

@Injectable()
export class TotemService {
  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
    @InjectRepository(Interaction)
    private interactionsRepository: Repository<Interaction>,
    @InjectRepository(School)
    private schoolsRepository: Repository<School>,
  ) {}

  async listCourses(): Promise<Course[]> {
    return this.coursesRepository.find();
  }

  async createInteraction(totemId: string, selectedColors: string[], courseIds: number[]): Promise<Interaction> {
    const courses = await this.coursesRepository.findBy({ id: In(courseIds) });

    const interaction = this.interactionsRepository.create({
      totemId,
      selectedColor: selectedColors.join(','), // Armazena todas as cores selecionadas
      courses,
    });

    return this.interactionsRepository.save(interaction);
  }

  private findTiedColors(colorCount: Record<string, number>): string[] {
    const sortedColors = Object.entries(colorCount).sort((a, b) => b[1] - a[1]);

    if (sortedColors.length === 0) return [];

    const maxCount = sortedColors[0][1];
    return sortedColors.filter(([, count]) => count === maxCount).map(([color]) => color);
  }

  async analyzeColors(data: ColorAnalysisDto): Promise<ColorAnalysisResponseDto> {
    const colorCount = data.colors.reduce(
      (acc, color) => {
        acc[color] = (acc[color] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const totalPoints = Object.values(colorCount).reduce((sum, count) => sum + count, 0);
    const percentageDistribution = Object.entries(colorCount).reduce(
      (acc, [color, count]) => {
        acc[color] = (count / totalPoints) * 100;
        return acc;
      },
      {} as Record<string, number>,
    );

    const tiedColors = this.findTiedColors(colorCount);
    const hasTie = tiedColors.length > 1;

    const schoolsAnalysis: SchoolAnalysis[] = await Promise.all(
      tiedColors.map(async (color) => {
        const school = await this.schoolsRepository.findOne({
          where: { color },
          select: ['id', 'name', 'color', 'url', 'isActive'],
        });

        if (!school) {
          throw new Error(`Nenhuma escola encontrada para a cor ${color}`);
        }

        const courses = await this.coursesRepository.find({
          where: { school: { id: school.id } },
          relations: ['professions'],
        });

        return {
          school,
          colorCount: colorCount[color],
          percentage: percentageDistribution[color],
          courses,
        };
      }),
    );

    // Salva a interação com todas as cores empatadas
    await this.createInteraction(data.totemId, tiedColors, []);

    return {
      schools: schoolsAnalysis,
      colorDistribution: colorCount,
      percentageDistribution,
      hasTie,
    };
  }
}
