import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'users' })
export class User {
  @ApiProperty({ description: 'Identificador único do usuário' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Nome do usuário' })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({ description: 'Email do usuário' })
  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ length: 100 })
  password: string;

  @ApiProperty({ description: 'Data de criação do usuário' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Data da última atualização do usuário' })
  @UpdateDateColumn()
  updatedAt: Date;
}
