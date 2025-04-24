import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Antenna } from './antenna.entity';
import { Client } from './client.entity';
import { EDocumentType } from '../domain';

@Unique('UQ_LOJA_CODIGO', ['id', 'code'])
@Index('INDEX_LOJA_CODIGO', ['id', 'code'])
@Entity({ name: 'LOJA' })
export class Store {
  @ApiProperty({ description: 'Id da loja' })
  @PrimaryGeneratedColumn({ name: 'LojaId' })
  id: number;

  @ApiProperty({ description: 'Código da loja' })
  @Column({ name: 'Codigo' })
  code: number;

  @ApiProperty({ description: 'Documento da loja' })
  @Column({ name: 'Documento', length: 14 })
  document: string;

  @ApiProperty({
    description: 'Tipo do documento da loja',
    enum: Object.values(EDocumentType).map((value) => value.toString()),
  })
  @Column({ name: 'TipoDocumento', length: 4 })
  documentType: EDocumentType;

  @Column({ name: 'Endereco', length: 100 })
  address: string;

  @Column({ name: 'CEP', length: 100 })
  cep: string;

  @Column({ name: 'Classe', length: 100 })
  class: string;

  @Column({ name: 'ClasseDescricao', length: 100 })
  classDescription: string;

  @ApiProperty({ description: 'Município da loja' })
  @Column({ name: 'Municipio', length: 100 })
  city: string;

  @ApiProperty({ description: 'UF da loja' })
  @Column({ name: 'UF', length: 2 })
  state: string;

  @ApiProperty({ description: 'Status' })
  @Column({ name: 'Ativo', default: true })
  isActive?: boolean;

  @ApiProperty({ description: 'Tipo da loja' })
  @Column({ name: 'Online', default: false })
  isOnline?: boolean;

  @ApiHideProperty()
  @ManyToOne(() => Client)
  @JoinColumn({ name: 'ClienteId' })
  client: Client;

  @ApiHideProperty()
  @OneToMany(() => Antenna, (antenna) => antenna.store)
  @JoinColumn()
  antennas: Antenna[];

  @Column({ name: 'ListaPreco' })
  priceList: string;
}
