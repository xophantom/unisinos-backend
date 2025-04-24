import { ViewColumn, ViewEntity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { EProductItemStatus } from '../domain';

@ViewEntity({ name: 'VW_PRODUTO_ITEM_DETALHE_ALL' })
export class ProductItemDetailViewAll {
  @ApiProperty({ description: 'Id do produto item' })
  @ViewColumn({ name: 'ProdutoItemId' })
  productItemId: number;

  @ApiProperty({ description: 'Id da loja' })
  @ViewColumn({ name: 'LojaId' })
  storeId: number;

  @ApiProperty({ description: 'Documento da loja' })
  @ViewColumn({ name: 'LojaDocumento' })
  storeDocument: number;

  @ApiProperty({ description: 'Nome do cliente' })
  @ViewColumn({ name: 'LojaNome' })
  storeName: string;

  @ApiProperty({ description: 'Nome do cliente' })
  @ViewColumn({ name: 'LojaCodigo' })
  storeCode: string;

  @ApiProperty({ description: 'Nome do cliente' })
  @ViewColumn({ name: 'ClienteCodigo' })
  clientCode: string;

  @ApiProperty({ description: 'ID do cliente' })
  @ViewColumn({ name: 'ClienteId' })
  clientId: number;

  @ApiProperty({ description: 'Data de entrega' })
  @ViewColumn({ name: 'DataEntrega' })
  receivedAt: Date;

  @ApiProperty({ description: 'Código da solicitação' })
  @ViewColumn({ name: 'Remessa' })
  orderCode: number;

  @ApiProperty({ description: 'Código da solicitação pro inventário' })
  @ViewColumn({ name: 'RemessaInventario' })
  RemessaInventario: number;

  @ApiProperty({ description: 'StatusRemessa da solicitação' })
  @ViewColumn({ name: 'StatusRemessa' })
  orderStatus: string;

  @ApiProperty({ description: 'Tipo da solicitação' })
  @ViewColumn({ name: 'TipoRemessa' })
  orderType: string;

  @ApiProperty({ description: 'Nome do Paciente' })
  @ViewColumn({ name: 'NomePaciente' })
  patienteName: string;

  @ApiProperty({ description: 'Data do Procedimento' })
  @ViewColumn({ name: 'DataProcedimento' })
  operationDate: string;

  @ApiProperty({ description: 'NF' })
  @ViewColumn({ name: 'FaturaRemessa' })
  invoiceNumber: number;

  @ApiProperty({ description: 'Digito da NF' })
  @ViewColumn({ name: 'FaturaDigitoRemessa' })
  invoiceSeries: number;

  @ApiProperty({ description: 'Código do pedido de venda' })
  @ViewColumn({ name: 'CodigoPedidoVenda' })
  saleOrderCode: number;

  @ApiProperty({ description: 'EPC do produto' })
  @ViewColumn({ name: 'EPC' })
  epc: string;

  @ApiProperty({ description: 'Lote do produto' })
  @ViewColumn({ name: 'Lote' })
  lot: string;

  @ApiProperty({ description: 'Data de validade' })
  @ViewColumn({ name: 'DataValidade' })
  expiresAt: Date;

  @ApiProperty({ description: 'Valor unitário' })
  @ViewColumn({ name: 'ValorUnitario' })
  unitCost: number;

  @ApiProperty({
    description: 'Status',
    enum: Object.values(EProductItemStatus).map((value) => value),
  })
  @ViewColumn({ name: 'Estado' })
  status: EProductItemStatus;

  @ApiProperty({ description: 'Id do produto' })
  @ViewColumn({ name: 'ProdutoId' })
  productId: number;

  @ApiProperty({ description: 'Código do produto' })
  @ViewColumn({ name: 'Codigo' })
  productCode: number;

  @ApiProperty({ description: 'Descrição do produto' })
  @ViewColumn({ name: 'Descricao' })
  productDescription: number;

  @ApiProperty({ description: 'CNPJ do armazém' })
  @ViewColumn({ name: 'armazemCNPJ' })
  armazemCNPJ: string;

  @ApiProperty({ description: 'Nome do armazém' })
  @ViewColumn({ name: 'armazemNome' })
  armazemNome: string;
}
