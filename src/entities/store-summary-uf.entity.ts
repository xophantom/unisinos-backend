import { ViewColumn, ViewEntity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@ViewEntity({ name: 'VW_SUMMARY_UF' })
export class StoreSummaryView {
  @ApiProperty({ description: 'Id da loja' })
  @ViewColumn({ name: 'LojaId' })
  storeId: number;

  @ApiProperty({ description: 'Código do Cliente' })
  @ViewColumn({ name: 'ClienteCodigo' })
  clientCode: string;

  @ApiProperty({ description: 'Código da loja' })
  @ViewColumn({ name: 'LojaCodigo' })
  storeCode: string;

  @ApiProperty({ description: 'Documento da loja' })
  @ViewColumn({ name: 'LojaDocumento' })
  storeDocument: string;

  @ApiProperty({ description: 'Estado da loja' })
  @ViewColumn({ name: 'LojaUF' })
  storeState: string;

  @ApiProperty({ description: 'Nome da loja/cliente' })
  @ViewColumn({ name: 'LojaNome' })
  storeName: string;

  @ApiProperty({ description: 'Quantidade total de produtos' })
  @ViewColumn({ name: 'QuantidadeTotalProdutos' })
  totalProducts: number;

  @ApiProperty({ description: 'Quantidade de produtos no estoque do cliente' })
  @ViewColumn({ name: 'ProdutosEstoqueCliente' })
  productsInClientStock: number;

  @ApiProperty({ description: 'Quantidade de produtos consumidos' })
  @ViewColumn({ name: 'ProdutosConsumido' })
  consumedProducts: number;

  @ApiProperty({ description: 'Quantidade de produtos pré-faturados' })
  @ViewColumn({ name: 'ProdutosPreFaturado' })
  preInvoicedProducts: number;

  @ApiProperty({ description: 'Quantidade de produtos processando faturamento' })
  @ViewColumn({ name: 'ProdutosProcessandoFaturamento' })
  productsProcessingInvoice: number;

  @ApiProperty({ description: 'Quantidade de produtos faturados' })
  @ViewColumn({ name: 'ProdutosFaturado' })
  invoicedProducts: number;

  @ApiProperty({ description: 'Quantidade de produtos em divergencia' })
  @ViewColumn({ name: 'ProdutosDivergencia' })
  divergentProducts: number;

  @ApiProperty({ description: 'Valor total de todos os produtos' })
  @ViewColumn({ name: 'ValorTotal' })
  totalValue: number;

  @ApiProperty({ description: 'Valor dos produtos no estoque do cliente' })
  @ViewColumn({ name: 'ValorEstoqueCliente' })
  clientStockValue: number;

  @ApiProperty({ description: 'Valor dos produtos consumidos' })
  @ViewColumn({ name: 'ValorConsumido' })
  consumedValue: number;

  @ApiProperty({ description: 'Valor dos produtos pré-faturados' })
  @ViewColumn({ name: 'ValorPreFaturado' })
  preInvoicedValue: number;

  @ApiProperty({ description: 'Valor dos produtos processando faturamento' })
  @ViewColumn({ name: 'ValorProcessandoFaturamento' })
  processingInvoiceValue: number;

  @ApiProperty({ description: 'Valor dos produtos faturados' })
  @ViewColumn({ name: 'ValorFaturado' })
  invoicedValue: number;

  @ApiProperty({ description: 'Valor dos produtos em divergencia' })
  @ViewColumn({ name: 'ValorDivergencia' })
  divergentValue: number;

  @ApiProperty({ description: 'Quantidade de produtos no estoque do cliente fixo' })
  @ViewColumn({ name: 'ProdutosEstoqueClienteFixo' })
  productsInClientStockFixed: number;

  @ApiProperty({ description: 'Valor dos produtos no estoque do cliente fixo' })
  @ViewColumn({ name: 'ValorEstoqueClienteFixo' })
  clientStockValueFixed: number;

  @ApiProperty({ description: 'Quantidade de produtos no estoque do cliente eletivo' })
  @ViewColumn({ name: 'ProdutosEstoqueClienteEletivo' })
  productsInClientStockElective: number;

  @ApiProperty({ description: 'Valor dos produtos no estoque do cliente eletivo' })
  @ViewColumn({ name: 'ValorEstoqueClienteEletivo' })
  clientStockValueElective: number;

  @ApiProperty({ description: 'Quantidade de produtos consumidos fixo' })
  @ViewColumn({ name: 'ProdutosConsumidoFixo' })
  consumedProductsFixed: number;

  @ApiProperty({ description: 'Valor dos produtos consumidos fixo' })
  @ViewColumn({ name: 'ValorConsumidoFixo' })
  consumedValueFixed: number;

  @ApiProperty({ description: 'Quantidade de produtos consumidos eletivo' })
  @ViewColumn({ name: 'ProdutosConsumidoEletivo' })
  consumedProductsElective: number;

  @ApiProperty({ description: 'Valor dos produtos consumidos eletivo' })
  @ViewColumn({ name: 'ValorConsumidoEletivo' })
  consumedValueElective: number;

  @ApiProperty({
    description: 'Data da última contagem de inventário',
    nullable: true,
  })
  @ViewColumn({ name: 'DataUltimaContagem' })
  lastInventoryDate: Date | null;
}
