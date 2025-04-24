import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Warehouse } from '@/entities/warehouse.entity';

@Entity({ name: 'IMPRESSORA' })
export class Printer {
  @ApiProperty({ description: 'Id da impressora' })
  @PrimaryGeneratedColumn({ name: 'ImpressoraId' })
  id: number;

  @ApiHideProperty()
  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'ArmazemId' })
  warehouse: Warehouse;

  @ApiProperty({ description: 'Descrição da impressora' })
  @Column({ name: 'Descricao', length: 255 })
  description: string;

  @ApiProperty({ description: 'Endereço IP da impressora' })
  @Column({ name: 'IP', length: 15 })
  ip: string;

  @ApiProperty({ description: 'Porta IP da impressora' })
  @Column({ name: 'Porta' })
  port: number;

  @ApiProperty({ description: 'Status' })
  @Column({ name: 'Ativo', default: true })
  isActive?: boolean;
}
