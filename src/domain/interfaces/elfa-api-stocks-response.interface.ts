// ---- Response ----
export interface IElfaApiStockItem {
  cod_produto: string;
  cod_produto_polo: string;
  descricao: string;
  lote: string;
  validade: string;
  cod_operacao_logistica: string;
  cod_operacao_logistica_polo: string;
  id_endereco: string;
  endereco: string;
  endereco_completo: string;
  ean13: string;
  id_lote_classificacao: string;
  id_lote_classificacao_polo: string;
  estoque: string;
  retido: string;
  cod_situacao: string;
  divergencia: any;
  cod_distribuicao: string;
  data_fabricacao: string;
  estoque_reservado: string;
  cod_forn_polo: string;
}

export interface IElfaApiStocksResponse {
  estoque: IElfaApiStockItem[];
}
