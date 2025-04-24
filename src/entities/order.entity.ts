import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { EOrderType } from '../domain';
import { OrderProduct } from './order-product.entity';
import { Store } from './store.entity';
import { Warehouse } from './warehouse.entity';

@Entity({ name: 'SOLICITACAO' })
export class Order {
  @ApiProperty({ description: 'Id da solicitação' })
  @PrimaryGeneratedColumn({ name: 'SolicitacaoId' })
  id: number;

  @ApiProperty({ description: 'Código da solicitação' })
  @Column({ name: 'Codigo', type: 'bigint' })
  code: number;

  @ApiProperty({ description: 'Tipo da solicitação' })
  @Column({ type: String, name: 'Tipo', length: 30 })
  type: EOrderType;

  @ApiProperty({ description: 'Data da solicitação' })
  @Column({ name: 'DataSolicitacao', type: 'date' })
  requestedAt: Date;

  @ApiProperty({ description: 'Data de envio' })
  @Column({ name: 'DataEnvio', nullable: true })
  shippedAt?: Date;

  @ApiProperty({ description: 'Data de recebimento' })
  @Column({ name: 'DataRecebimento', nullable: true })
  receivedAt?: Date;

  @ApiHideProperty()
  @ManyToOne(() => Store)
  @JoinColumn({ name: 'LojaId' })
  store: Store;

  @ApiHideProperty()
  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.order)
  @JoinColumn()
  orderProducts: Relation<OrderProduct[]>;

  @ApiProperty({ description: 'Data de criação' })
  @Column({ name: 'createdAt', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty({ description: 'Id do armazém' })
  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'armazemId' })
  warehouse?: Relation<Warehouse>;

  @ApiProperty({ description: 'Usuário responsável' })
  @Column({ name: 'username', type: 'varchar', length: 255 })
  username?: string;

  @ApiProperty({ description: 'Número da remessa' })
  @Column({ name: 'Remessa', type: 'bigint', nullable: true })
  order?: number;

  @ApiProperty({ description: 'Status da solicitação' })
  @Column({ name: 'Status', type: 'varchar', length: 30, nullable: true })
  status?: string;

  @BeforeInsert()
  setCreatedAt() {
    this.createdAt = new Date();
  }

  @ApiProperty({ description: 'NF' })
  @Column({ name: 'Fatura', type: 'bigint' })
  invoiceNumber: number;

  @ApiProperty({ description: 'Digito da NF' })
  @Column({ name: 'FaturaDigito', type: 'bigint' })
  invoiceSeries: number;

  @ApiProperty({ description: 'Usuário responsável' })
  @Column({ name: 'Representante', type: 'varchar', length: 255 })
  sellerName?: string;

  @ApiProperty({ description: 'Usuário responsável' })
  @Column({ name: 'Paciente', type: 'varchar', length: 255 })
  patientName?: string;

  @ApiProperty({ description: 'Usuário responsável' })
  @Column({ name: 'DataProcedimento', type: 'datetime' })
  operationDate?: Date;
}
