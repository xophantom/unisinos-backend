import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Course } from './course.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('schools')
export class School {
  @ApiProperty({ description: 'Identificador único da escola' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Nome da escola' })
  @Column()
  name: string;

  @ApiProperty({ description: 'Cor associada à escola' })
  @Column()
  color: string;

  @ApiProperty({ description: 'URL da página da escola' })
  @Column()
  url: string;

  @ApiProperty({ description: 'Qualidade principal da escola (ex: "Defender e argumentar" para Direito)' })
  @Column({ name: 'quality' })
  quality: string;

  @ApiProperty({ description: 'Indica se a escola está ativa' })
  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Course, (course) => course.school)
  courses: Course[];
}
