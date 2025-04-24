import { formatZeroLeft } from '../../tools';

export class ElfaApiStocksRequestModel {
  public readonly cnpj?: string | null;

  public readonly produto?: string | null;

  constructor(warehouseCNPJ: string, productCode: number) {
    this.cnpj = warehouseCNPJ;
    this.produto = formatZeroLeft(productCode, 7);
  }
}
