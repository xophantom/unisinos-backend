import { IElfaApiStockItem } from '../interfaces';

export class ElfaApiStockResponseModel {
  public readonly lot: string;

  public readonly expirationDate: string;

  public readonly address: string;

  constructor(item: IElfaApiStockItem) {
    const [expirationDate] = item.validade.split('T');

    this.lot = item.lote;
    this.expirationDate = expirationDate;
    this.address = item.endereco_completo;
  }
}
