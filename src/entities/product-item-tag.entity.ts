import { Column, Entity, Index, JoinColumn, OneToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';
import { ApiHideProperty } from '@nestjs/swagger';
import { ProductItem } from './product-item.entity';

@Entity({ name: 'PRODUTO_ITEM_TAG' })
export class ProductItemTag {
  @PrimaryGeneratedColumn({ name: 'TagId', type: 'int' })
  id: number;

  @Index('INDEX_PRODUTO_ITEM_TAG_EPC')
  @Column({ name: 'EPC', length: 255, unique: true })
  epc: string;

  @ApiHideProperty()
  @OneToOne(() => ProductItem, (pI) => pI.tag)
  @JoinColumn({ name: 'ProdutoItemId' })
  productItem: Relation<ProductItem>;
}
