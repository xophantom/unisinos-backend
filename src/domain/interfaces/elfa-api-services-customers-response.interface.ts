// ---- Response ----
// docs: https://documenter.getpostman.com/view/20831611/2s93z58PWG#f3de6807-d06f-4ed1-b30b-da89506001f5

export interface IElfaApiServiceCustomerItem {
  Key: string;
  Active: boolean;
  Address: string;
  AddressLine2?: string;
  AlvaraExpirationDate: string;
  BirthDate?: Date;
  Branch: string;
  CGC: string;
  CRTExpirationDate?: Date;
  CarrierCode?: number;
  Cep: string;
  City: string;
  Class: string;
  ClassDescription: string;
  Cnae: string;
  Code: string;
  Contact?: string;
  Contribuinte: boolean;
  CountryCode: string;
  CountryName?: string;
  CreditClass?: string;
  CreditLimit: number;
  CreditLimitExpirationDate: string;
  DDD: string;
  Discount: number;
  District: string;
  EcommerceEmail?: string;
  Email: string;
  FreightType?: string;
  Group: string;
  GroupDescription?: string;
  HomePage?: string;
  InscricaoEstadual: string;
  InscricaoMunicipal?: string;
  IssueBoleto: boolean;
  KeyAccount: boolean;
  LegalEntityType: string;
  Name: string;
  Notes?: string;
  PaymentTermCode: string;
  PaymentTermDescription: string;
  PaymentTermType: string;
  Phone: string;
  PriceList: string;
  ProtheusCreationDate: string;
  Region?: string;
  Risk?: string;
  SalesGroup?: string;
  Segment: string;
  SegmentDescription: string;
  ShortName: string;
  Type: string;
  UF: string;
  UPSERTED_AT: string;
  WMSRoute?: string;
  Warehouse?: string;
  CustomSegment: string;
}

export interface IElfaApiServicesCustomersResponse {
  Items: IElfaApiServiceCustomerItem[];
  HasNext: boolean;
}
