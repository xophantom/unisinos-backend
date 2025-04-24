// ---- Response ----
// docs: https://documenter.getpostman.com/view/20831611/2s93z58PWG#f3de6807-d06f-4ed1-b30b-da89506001f5
export interface IElfaApiPriceItem {
  Key: string;
  Barcode: string;
  BranchCGC: string;
  BranchCode: string;
  Price: number;
  PriceBook: string;
  ProductCode: string;
  UF: string;
  UPSERTED_AT: Date;
}

export interface IElfaApiPriceItemsResponse {
  Items: IElfaApiPriceItem[];
  HasNext: boolean;
}
