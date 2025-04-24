// ---- Response ----
export interface IElfaApiDevolutionItemProduct {
  ProductName: string;
  Quantity: number;
  OriginalInvoiceSeries: string;
  OriginalOrderNumber: string;
  ProductCode: string;
  UnitPrice: number;
  OriginalInvoiceNumber: string;
  BatchCode?: string;
  ConsignmentType: string;
}

export interface IElfaApiDevolutionItem {
  BranchCode: string;
  Cancelled?: boolean;
  InvoiceNumber: string;
  InvoiceSeries: string;
  BranchCGC: string;
  BranchName: string;
  CREATED_AT: string;
  CustomerCGC: string;
  CustomerName: string;
  InvoiceEmission: string;
  UPDATED_AT: string;
  Products: IElfaApiDevolutionItemProduct[];
  PaymentTerm?: string;
  OperationDate?: string;
  PatientName?: string;
}

export interface IElfaApiDevolutionResponse {
  Items: IElfaApiDevolutionItem[];
}
