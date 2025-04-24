import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Order } from './order.entity';
import { ProductItem } from './product-item.entity';

@Entity({ name: 'MOVIMENTACAO' })
export class Movement {
  @ApiProperty({ description: 'Id da movimentação' })
  @PrimaryGeneratedColumn({ name: 'MovimentacaoId' })
  id: number;

  @ApiProperty({ description: 'Data de entrada do produto' })
  @Column({ name: 'DataEntrada', nullable: true })
  enteredAt?: Date;

  @ApiProperty({ description: 'Data de saída do produto' })
  @Column({ name: 'DataSaida', nullable: true })
  leftAt?: Date;

  @ApiHideProperty()
  @ManyToOne(() => Order)
  @JoinColumn({ name: 'SolicitacaoId' })
  order: Order;

  @ApiHideProperty()
  @ManyToOne(() => ProductItem, (productItem) => productItem.movements)
  @JoinColumn({ name: 'ProdutoItemId' })
  productItem: ProductItem;

  @ApiProperty({ description: 'Se houve devolução na movimentacao' })
  @Column({ name: 'IsDevolvido' })
  isDevolved?: boolean;
}
