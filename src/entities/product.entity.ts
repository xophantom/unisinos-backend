import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { EProductType, EProductUnit } from '../domain';

@Entity({ name: 'PRODUTO' })
export class Product {
  @ApiProperty({ description: 'Id do produto' })
  @PrimaryGeneratedColumn({ name: 'ProdutoId' })
  id: number;

  @ApiProperty({ description: 'Código do produto' })
  @Index('INDEX_PRODUTO_CODIGO')
  @Column({ name: 'Codigo', unique: true })
  code: number;

  @ApiProperty({ description: 'Descrição do produto' })
  @Index('INDEX_PRODUTO_DESCRICAO')
  @Column({ name: 'Descricao', length: 1000 })
  description: string;

  @ApiProperty({ description: 'Classe do produto' })
  @Column({ name: 'Classe', length: 1000 })
  class: string;

  @ApiProperty({ description: 'Classe Descrição do produto' })
  @Column({ name: 'ClasseDescricao', length: 1000 })
  classDescription: string;

  @ApiProperty({ description: 'Complemento do produto' })
  @Column({ name: 'Complemento', length: 255, nullable: true })
  complement?: string;

  @ApiProperty({
    description: 'Tipo de produto',
  })
  @Column({ type: String, name: 'Tipo', length: 2 })
  type: EProductType;

  @ApiPropertyOptional({
    description: 'Tipo de unidade do produto',
  })
  @Column({ type: String, name: 'Unidade', length: 2, nullable: true })
  unit?: EProductUnit;

  @ApiPropertyOptional({ description: 'Nome do fabricante' })
  @Column({ name: 'Fabricante', length: 255, nullable: true })
  manufacturer?: string;

  @ApiProperty({
    description: 'Indica se o produto está consignado',
    enum: [0, 1],
  })
  @Column({ name: 'Consignado', default: 1 })
  isConsigned: 0 | 1;

  @ApiProperty({ description: 'Nº do Registro ANVISA' })
  @Column({ name: 'RegistroAnvisa', length: 100, nullable: true })
  anvisaRegistry?: string;

  @ApiProperty({ description: 'Data início de vigência ANVISA' })
  @Column({ name: 'DataInicioVigenciaAnvisa', nullable: true })
  anvisaVigencyStartDate?: Date;

  @ApiProperty({ description: 'Classificação do produto' })
  @Column({ name: 'Classificacao', length: 255, nullable: true })
  classification?: string;

  @ApiProperty({ description: 'Especialidade do produto' })
  @Column({ name: 'Especialidade', length: 255, nullable: true })
  speciality?: string;

  @ApiProperty({ description: 'Referência de tamanho e/ou modelo do produto' })
  @Column({ name: 'ReferenciaTamanhoModelo', length: 255, nullable: true })
  modelSizeReference?: string;

  @ApiProperty({ description: 'Código TISS' })
  @Column({ name: 'CodigoTiss', nullable: true })
  tissCode?: number;

  @ApiProperty({ description: 'Nome comercial' })
  @Column({ name: 'NomeComercial', length: 255, nullable: true })
  comercialName?: string;

  @ApiProperty({ description: 'Nome técnico' })
  @Column({ name: 'NomeTecnico', length: 255, nullable: true })
  technicalName?: string;

  @ApiProperty({ description: 'Status' })
  @Column({ name: 'Ativo', default: true })
  isActive: boolean;

  @ApiPropertyOptional({ description: 'Código EAN' })
  @Index('INDEX_PRODUTO_EAN')
  @Column({ name: 'EAN', length: 20, nullable: true })
  ean?: string;

  @ApiProperty({ description: 'Referência do produto' })
  @Column({ name: 'Referencia', length: 255, nullable: true })
  reference?: string;

  @ApiProperty({
    description: 'Indica se o produto pode ser convertido',
    default: true,
  })
  @Column({ name: 'Converter', type: 'bit', default: true })
  canConvert: boolean;

  @Column({ name: 'FatorConversao', type: 'int', nullable: true })
  conversionFactor?: number;

  @Column({ name: 'TipoConversao', length: 2, nullable: true })
  conversionType?: string;
}
