import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { ProductItem } from '@/entities/product-item.entity';

@Entity({ name: 'FATURA' })
export class Invoice {
  @ApiProperty({ description: 'Fatura ID' })
  @PrimaryGeneratedColumn({ name: 'FaturaId' })
  id: number;

  @ApiProperty({ description: 'Nota fiscal de devolução' })
  @Column('int', { name: 'NotaFiscalDevolucao' })
  invoiceRef: number;

  @ApiProperty({ description: 'Código do pedido de venda' })
  @Column('int', { name: 'CodigoPedidoVenda' })
  saleOrderCode: number;

  @ApiProperty({ description: 'Data de devolução' })
  @Column({ name: 'DataDevolucao', type: 'datetime' })
  returnDate: Date;

  @ApiProperty({ description: 'Data da venda' })
  @Column({ name: 'DataVenda', type: 'datetime' })
  saleDate: Date;

  @ApiProperty({ description: 'Faturada' })
  @Column({ name: 'Faturada', default: false })
  isInvoiced: boolean = false;

  @ApiHideProperty()
  @OneToMany(() => ProductItem, (productItem) => productItem.invoice)
  @JoinColumn()
  productItems: Relation<ProductItem[]>;
}
