import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, Relation } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Interaction } from './interaction.entity';

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

  @ManyToMany(() => Interaction, (interaction) => interaction.courses)
  interactions: Relation<Interaction[]>;
}
