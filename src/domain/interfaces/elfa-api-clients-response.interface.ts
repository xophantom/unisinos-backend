// ---- Response ----
// docs: https://documenter.getpostman.com/view/20831611/2s93z58PWG#f3de6807-d06f-4ed1-b30b-da89506001f5
export interface IElfaApiClientItem {
  Code: string;
  Name: string;
  ShortName: string;
  Branch: string;
  CGC: string;
  City: string;
  UF: string;
  Active: boolean;
  PriceList: string;
}

export interface IElfaApiClientsResponse {
  Items: IElfaApiClientItem[];
  HasNext: boolean;
}
