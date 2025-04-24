import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EOrderType } from '../enums';

export class GetListProductStockClientByStore {
  @ApiPropertyOptional({ description: 'Código da solicitação', required: false })
  orderCode?: number;

  @ApiPropertyOptional({ description: 'Nome produto', required: false })
  productName?: string;

  @ApiPropertyOptional({ description: 'Lote Produto', required: false })
  lote?: string;

  @ApiPropertyOptional({ description: 'Tipo', enum: EOrderType, required: false })
  type?: EOrderType;

  @ApiPropertyOptional({ description: 'Nome do paciente', required: false })
  patientName?: string;
}

export class GetProductStockClientDTO {
  SolicitacaoId: number;
  Pedido: number;
  Tipo: EOrderType;
  DataSolicitacao: string;
  Paciente: string;
  DataProcedimento: string;
  ProdutoItemId: number;
  ProdutoId: number;
  Codigo: number;
  Descricao: string;
  Lote: string;
  Estado: string;
  DataValidade: string;
  Quantidade: number;
  ValorUnitario: number;
  ValorTotal: number;
  ProdutosItemIds: string;
  armazemCNPJ: string;
  EPC: string;
  CodigoConsignado: string;
  ItemConsignado: string;
}

export class ProductsStockClientOrderDetals {
  @ApiProperty({ description: 'Id da Solicitação' })
  SolicitacaoId: number;

  @ApiProperty({ description: 'Código da Solicitação' })
  Codigo: number;

  @ApiProperty({ description: 'Data Solicitação' })
  DataSolicitacao: string;

  @ApiProperty({ description: 'Tipo  da Solicitação' })
  Tipo: EOrderType;

  @ApiProperty({ description: 'Usuario Solicitante' })
  UsuarioAlteracao: string = '';

  @ApiProperty({ description: 'Paciente' })
  Paciente: string;

  @ApiProperty({ description: 'Data Procedimento' })
  DataProcedimento: string;

  @ApiProperty({ description: 'Lista de produtos', type: Array<ProductsStockClientOrder> })
  produtos: ProductsStockClientOrder[];
}

export class ProductsStockClientOrder {
  @ApiProperty({ description: 'Id do Produto' })
  ProdutoId: number;

  @ApiProperty({ description: 'Id do Item Produto' })
  ProdutoItemId: number;

  @ApiProperty({ description: 'Is dos Item Produto' })
  ProdutosItemIds: string;

  @ApiProperty({ description: 'Nome do Produto' })
  Nome: string;

  @ApiProperty({ description: 'Codigo do Produto' })
  Codigo: number;

  @ApiProperty({ description: 'Lote do Produto' })
  Lote: string;

  @ApiProperty({ description: 'Data do Produto' })
  DataValidade: string;

  @ApiProperty({ description: 'Codigo do Produto' })
  Quantidade: number;

  @ApiProperty({ description: 'Codigo do Produto' })
  ValorUnitario: number;

  @ApiProperty({ description: 'Codigo do Produto' })
  ValorTotal: number;
}
