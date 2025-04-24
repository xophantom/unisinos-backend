import { formatZeroLeft } from '../../tools';

// ---- Request ----
// docs: https://documenter.getpostman.com/view/20831611/2s93z58PWG#94cec1e0-9c1b-4b7c-8260-a5bc20ca23cf

export class ElfaApiOrdersRequestModel {
  public readonly Page?: number | null = 1;

  public readonly PageSize?: number | null = 10;

  public readonly OrderNumber?: string | null = '';

  public readonly BranchCGC?: string | null = '';

  public readonly InvoiceSeries?: string | null = '';

  public readonly CustomerCGC?: string | null = '';

  public readonly InvoiceNumber?: string | null = '';

  constructor(warehouseCNPJ: string, orderCode: number) {
    this.BranchCGC = warehouseCNPJ;
    this.OrderNumber = orderCode ? formatZeroLeft(orderCode, 6) : '';
  }
}

export class CustomElfaApiOrdersRequestModel {
  public readonly Page?: number | null = 1;

  public readonly PageSize?: number | null = 10;

  public readonly OrderNumber?: string | null = '';

  public readonly BranchCGC?: string | null = '';

  public readonly InvoiceSeries?: string | null = '';

  public readonly CustomerCGC?: string | null = '';

  public readonly InvoiceNumber?: string | null = '';

  constructor(warehouseCNPJ: string, orderCode?: number, invoiceNumber?: number, invoiceSeries?: number) {
    this.CustomerCGC = warehouseCNPJ;

    if (orderCode) {
      this.OrderNumber = formatZeroLeft(orderCode, 6);
    }

    if (invoiceNumber) {
      this.InvoiceNumber = invoiceNumber.toString();
    }

    if (invoiceSeries) {
      this.InvoiceSeries = invoiceSeries.toString();
    }
  }
}

export class ElfaApiOrdersByProductRequestModel {
  public Page?: number | null = 1;

  public PageSize?: number | null = 1000;

  public OrderNumber?: string | null = '';

  public BranchCGC?: string | null = '';

  public InvoiceSeries?: string | null = '';

  public CustomerCGC?: string | null = '';

  public InvoiceNumber?: string | null = '';

  constructor(storeDocument: string) {
    this.CustomerCGC = storeDocument;
  }
}
