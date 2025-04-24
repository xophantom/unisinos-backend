// ---- Response ----
export interface IElfaApiOrderItemProduct {
  TotalValue: number;
  SectorizationSeller: string;
  ProductCode: string;
  ProductName: string;
  BatchCode?: string;
  SellerName: string;
  Quantity: number;
  UnitPrice: number;
  ConsignmentItem: string;
  ConsignmentCode: string;
  PurchaseOrder: unknown;
}

export interface IElfaApiOrderItem {
  InvoiceNumber: string;
  BranchCGC: string;
  BranchCode: string;
  OrderEmission: string;
  CustomerCGC: string;
  CustomerName: string;
  InvoiceSeries: string;
  BranchName: string;
  OrderNumber: string;
  Products: IElfaApiOrderItemProduct[];
  InvoiceEmission: string;
  Cancelled: boolean;
  UPSERTED_AT: string;
  ConsignmentType?: string;
  PaymentTerm?: string;
  OperationDate?: string;
  PatientName?: string;
}

export interface IElfaApiOrdersResponse {
  Items: IElfaApiOrderItem[];
}
