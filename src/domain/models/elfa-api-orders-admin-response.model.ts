import {
  IElfaApiDevolutionItem,
  IElfaApiDevolutionItemProduct,
  IElfaApiOrderItem,
  IElfaApiOrderItemProduct,
} from '../interfaces';
import { EOrderType } from '../enums';
import { formatZeroLeftString } from '../../tools';
import { ConsignmentTypeDevolution } from '../enums/consigment-type.enum';

export class ElfaApiOrderProductModel {
  public code: number;

  public lot?: string;

  public serialNumbers: string[];

  public name: string;

  public sellerName: string;

  public consignmentItem?: string;

  public consignmentCode?: string;

  public amount: number;

  public unitCost: number;

  public totalValue: number;

  public originalInvoiceNumber: string;

  public originalInvoiceSeries: string;

  public originalOrderNumber: string;

  constructor(item: IElfaApiOrderItemProduct | IElfaApiDevolutionItemProduct) {
    if ((item as IElfaApiOrderItemProduct).SectorizationSeller != undefined) {
      const orderProduct = item as IElfaApiOrderItemProduct;
      this.code = Number(orderProduct.ProductCode);
      this.lot = orderProduct.BatchCode?.trim().split('/')[0] || null;
      this.serialNumbers = [orderProduct.BatchCode?.trim().split('/')[1] || null];
      this.name = orderProduct.ProductName || null;
      this.sellerName = orderProduct.SellerName || null;
      this.consignmentItem = orderProduct.ConsignmentItem || null;
      this.consignmentCode = orderProduct.ConsignmentCode || null;
      this.amount = orderProduct.Quantity;
      this.unitCost = Number(orderProduct.UnitPrice.toFixed(2));
      this.totalValue = Number(orderProduct.TotalValue.toFixed(2));
    } else if (item as IElfaApiDevolutionItemProduct) {
      const devolutionProduct = item as IElfaApiDevolutionItemProduct;
      this.code = Number(devolutionProduct.ProductCode);
      this.lot = devolutionProduct.BatchCode?.trim().split('/')[0] || null;
      this.serialNumbers = [devolutionProduct.BatchCode?.trim().split('/')[1] || null];
      this.name = devolutionProduct.ProductName || null;
      this.amount = devolutionProduct.Quantity;
      this.unitCost = Number(devolutionProduct.UnitPrice.toFixed(2));
      this.originalInvoiceNumber = devolutionProduct.OriginalInvoiceNumber;
      this.originalInvoiceSeries = devolutionProduct.OriginalInvoiceSeries;
      this.originalOrderNumber = devolutionProduct.OriginalOrderNumber;
    }
  }
}

export class ElfaApiOrderResponseAdminModel {
  public readonly code: string;

  public readonly invoiceNumber: string;

  public readonly invoiceSeries: string;

  public readonly requestedAt: Date;

  public readonly storeDocument: string;

  public readonly type?: EOrderType;

  public readonly isCancelled: boolean;

  public totalValue: number;

  public readonly ConsignmentType: string;

  public readonly invoice: string;

  public products: ElfaApiOrderProductModel[];

  public totalAmount: number;

  public BranchCGC: string;

  public customerCGC: string;

  public paymentTerm: string;

  public operationDate: string;

  public patientName: string;

  public invoiceEmission: string;

  constructor(item: IElfaApiOrderItem | IElfaApiDevolutionItem) {
    this.BranchCGC = item.BranchCGC;
    this.customerCGC = item.CustomerCGC;
    this.invoiceNumber = item.InvoiceNumber;
    this.invoiceSeries = item.InvoiceSeries;
    this.storeDocument = item.CustomerCGC;
    this.invoice =
      formatZeroLeftString(this.invoiceNumber, 9) +
      formatZeroLeftString(this.invoiceNumber, 3) +
      formatZeroLeftString(this.storeDocument, 14);

    this.isCancelled = item.Cancelled;
    this.paymentTerm = item.PaymentTerm;
    this.operationDate = item.OperationDate;
    this.patientName = item.PatientName;

    if ((item as IElfaApiOrderItem).OrderNumber !== undefined) {
      const orderItem = item as IElfaApiOrderItem;
      const { totalValue, totalAmount } = this.calculateTotalsOrder(orderItem.Products);

      this.code = Number(orderItem.OrderNumber).toString();
      this.requestedAt = this.convertOrderEmissionToDate(orderItem.OrderEmission);
      this.type = (orderItem.ConsignmentType?.trim() as EOrderType) || null;
      this.isCancelled = orderItem.Cancelled;
      this.totalValue = Number(totalValue.toFixed(2));
      this.totalAmount = totalAmount;
      this.ConsignmentType = orderItem.ConsignmentType?.trim();
      const nonConsolidatedProducts = orderItem.Products.map((product) => new ElfaApiOrderProductModel(product));
      this.products = this.consolidateProducts(nonConsolidatedProducts);
    }

    const consigmentTypeDevolution = [
      ConsignmentTypeDevolution.RETORNO,
      ConsignmentTypeDevolution.RETORNO_SIMBOLICO,
    ] as string[];

    if (consigmentTypeDevolution.indexOf((item as IElfaApiDevolutionItem).Products[0].ConsignmentType) >= 0) {
      const devolutionItem = item as IElfaApiDevolutionItem;
      const { totalValue, totalAmount } = this.calculateTotalsDevolution(devolutionItem.Products);

      this.requestedAt = this.convertOrderEmissionToDate(devolutionItem.CREATED_AT);
      this.ConsignmentType = devolutionItem.Products[0].ConsignmentType?.trim();
      this.type = (devolutionItem.Products[0].ConsignmentType?.trim() as EOrderType) || null;
      this.totalValue = Number(totalValue.toFixed(2));
      this.totalAmount = totalAmount;
      const nonConsolidatedProducts = devolutionItem.Products.map((product) => new ElfaApiOrderProductModel(product));
      this.products = this.consolidateProducts(nonConsolidatedProducts);
      this.code = this.invoice;
      this.invoiceEmission = devolutionItem.InvoiceEmission;
    }
  }

  private calculateTotalsOrder(products: IElfaApiOrderItemProduct[]) {
    return products.reduce(
      (totals, product) => ({
        totalValue: totals.totalValue + product.TotalValue,
        totalAmount: totals.totalAmount + product.Quantity,
      }),
      { totalValue: 0, totalAmount: 0 },
    );
  }

  private calculateTotalsDevolution(products: IElfaApiDevolutionItemProduct[]) {
    return products.reduce(
      (totals, product) => ({
        totalValue: product.UnitPrice * product.Quantity + totals.totalValue,
        totalAmount: product.Quantity + totals.totalAmount,
      }),
      { totalValue: 0, totalAmount: 0 },
    );
  }

  private convertOrderEmissionToDate(orderEmission: string): Date {
    const year = Number(orderEmission.substring(0, 4));
    const month = Number(orderEmission.substring(4, 6)) - 1;
    const day = Number(orderEmission.substring(6, 8));
    return new Date(year, month, day);
  }

  private consolidateProducts(products: ElfaApiOrderProductModel[]) {
    const consolidatedProducts = [];
    products.forEach((product) => {
      const existingProduct = consolidatedProducts.find((p) => p.code === product.code && p.lot === product.lot);
      if (existingProduct) {
        existingProduct.amount += product.amount;
        existingProduct.serialNumbers = [...new Set([...existingProduct.serialNumbers, ...product.serialNumbers])];
      } else {
        consolidatedProducts.push({ ...product, serialNumbers: [...product.serialNumbers] });
      }
    });
    return consolidatedProducts;
  }
}
