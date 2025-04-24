import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'ARMAZEM' })
export class Warehouse {
  @ApiProperty({ description: 'Id do armazém' })
  @PrimaryGeneratedColumn({ name: 'ArmazemId' })
  id: number;

  @ApiProperty({ description: 'Código do armazém' })
  @Index('INDEX_ARMAZEM_CODIGO')
  @Column({ name: 'Codigo', unique: true })
  code: number;

  @ApiProperty({ description: 'Nome do armazém' })
  @Column({ name: 'Nome', length: 255 })
  name: string;

  @ApiProperty({ description: 'CNPJ do armazém' })
  @Column({ name: 'CNPJ', length: 14, unique: true })
  cnpj: string;
}
