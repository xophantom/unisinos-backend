import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Warehouse } from './warehouse.entity';
import { IsOptional } from 'class-validator';

@Entity({ name: 'LOTE_IMPRESSAO' })
export class PrintLot {
  @ApiProperty({ description: 'Id do lote de impressão' })
  @PrimaryGeneratedColumn({ name: 'LoteImpressaoId', type: 'int' })
  id: number;

  @ApiProperty({ description: 'Nome do lote de impressão' })
  @Column({ name: 'Nome', length: 255 })
  name: string;

  @ApiProperty({ description: 'Quantidade de etiquetas solicitadas' })
  @Column('int', { name: 'Quantidade' })
  amount: number;

  @ApiProperty({ description: 'Data e hora em que o lote de impressão foi gerado' })
  @Column({ name: 'DataGeracao', type: 'datetime' })
  generationDate: Date;

  @ApiProperty({ description: 'Armazém que foi gerado a etiqueta' })
  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'ArmazemId' })
  @IsOptional()
  warehouse?: Warehouse;
}
