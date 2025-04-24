import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Store } from './store.entity';
import { ProductItem } from './product-item.entity';

@Entity({ name: 'DIVERGENCIAS' })
export class Divergence {
  @ApiProperty({ description: 'Id da divergência' })
  @PrimaryGeneratedColumn({ name: 'Id', type: 'int' })
  id: number;

  @ApiProperty({ description: 'Usuário responsável pela divergência' })
  @Column({ name: 'Usuario', type: 'varchar', length: 255, nullable: true })
  user: string;

  @ApiProperty({ description: 'Id da loja associada à divergência' })
  @Column({ name: 'LojaId', type: 'int', nullable: false })
  storeId: number;

  @ApiHideProperty()
  @ManyToOne(() => ProductItem)
  @JoinColumn({ name: 'ProdutoItemId' })
  productItem: Relation<ProductItem>;

  @ApiProperty({ description: 'Id do item de produto associado à divergência' })
  @Column({ name: 'ProdutoItemId', type: 'int', nullable: false })
  productItemId: number;

  @ApiProperty({
    description: 'Status da divergência (0: Pendente, 1: Concluído)',
    default: 0,
  })
  @Column({ name: 'StatusDivergencia', type: 'bit', default: 0 })
  status: boolean;

  @ApiProperty({ description: 'Data/hora de inclusão da divergência' })
  @CreateDateColumn({ name: 'DataInclusao', type: 'datetime' })
  createdAt: Date;

  @ApiProperty({ description: 'Data/hora de conclusão da divergência' })
  @UpdateDateColumn({ name: 'DataConclusao', type: 'datetime', nullable: true })
  concludedAt: Date | null;

  @ApiProperty({ description: 'Tipo da divergência' })
  @Column({ name: 'TipoDivergencia', type: 'varchar', length: 50, nullable: false })
  type: string;

  @ApiProperty({ description: 'Id da loja origem (caso aplicável)' })
  @Column({ name: 'LojaOrigemId', type: 'int', nullable: true })
  originStoreId: number | null;

  /* --------------------------------------------------------------------- */
  @ApiHideProperty()
  @ManyToOne(() => Store)
  @JoinColumn({ name: 'LojaId' })
  store: Relation<Store>;
}
