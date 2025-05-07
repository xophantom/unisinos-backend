import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TotemController } from '../controllers/totem.controller';
import { TotemService } from '../services/totem.service';
import { Course } from '../entities/course.entity';
import { Interaction } from '../entities/interaction.entity';
import { School } from '../entities/school.entity';
import { Profession } from '../entities/profession.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course, Interaction, School, Profession])],
  controllers: [TotemController],
  providers: [TotemService],
  exports: [TotemService],
})
export class TotemModule {}
