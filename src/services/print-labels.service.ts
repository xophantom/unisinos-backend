import { Injectable } from '@nestjs/common';
import {
  EProductItemStatus,
  PrinterIntegrationApiRequestModel,
  PrinterLabelIntegrationApiRequestModel,
  printProductLabelDTO,
  PrintProductLabelDto,
  ProductLabel,
  ReprintProductLabelDto,
} from 'src/domain';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { Product } from '@/entities/product.entity';
import { Printer } from '@/entities/printer.entity';
import { ProductItem } from '@/entities/product-item.entity';
import { PrintLot } from '@/entities/print-lot.entity';
import { ProductItemTag } from '@/entities/product-item-tag.entity';
import { PrinterNotFoundError, ProductNotFoundError } from '../errors';
import { encodeHexEPC, formatZeroLeft } from '../tools';
import { PrinterIntegrationApiService } from './printer-integration-api.service';
import { ProductService } from './product.service';
import { Warehouse } from '../entities';
import { ProductHistoryService } from './product-history.service';

@Injectable()
export class PrintLabelsService {
  private static readonly CHUNK_SIZE = 100;

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductItem)
    private readonly productItemRepository: Repository<ProductItem>,
    @InjectRepository(Printer)
    private readonly printerRepository: Repository<Printer>,
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
    private readonly printerIntegrationApiService: PrinterIntegrationApiService,
    private readonly productService: ProductService,
    private readonly productHistoryService: ProductHistoryService,
  ) {}

  /* ----------------------------------- Impressão ---------------------------------- */
  // * via impressora fixa
  async printProductLabel(dto: PrintProductLabelDto, username: string) {
    const { product, printer } = await this.getProductAndPrinterEntities(dto);

    await this.dataSource.transaction(async (entityManager) => {
      const printLot = await this.savePrintLot(entityManager, dto);
      const productItems = await this.saveProductItems(entityManager, dto, product, printLot);

      await this.saveProductItemsTag(entityManager, productItems);

      for (const productItem of productItems) {
        await this.productHistoryService.createHistory({
          productId: product.id,
          epc: productItem.identification,
          type: 'ENTRADA DE PRODUTO',
          warehouseId: dto.warehouseId,
          epcCreatedAt: new Date(),
          epcCreatedBy: username,
        });
      }

      await this.sendToPrinter(printer, printLot, productItems);
    });
  }

  // * via impressora portátil, que acontece somente no inventário
  async printInventoryProductLabels(dto: PrintProductLabelDto, username: string): Promise<printProductLabelDTO> {
    const product = await this.productService.getProductById(dto.productId);

    return await this.dataSource.transaction(async (entityManager) => {
      const printLot = await this.savePrintLot(entityManager, dto);

      const productItems = await this.saveProductItems(
        entityManager,
        dto,
        product,
        printLot,
        EProductItemStatus.IN_CLIENT_STOCK,
      );

      await this.saveProductItemsTag(entityManager, productItems);

      for (const productItem of productItems) {
        await this.productHistoryService.createHistory({
          productId: product.id,
          epc: productItem.identification,
          type: 'INVENTÁRIO DE PRODUTO',
          warehouseId: dto.warehouseId,
          epcCreatedAt: new Date(),
          epcCreatedBy: username,
        });
      }

      const productLabel = await this.sendToPrinterLabel(printLot, productItems);
      return { productItems, productLabel };
    });
  }

  /* ------------------------------- Reimpressão ------------------------------ */
  // * via impressora fixa
  async reprintProductLabel(dto: ReprintProductLabelDto) {
    const { product, printer } = await this.getProductAndReprinterEntities(dto);

    await this.dataSource.transaction(async (entityManager) => {
      const printLot = await this.saveReprintLot(entityManager, dto);
      const productItems = await this.getProductItemsWithExistingEpc(entityManager, dto, product, printLot);

      await this.sendToPrinter(printer, printLot, productItems);
    });
  }

  // * via impressora portátil, que acontece somente no inventário
  async reprintInventoryProductLabels(dto: ReprintProductLabelDto): Promise<printProductLabelDTO> {
    const product = await this.productService.getProductById(dto.productId);

    return await this.dataSource.transaction(async (entityManager) => {
      const printLot = await this.saveReprintLot(entityManager, dto);

      const productItems = await this.getProductItemsWithExistingEpc(entityManager, dto, product, printLot);

      const productLabel = await this.sendToPrinterLabel(printLot, productItems);

      return { productItems, productLabel };
    });
  }

  private async getProductAndReprinterEntities(dto: ReprintProductLabelDto) {
    const { warehouseId, productId, printerId } = dto;
    const [product, printer] = await Promise.all([
      this.productRepository.findOne({
        where: { id: productId },
        select: { id: true, code: true, description: true, reference: true },
      }),
      this.printerRepository.findOne({
        where: { id: printerId, isActive: true, warehouse: { id: warehouseId } },
        select: { id: true, port: true, ip: true },
      }),
    ]);

    if (!product) throw new ProductNotFoundError();
    if (!printer) throw new PrinterNotFoundError();

    return { product, printer };
  }

  private async saveReprintLot(entityManager: EntityManager, dto: ReprintProductLabelDto) {
    const printLot = await this.createReprintLot(entityManager, dto);
    return this.updatePrintLotName(entityManager, printLot);
  }

  private async createReprintLot(entityManager: EntityManager, dto: ReprintProductLabelDto) {
    const now: Date = new Date();
    const namePrefix: string = 'ELFA';
    const warehouse = await this.getWarehouseById(dto.warehouseId);

    const printLot = entityManager.create(PrintLot, {
      amount: dto.existingEpcs.length,
      generationDate: now,
      name: namePrefix,
      warehouse: warehouse,
    });
    return entityManager.save(printLot);
  }

  /* ------------------------------ Sem impressão ----------------------------- */
  async generateProductLabels(dto: PrintProductLabelDto): Promise<printProductLabelDTO> {
    const product = await this.productService.getProductById(dto.productId);

    return await this.dataSource.transaction(async (entityManager) => {
      const printLot = await this.savePrintLot(entityManager, dto);
      const productItems = await this.saveProductItems(
        entityManager,
        dto,
        product,
        printLot,
        EProductItemStatus.IN_CLIENT_STOCK,
      );
      await this.saveProductItemsTag(entityManager, productItems);
      const productLabel = productItems.map((item) => new ProductLabel(item).qrCode);
      return { productItems, productLabel };
    });
  }

  async generateInventoryProductLabels(dto: PrintProductLabelDto): Promise<printProductLabelDTO> {
    const product = await this.productService.getProductById(dto.productId);

    return await this.dataSource.transaction(async (entityManager) => {
      const printLot = await this.savePrintLot(entityManager, dto);
      const productItems = await this.saveProductItems(
        entityManager,
        dto,
        product,
        printLot,
        EProductItemStatus.IN_CLIENT_STOCK,
      );
      await this.saveProductItemsTag(entityManager, productItems);
      const productLabel = productItems.map((item) => new ProductLabel(item).qrCode);
      return { productItems, productLabel };
    });
  }

  /* ----------------------------- Private methods ---------------------------- */
  private async getProductAndPrinterEntities(dto: PrintProductLabelDto) {
    const { warehouseId, productId, printerId } = dto;
    const [product, printer] = await Promise.all([
      this.productRepository.findOne({
        where: { id: productId },
        select: { id: true, code: true, description: true, reference: true },
      }),
      this.printerRepository.findOne({
        where: { id: printerId, isActive: true, warehouse: { id: warehouseId } },
        select: { id: true, port: true, ip: true },
      }),
    ]);

    if (!product) throw new ProductNotFoundError();
    if (!printer) throw new PrinterNotFoundError();

    return { product, printer };
  }

  private async savePrintLot(entityManager: EntityManager, dto: PrintProductLabelDto) {
    const printLot = await this.createPrintLot(entityManager, dto);
    return this.updatePrintLotName(entityManager, printLot);
  }

  private async createPrintLot(entityManager: EntityManager, dto: PrintProductLabelDto) {
    const now: Date = new Date();
    const namePrefix: string = 'ELFA';
    const warehouse = await this.getWarehouseById(dto.warehouseId);

    const printLot = entityManager.create(PrintLot, {
      amount: dto.amount,
      generationDate: now,
      name: namePrefix,
      warehouse: warehouse,
    });
    return entityManager.save(printLot);
  }

  private async updatePrintLotName(entityManager: EntityManager, printLot: PrintLot) {
    const formattedPrintLotId: string = formatZeroLeft(printLot.id, 7);
    const namePrefix: string = 'ELFA';
    const name: string = `${namePrefix}${formattedPrintLotId}`;

    const updatedPrintLot = entityManager.create(PrintLot, { ...printLot, name });
    return entityManager.save(updatedPrintLot);
  }

  private async saveProductItems(
    entityManager: EntityManager,
    dto: PrintProductLabelDto,
    product: Product,
    printLot: PrintLot,
    state?: EProductItemStatus,
  ) {
    const productItems = await this.saveProductItemsWithoutEpc(entityManager, dto, product, printLot, state);

    return this.updateProductItemsWithEpc(entityManager, dto.productId, productItems);
  }

  private async saveProductItemsWithoutEpc(
    entityManager: EntityManager,
    dto: PrintProductLabelDto,
    product: Product,
    printLot: PrintLot,
    state?: EProductItemStatus,
  ) {
    const { amount, productId, lot, expirationDate, address } = dto;
    const formattedProductItems = [];

    for (let printCounter = 1; printCounter <= amount; printCounter++) {
      const temporaryEpc = (productId + printCounter).toString();
      formattedProductItems.push({
        lot,
        identification: temporaryEpc,
        expiresAt: new Date(expirationDate).toISOString().slice(0, 10),
        product,
        printLot,
        printCounter,
        address,
        status: state ? state : EProductItemStatus.IN_ELFA_STOCK,
      });
    }

    const entities: ProductItem[] = entityManager.create(ProductItem, formattedProductItems);
    return entityManager.save(entities, { chunk: PrintLabelsService.CHUNK_SIZE });
  }

  private async updateProductItemsWithEpc(
    entityManager: EntityManager,
    productId: number,
    productItems: ProductItem[],
  ) {
    const updatedFormattedProductItems = [];

    for (let i = 0; i < productItems.length; i++) {
      const productItem = productItems[i];
      const epc = encodeHexEPC(productId, productItem.id);
      updatedFormattedProductItems.push({ ...productItem, identification: epc });
    }

    const entitiesUpdated: ProductItem[] = entityManager.create(ProductItem, updatedFormattedProductItems);
    return entityManager.save(entitiesUpdated, { chunk: PrintLabelsService.CHUNK_SIZE });
  }

  private async saveProductItemsTag(entityManager: EntityManager, productItems: ProductItem[]) {
    const formattedProductItemsTag = [];

    for (let i = 0; i < productItems.length; i++) {
      const productItem = productItems[i];
      formattedProductItemsTag.push({ epc: productItem.identification, productItem: { id: productItem.id } });
    }

    const entities: ProductItemTag[] = entityManager.create(ProductItemTag, formattedProductItemsTag);
    return entityManager.save(entities, { chunk: PrintLabelsService.CHUNK_SIZE });
  }

  private async sendToPrinter(printer: Printer, printLot: PrintLot, productItems: ProductItem[]): Promise<void> {
    await this.printerIntegrationApiService.print(
      new PrinterIntegrationApiRequestModel(printer, printLot, productItems),
    );
  }

  private async getProductItemsWithExistingEpc(
    entityManager: EntityManager,
    dto: ReprintProductLabelDto,
    product: Product,
    printLot: PrintLot,
  ): Promise<ProductItem[]> {
    const productItems = await this.productItemRepository.find({
      where: { identification: In(dto.existingEpcs), product: { id: product.id } },
      relations: ['product'],
    });

    productItems.forEach((item, index) => {
      item.printLot = printLot;
      item.printCounter = index + 1;
      item.status;
    });

    const savedItems = await entityManager.save(productItems, { chunk: PrintLabelsService.CHUNK_SIZE });

    return savedItems;
  }

  private async sendToPrinterLabel(printLot: PrintLot, productItems: ProductItem[]): Promise<string[]> {
    return await this.printerIntegrationApiService.printLabel(
      new PrinterLabelIntegrationApiRequestModel(printLot, productItems),
    );
  }

  async getWarehouseById(warehouseId: number) {
    const warehouse = await this.warehouseRepository.findOne({
      where: { id: warehouseId },
      select: { id: true, cnpj: true },
    });

    return warehouse;
  }
}
