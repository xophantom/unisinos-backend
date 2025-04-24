import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../entities/course.entity';
import { Interaction } from '../entities/interaction.entity';

@Injectable()
export class TotemService {
  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
    @InjectRepository(Interaction)
    private interactionsRepository: Repository<Interaction>,
  ) {}

  async listCourses(): Promise<Course[]> {
    return this.coursesRepository.find();
  }

  async createInteraction(totemId: string, selectedColor: string, courseIds: number[]): Promise<Interaction> {
    const courses = await this.coursesRepository.findByIds(courseIds);

    const interaction = this.interactionsRepository.create({
      totemId,
      selectedColor,
      courses,
    });

    return this.interactionsRepository.save(interaction);
  }
}
