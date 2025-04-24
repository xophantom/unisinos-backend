import { encodeQrCode, formatZeroLeft } from 'src/tools';
import { Printer, PrintLot, ProductItem } from '../../entities';

export class ProductLabel {
  public readonly productLot: string;

  public readonly productCode: string;

  public readonly productDescription: string;

  public readonly productReference: string;

  public readonly expirationDate: Date;

  public readonly printCounter: number;

  public readonly epc: string;

  public readonly qrCode: string;

  constructor(productItem: ProductItem) {
    const { lot, product, expiresAt, printCounter, identification } = productItem;
    const { code, description, reference } = product;

    this.productLot = lot;
    this.productCode = formatZeroLeft(code, 7);
    this.productDescription = description.slice(0, 58);
    this.productReference = reference || '';
    this.expirationDate = new Date(expiresAt);
    this.printCounter = printCounter;
    this.epc = identification;
    this.qrCode = encodeQrCode(code, lot, new Date(expiresAt), identification);
  }
}

export class PrinterIntegrationApiRequestModel {
  public readonly printerIp: string;

  public readonly printerPort: number;

  public readonly lotName: string;

  public readonly productLabels: ProductLabel[];

  constructor(printer: Printer, printLot: PrintLot, productItems: ProductItem[]) {
    const { ip, port } = printer;

    this.printerIp = ip;
    this.printerPort = port;
    this.lotName = printLot.name;
    this.productLabels = productItems.map((productItem) => new ProductLabel(productItem));
    this.productLabels.sort((a, b) => a.printCounter - b.printCounter);
  }
}

export class PrinterLabelIntegrationApiRequestModel {
  public readonly lotName: string;

  public readonly productLabels: ProductLabel[];

  constructor(printLot: PrintLot, productItems: ProductItem[]) {
    this.lotName = printLot.name;
    this.productLabels = productItems.map((productItem) => new ProductLabel(productItem));
    this.productLabels.sort((a, b) => a.printCounter - b.printCounter);
  }
}
