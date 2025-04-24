import { formatZeroLeft } from '../../tools';

// ---- Request ----

export class ElfmedApiDevolutionRequestModel {
  public readonly Page?: number | null = 1;

  public readonly PageSize?: number | null = 10;

  public readonly InvoiceNumber?: string | null = '';

  public readonly InvoiceSeries?: string | null = '';

  public readonly CustomerCGC?: string | null = '';

  constructor(storeDocument: string, invoiceNumber: number, invoiceSeries: number) {
    this.InvoiceNumber = formatZeroLeft(invoiceNumber, 9);
    this.InvoiceSeries = invoiceSeries.toString();
    this.CustomerCGC = storeDocument;
  }
}

export class ElfmedApiDevolutionRequestModelWithoutZeroLeft {
  public readonly Page?: number | null = 1;

  public readonly PageSize?: number | null = 10;

  public readonly InvoiceNumber?: string | null = '';

  public readonly InvoiceSeries?: string | null = '';

  public readonly CustomerCGC?: string | null = '';

  constructor(storeDocument: string, invoiceNumber: number, invoiceSeries: number) {
    this.InvoiceNumber = invoiceNumber.toString();
    this.InvoiceSeries = invoiceSeries.toString();
    this.CustomerCGC = storeDocument;
  }
}

export class ElfmedApiDevolutionByBranchCGCRequestModel {
  public readonly Page?: number | null = 1;

  public readonly PageSize?: number | null = 10;

  public readonly InvoiceNumber?: string | null = '';

  public readonly InvoiceSeries?: string | null = '';

  public readonly BranchCGC?: string | null = '';

  constructor(branchDocument: string, invoiceNumber: number, invoiceSeries: number) {
    this.InvoiceNumber = formatZeroLeft(invoiceNumber, 9);
    this.InvoiceSeries = invoiceSeries.toString();
    this.BranchCGC = branchDocument;
  }
}

export class ElfmedApiDevolutionRequestModelWithoutDocument {
  public readonly Page?: number | null = 1;

  public readonly PageSize?: number | null = 10;

  public readonly InvoiceNumber?: string | null = '';

  public readonly InvoiceSeries?: string | null = '';

  public CustomerCGC?: string | null = '';

  constructor(invoiceNumber: number, invoiceSeries: number) {
    this.InvoiceNumber = formatZeroLeft(invoiceNumber, 9);
    this.InvoiceSeries = invoiceSeries.toString();
  }
}

export class ElfmedApiDevolutionRequestModelByBranchCGC {
  public readonly Page?: number | null = 1;

  public readonly PageSize?: number | null = 300;

  public readonly InvoiceNumber?: string | null = '';

  public readonly InvoiceSeries?: string | null = '';

  public BranchCGC?: string | null = '';

  public CustomerCGC?: string | null = '';

  constructor(branchDocument: string) {
    this.BranchCGC = branchDocument;
  }
}
