import { AfterLoad, ViewColumn, ViewEntity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@ViewEntity({ name: 'VW_GRID_PRODUTOS_CONSUMIDOS' })
export class ProductConsumedGridView {
  @ApiProperty({ description: 'Id da loja' })
  @ViewColumn({ name: 'LojaId' })
  storeId: number;

  @ApiProperty({ description: 'Código do produto' })
  @ViewColumn({ name: 'Codigo' })
  productCode: number;

  @ApiProperty({ description: 'Descrição do produto' })
  @ViewColumn({ name: 'Descricao' })
  productDescription: string;

  @ApiProperty({ description: 'Lote do produto' })
  @ViewColumn({ name: 'Lote' })
  lot: string;

  @ApiProperty({ description: 'Data de validade do produto' })
  @ViewColumn({ name: 'DataValidade' })
  expiresAt: Date;

  @ApiProperty({ description: 'Quantidade total de produtos consumidos' })
  @ViewColumn({ name: 'Quantidade' })
  consumedAmount: number;

  @ApiProperty({ description: 'Valor total dos produtos consumidos' })
  @ViewColumn({ name: 'ValorTotal' })
  consumedValue: number;

  @ApiProperty({ description: 'Lista de IDs dos itens do produto' })
  @ViewColumn({ name: 'ProdutoItemIds' })
  productItemIds: number[];

  @AfterLoad()
  setProductItemIds() {
    // @ts-ignore
    this.productItemIds = this.productItemIds.split(';').map(Number);
  }
}
