import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  Relation,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Interaction } from './interaction.entity';
import { School } from './school.entity';
import { Profession } from './profession.entity';

@Entity({ name: 'courses' })
export class Course {
  @ApiProperty({ description: 'Identificador único para o curso' })
  @PrimaryGeneratedColumn({ name: 'course_id' })
  id: number;

  @ApiProperty({ description: 'Nome do curso' })
  @Column({ name: 'name', length: 100 })
  name: string;

  @ApiProperty({ description: 'Descrição curta do curso' })
  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string;

  @ManyToOne(() => School, (school) => school.courses)
  @JoinColumn({ name: 'school_id' })
  school: School;

  @OneToMany(() => Profession, (profession) => profession.course)
  professions: Profession[];

  @ManyToMany(() => Interaction, (interaction) => interaction.courses)
  interactions: Relation<Interaction[]>;
}
