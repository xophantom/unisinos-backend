import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'DEVOLUCAO' })
export class Devolution {
  @ApiProperty({ description: 'Id da devolução' })
  @PrimaryGeneratedColumn({ name: 'DevolucaoId' })
  id: number;

  @Column({ name: 'Nfe', unique: true })
  nfe: string;

  @ApiProperty({ description: 'Id do armazém' })
  @Column({ name: 'ArmazemId' })
  warehouse: number;

  @ApiProperty({ description: 'Documento da loja' })
  @Column({ name: 'LojaDocumento' })
  customerCGC: string;

  @ApiProperty({ description: 'Id da loja' })
  @Column({ name: 'LojaId' })
  store: number;

  @ApiProperty({ description: 'Data de devolução' })
  @Column({ name: 'DataDevolucao', type: 'datetime' })
  devolutionDate: Date;

  @ApiProperty({ description: 'Tipo do Consignado' })
  @Column({ name: 'TipoConsignado' })
  consignmentType: string;

  @ApiProperty({ description: 'Data da Emissão' })
  @Column({ name: 'DataEmissao' })
  invoiceEmission: Date;
}
