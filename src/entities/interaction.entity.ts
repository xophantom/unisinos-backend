import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, CreateDateColumn, JoinTable, Relation } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Course } from './course.entity';

@Entity({ name: 'interactions' })
export class Interaction {
  @ApiProperty({ description: 'Unique identifier for the interaction' })
  @PrimaryGeneratedColumn({ name: 'interaction_id' })
  id: number;

  @ApiProperty({ description: 'Identificador do totem onde essa interação ocorreu' })
  @Column({ name: 'totem_id', length: 50 })
  totemId: string;

  @ApiProperty({ description: 'Cor selecionada pelo usuário' })
  @Column({ name: 'selected_color', length: 50 })
  selectedColor: string;

  @ApiProperty({ description: 'Data e hora em que a interação ocorreu' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ description: 'Cursos apresentados ao usuário nesta interação', type: [Course] })
  @ManyToMany(() => Course, (course) => course.interactions, { cascade: true })
  @JoinTable({
    name: 'interaction_courses',
    joinColumn: { name: 'interaction_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'course_id', referencedColumnName: 'id' },
  })
  courses: Relation<Course[]>;
}
