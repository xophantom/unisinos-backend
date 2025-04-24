import { ViewColumn, ViewEntity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@ViewEntity({ name: 'VW_PRODUTO_GRID' })
export class ProductGridView {
  @ApiProperty({ description: 'Id da loja' })
  @ViewColumn({ name: 'LojaId' })
  storeId: number;

  @ApiProperty({ description: 'Id do produto' })
  @ViewColumn({ name: 'ProdutoId' })
  productId: number;

  @ApiProperty({ description: 'Código do produto' })
  @ViewColumn({ name: 'Codigo' })
  productCode: number;

  @ApiProperty({ description: 'Descrição do produto' })
  @ViewColumn({ name: 'Descricao' })
  productDescription: string;

  @ApiProperty({ description: 'Quantidade total de produtos aguardando entrega' })
  @ViewColumn({ name: 'QuantidadeAguardandoEntrega' })
  awaitingDeliveryAmount: number;

  @ApiProperty({ description: 'Valor total de produtos aguardando entrega' })
  @ViewColumn({ name: 'ValorAguardandoEntrega' })
  awaitingDeliveryValue: number;

  @ApiProperty({ description: 'Quantidade total de produtos no estoque da elfa' })
  @ViewColumn({ name: 'QuantidadeEstoqueElfa' })
  inElfaStockAmount: number;

  @ApiProperty({ description: 'Valor total de produtos no estoque da elfa' })
  @ViewColumn({ name: 'ValorEstoqueElfa' })
  inElfaStockValue: number;

  @ApiProperty({ description: 'Quantidade total de produtos no estoque do cliente' })
  @ViewColumn({ name: 'QuantidadeEstoqueCliente' })
  inClientStockAmount: number;

  @ApiProperty({ description: 'Valor total de produtos no estoque do cliente' })
  @ViewColumn({ name: 'ValorEstoqueCliente' })
  inClientStockValue: number;

  @ApiProperty({ description: 'Quantidade total de produtos com divergência de estoque' })
  @ViewColumn({ name: 'QuantidadeDivergenciaEstoque' })
  stockDiscrepancyAmount: number;

  @ApiProperty({ description: 'Valor total de produtos com divergência de estoque' })
  @ViewColumn({ name: 'ValorDivergenciaEstoque' })
  stockDiscrepancyValue: number;

  @ApiProperty({ description: 'Quantidade total de produtos consumidos' })
  @ViewColumn({ name: 'QuantidadeConsumido' })
  consumedAmount: number;

  @ApiProperty({ description: 'Valor total de produtos consumidos' })
  @ViewColumn({ name: 'ValorConsumido' })
  consumedValue: number;

  @ApiProperty({ description: 'Quantidade total de produtos pré faturados' })
  @ViewColumn({ name: 'QuantidadePreFaturado' })
  preInvoicedAmount: number;

  @ApiProperty({ description: 'Valor total de produtos pré faturados' })
  @ViewColumn({ name: 'ValorPreFaturado' })
  preInvoicedValue: number;

  @ApiProperty({ description: 'Quantidade total de produtos faturados' })
  @ViewColumn({ name: 'QuantidadeFaturado' })
  invoicedAmount: number;

  @ApiProperty({ description: 'Valor total de produtos faturados' })
  @ViewColumn({ name: 'ValorFaturado' })
  invoicedValue: number;

  @ApiProperty({ description: 'Quantidade total de produtos processando faturamento' })
  @ViewColumn({ name: 'QuantidadeFaturado' })
  awaitingInvoicingAmount: number;

  @ApiProperty({ description: 'Valor total de produtos processando faturamento' })
  @ViewColumn({ name: 'ValorFaturado' })
  awaitingInvoicingAmountValue: number;
}
