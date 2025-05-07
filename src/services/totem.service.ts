import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Course } from '../entities/course.entity';
import { Interaction } from '../entities/interaction.entity';
import { School } from '../entities/school.entity';
import { ColorAnalysisDto } from 'src/domain/dtos/color-analysis.dto';

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

  async createInteraction(totemId: string, selectedColor: string, courseIds: number[]): Promise<Interaction> {
    const courses = await this.coursesRepository.findBy({ id: In(courseIds) });

    const interaction = this.interactionsRepository.create({
      totemId,
      selectedColor,
      courses,
    });

    return this.interactionsRepository.save(interaction);
  }

  async analyzeColors(data: ColorAnalysisDto): Promise<{
    school: School;
    colorCount: number;
    courses: Course[];
  }> {
    const colorCount = data.colors.reduce(
      (acc, color) => {
        acc[color] = (acc[color] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const mostFrequentColor = Object.entries(colorCount).sort((a, b) => b[1] - a[1])[0][0];

    const school = await this.schoolsRepository.findOne({
      where: { color: mostFrequentColor },
      select: ['id', 'name', 'color', 'url', 'isActive'],
    });

    if (!school) {
      throw new Error(`Nenhuma escola encontrada para a cor ${mostFrequentColor}`);
    }

    const courses = await this.coursesRepository.find({
      where: { school: { id: school.id } },
      relations: ['professions'],
    });

    await this.createInteraction(data.totemId, mostFrequentColor, []);

    return {
      school,
      colorCount: colorCount[mostFrequentColor],
      courses,
    };
  }
}
