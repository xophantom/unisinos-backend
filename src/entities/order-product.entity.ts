import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Relation } from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Order } from './order.entity';
import { Product } from './product.entity';

@Entity({ name: 'SOLICITACAO_PRODUTO' })
export class OrderProduct {
  @ApiProperty({ description: 'Id do Solicitação-Produto' })
  @PrimaryGeneratedColumn({ name: 'SolicitacaoProdutoId' })
  id: number;

  @ApiProperty({ description: 'Quantidade convertida' })
  @Column({ name: 'Quantidade' })
  amount: number;

  @ApiProperty({ description: 'Valor unitário do produto' })
  @Column({ name: 'ValorUnitario', type: 'decimal', precision: 12, scale: 2 })
  unitCost: number;

  @ApiProperty({ description: 'Valor total dos produtos sem conversão' })
  @Column({ name: 'ValorTotal', type: 'decimal', precision: 12, scale: 2 })
  totalValue: number;

  @ApiHideProperty()
  @ManyToOne(() => Order)
  @JoinColumn({ name: 'SolicitacaoId' })
  order: Relation<Order>;

  @ApiHideProperty()
  @ManyToOne(() => Product)
  @JoinColumn({ name: 'ProdutoId' })
  product: Relation<Product>;
}
