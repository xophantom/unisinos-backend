import { EProductItemStatus } from '../enums/product-item-status.enum';

export class GetProductStockClienDTO {
  ProdutoItemId: number;
  Lote: string;
  ProdutoId: number;
  Estado: EProductItemStatus;
  DataSaida: string;
  DataEntrada: string;
  FaturaId: number;
  Quantidade: number;
}

export class StatusProductStockClienDTO {
  consumed: number[];
  discrepancy: number[];
  clientStock: number[];
}
