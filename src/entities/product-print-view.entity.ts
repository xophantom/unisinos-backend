import { ViewColumn, ViewEntity } from 'typeorm';

@ViewEntity({ name: 'VW_PRODUTO_IMPRESSAO' })
export class ProductPrintView {
  @ViewColumn({ name: 'ProdutoItemId' })
  ProdutoItemId: number;

  @ViewColumn({ name: 'EPC' })
  EPC: string;

  @ViewColumn({ name: 'Status' })
  Status: string;

  @ViewColumn({ name: 'LojaNome' })
  LojaNome: string;

  @ViewColumn({ name: 'LojaDocumento' })
  LojaDocumento: string;

  @ViewColumn({ name: 'LojaCodigo' })
  LojaCodigo: number;

  @ViewColumn({ name: 'ClienteCodigo' })
  ClienteCodigo: number;

  @ViewColumn({ name: 'ProdutoId' })
  ProdutoId: number;

  @ViewColumn({ name: 'ProdutoCodigo' })
  ProdutoCodigo: number;

  @ViewColumn({ name: 'ProdutoLote' })
  ProdutoLote: string;

  @ViewColumn({ name: 'ProdutoValidade' })
  ProdutoValidade: Date;

  @ViewColumn({ name: 'LoteImpressaoId' })
  LoteImpressaoId: number;

  @ViewColumn({ name: 'NomeLoteImpressao' })
  NomeLoteImpressao: string;

  @ViewColumn({ name: 'ArmazemId' })
  ArmazemId: number;

  @ViewColumn({ name: 'DataGeracao' })
  DataGeracao: Date;

  @ViewColumn({ name: 'ProdutoNome' })
  ProdutoNome: string;
}
