import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('API_LOGS')
export class ApiLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  endpoint: string;

  @Column('text')
  request: string;

  @Column('text')
  response: string;

  @CreateDateColumn()
  createdAt: Date;
}
