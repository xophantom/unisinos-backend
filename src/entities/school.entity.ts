import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Course } from './course.entity';

@Entity('schools')
export class School {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  color: string;

  @Column()
  url: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Course, (course) => course.school)
  courses: Course[];
}
