import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Invoice } from '@/entities/invoice.entity';
import { Movement } from './movement.entity';
import { ProductItemTag } from './product-item-tag.entity';
import { Product } from './product.entity';
import { PrintLot } from './print-lot.entity';
import { EProductItemStatus } from '../domain';

@Entity({ name: 'PRODUTO_ITEM' })
export class ProductItem {
  @ApiProperty({ description: 'Id da antena' })
  @PrimaryGeneratedColumn({ name: 'ProdutoItemId', type: 'int' })
  id: number;

  @ApiProperty({ description: 'Identificação do produto', example: 'Bisturi' })
  @Index('INDEX_PRODUTO_ITEM_IDENTIFICACAO')
  @Column({ name: 'Identificacao', length: 255, unique: true })
  identification: string;

  @ApiProperty({ description: 'Lote', example: 'LOTE-LOREM' })
  @Column({ name: 'Lote', length: 100 })
  lot: string;

  @ApiProperty({ description: 'consignmentItem Protheus' })
  @Column({ name: 'ItemConsignado', length: 100 })
  consignmentItem: string;

  @ApiProperty({ description: 'consignmentCode Protheus' })
  @Column({ name: 'CodigoConsignado', length: 100 })
  consignmentCode: string;

  @ApiProperty({ description: 'Data de validade' })
  @Column({ name: 'DataValidade', nullable: true })
  expiresAt?: Date;

  @ApiHideProperty()
  @ManyToOne(() => Product)
  @JoinColumn({ name: 'ProdutoId' })
  product: Product;

  @ApiHideProperty()
  @ManyToOne(() => PrintLot)
  @JoinColumn({ name: 'LoteImpressaoId' })
  printLot: PrintLot;

  @ApiProperty({ description: 'Contador de impressão' })
  @Column({ name: 'ContadorImpressao' })
  printCounter: number;

  @ApiHideProperty()
  @OneToMany(() => Movement, (movement) => movement.productItem)
  movements: Movement[];

  @ApiHideProperty()
  @OneToOne(() => ProductItemTag, (tag) => tag.productItem)
  tag: ProductItemTag;

  @ApiProperty({
    description: 'Status',
    enum: Object.values(EProductItemStatus).map((value) => value),
  })
  @Column({ enum: EProductItemStatus, name: 'Estado', length: 30, default: EProductItemStatus.IN_ELFA_STOCK })
  status: EProductItemStatus = EProductItemStatus.IN_ELFA_STOCK;

  @ApiHideProperty()
  @ManyToOne(() => Invoice)
  @JoinColumn({ name: 'FaturaId' })
  invoice: Invoice;

  @ApiProperty({ description: 'EnderecoCompleto' })
  @Column({ name: 'EnderecoCompleto', length: 500 })
  address: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;
}
