import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { PreInvoicing } from './pre-invoice.entity';
import { ProductItem } from './product-item.entity';
import { Order } from './order.entity';

@Entity({ name: 'PRE_FATURAMENTO_PRODUTOS' })
export class PreInvoicingProduct {
  @PrimaryGeneratedColumn()
  Id: number;

  @ManyToOne(() => PreInvoicing, (preInvoicing) => preInvoicing.produtos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'OperationId' })
  preInvoicing: PreInvoicing;

  @Column()
  OperationId: string;

  @Column()
  SolicitacaoId: number;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'SolicitacaoId' })
  order: Order;

  @ManyToOne(() => ProductItem)
  @JoinColumn({ name: 'ProdutoItemId' })
  productItem: ProductItem;

  @Column()
  ProdutoItemId: number;
}
