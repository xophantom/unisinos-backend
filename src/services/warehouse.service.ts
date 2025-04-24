/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Not, Repository } from 'typeorm';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import {
  ElfaApiOrdersRequestModel,
  ElfaApiStocksRequestModel,
  ImportOrderDto,
  ImportWarehouseOrderDetailsDto,
} from '../domain';
import { Printer, Product, Warehouse } from '../entities';
import {
  BarcodeError,
  OrderCancelledError,
  OrderMissingStoreDocumentError,
  OrderNotFoundError,
  ProductNotFoundError,
  RequestedReceiptOperationError,
  WarehouseNotFoundError,
} from '../errors';
import { ElfaApiService } from './elfa-api.service';
import { decodeBarcode } from '../tools';
import { OrderService } from './order.service';
import { StoreService } from './store.service';
import { ConsignmentType } from 'src/domain/enums/consigment-type.enum';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
    @InjectRepository(Printer)
    private readonly printerRepository: Repository<Printer>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly elfaApiService: ElfaApiService,
    private readonly storeService: StoreService,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
  ) {}

  // --- Public methods ---
  async listWarehouses(page: number, pageSize: number) {
    return this.warehouseRepository.find({
      select: {
        id: true,
        code: true,
        name: true,
      },
      order: {
        id: 'ASC',
      },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });
  }

  async listWarehousePrinters(warehouseId: number, page: number, pageSize: number) {
    return this.printerRepository.find({
      select: {
        id: true,
        description: true,
      },
      where: {
        warehouse: {
          id: warehouseId,
        },
        isActive: true,
      },
      order: {
        id: 'ASC',
      },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });
  }

  async listWarehouseProductStocks(warehouseId: number, code: string) {
    if (code.length <= 7) {
      return this.listWarehouseProductStocksByProductCode(warehouseId, Number(code));
    }
    return this.listWarehouseProductStocksByBarcode(warehouseId, code);
  }

  async listWarehouseProductStocksByDescription(warehouseId: number, description?: string) {
    return this.listWarehouseProductStocksByProductDescription(warehouseId, description);
  }

  async getWarehouseOrderDetails(warehouseId: number, orderCode: number) {
    const warehouse = await this.getWarehouseById(warehouseId);
    const order = await this.getOrderFromExternalApi(warehouse.cnpj, orderCode);
    this.checkConsignmentTypeOrder(order.ConsignmentType);
    const store = await this.storeService.getStoreByDocument(order.storeDocument);

    order.products = await this.applyProductConversion(order.products);
    order.totalAmount = order.products.reduce((sum, product) => sum + product.amount, 0);

    return { order, store };
  }

  private checkConsignmentTypeOrder(batchCode: string) {
    const allowedOrderValues = [
      ConsignmentType.REMESSA_ELETIVO,
      ConsignmentType.REMESSA_FIXO,
      ConsignmentType.AJUSTE_C1,
      ConsignmentType.AJUSTE_C5,
    ] as string[];

    if (allowedOrderValues.indexOf(batchCode) === -1) {
      throw new RequestedReceiptOperationError();
    }
  }

  async importWarehouseOrderDetails(warehouseId: number, orderCode: number, dto: ImportWarehouseOrderDetailsDto) {
    const { order, store } = await this.getWarehouseOrderDetails(warehouseId, orderCode);
    const importOrderDto = ImportOrderDto.fromElfaApiOrderResponse(order, dto, store, warehouseId);

    return this.orderService.importOrder(importOrderDto);
  }

  async getWarehouseById(warehouseId: number) {
    const warehouse = await this.warehouseRepository.findOne({ where: { id: warehouseId }, select: { cnpj: true } });
    if (!warehouse) throw new WarehouseNotFoundError();
    return warehouse;
  }

  async getWarehouseOrders(warehouseId: number, page: number = 1, pageSize: number = 10, orderNumber?: number) {
    const warehouse = await this.getWarehouseById(warehouseId);

    const orders = await this.elfaApiService.getOrdersAdmin(
      new ElfaApiOrdersRequestModel(warehouse.cnpj, orderNumber === undefined ? 0 : orderNumber),
    );

    const storeCache = new Map<string, any>();

    const transformedOrders = await Promise.all(
      orders.map(async (order) => {
        try {
          let store = storeCache.get(order.storeDocument);
          if (!store) {
            try {
              store = await this.storeService.getStoreByDocument(order.storeDocument);
              storeCache.set(order.storeDocument, store);
            } catch (error) {
              return null;
            }
          }

          const existsInDb = await this.orderService.checkOrderExists(Number(order.code));
          const status = existsInDb ? 'CONCLUIDO' : 'PENDENTE';

          return {
            warehouseName: warehouse.name,
            warehouseId: warehouse.id,
            warehouseCode: warehouse.code,
            orderNumber: order.code,
            totalValue: order.totalValue,
            totalAmount: order.totalAmount,
            status,
            storeName: store.client.name,
            storeCode: store.code,
            invoiceNumber: order.invoiceNumber,
            invoiceSeries: order.invoiceSeries,
          };
        } catch (error) {
          console.error(`Erro ao processar pedido ${order.code}:`, error);
          return null;
        }
      }),
    );

    const validOrders = transformedOrders.filter((order) => order !== null);

    return {
      total_items: validOrders.length,
      page,
      pageSize,
      orders: validOrders,
    };
  }

  // --- Private methods ---
  private async populate(warehouseId: number) {
    const warehouse = await this.warehouseRepository.findOne({ where: { id: warehouseId }, select: { cnpj: true } });
    if (!warehouse) throw new WarehouseNotFoundError();
    return warehouse;
  }

  private async getOrderFromExternalApi(warehouseCNPJ: string, orderCode: number) {
    const [order] = await this.elfaApiService.getOrders(new ElfaApiOrdersRequestModel(warehouseCNPJ, orderCode));
    if (!order) throw new OrderNotFoundError();
    if (!order.storeDocument) throw new OrderMissingStoreDocumentError();
    if (order.isCancelled) throw new OrderCancelledError();
    return order;
  }

  private async listWarehouseProductStocksByProductCode(warehouseId: number, productCode: number) {
    return this.getProductAndStocksByCode(warehouseId, { code: productCode });
  }

  private async listWarehouseProductStocksByBarcode(warehouseId: number, barcode: string) {
    const { gtin } = decodeBarcode(barcode);

    if (!gtin) throw new BarcodeError();

    try {
      const data = await this.getProductAndStocks(warehouseId, { ean: gtin });
      return data;
    } catch (error) {
      if (gtin.startsWith('0')) {
        const gtinWithoutLeadingZero = gtin.slice(1);
        try {
          const data = await this.getProductAndStocks(warehouseId, { ean: gtinWithoutLeadingZero });
          return data;
        } catch (secondError) {
          throw new ProductNotFoundError();
        }
      }
      throw error;
    }
  }

  private async getProductAndStocksByCode(warehouseId: number, condition: FindOptionsWhere<Product>) {
    const [warehouse, product] = await Promise.all([
      this.warehouseRepository.findOne({ where: { id: warehouseId }, select: { cnpj: true } }),
      this.productRepository.findOne({
        where: condition,
        select: { id: true, code: true, description: true, technicalName: true, ean: true, unit: true },
      }),
    ]);

    if (!warehouse) throw new WarehouseNotFoundError();
    if (!product) throw new ProductNotFoundError();

    const stocks = await this.elfaApiService.getStocks(new ElfaApiStocksRequestModel(warehouse.cnpj, product.code));

    return { product, stocks };
  }

  private async getProductAndStocks(warehouseId: number, condition: FindOptionsWhere<Product>) {
    const [warehouse, mainProduct] = await Promise.all([
      this.warehouseRepository.findOne({ where: { id: warehouseId }, select: { cnpj: true } }),
      this.productRepository.findOne({
        where: condition,
        select: {
          id: true,
          code: true,
          description: true,
          technicalName: true,
          ean: true,
          unit: true,
          canConvert: true,
        },
      }),
    ]);

    if (!warehouse) throw new WarehouseNotFoundError();
    if (!mainProduct) throw new ProductNotFoundError();

    let similarProducts: Product[] = [];
    if (mainProduct.canConvert && mainProduct.conversionType === 'M' && mainProduct.conversionFactor === 1) {
      const similarDescription = this.extractSimilarDescription(mainProduct.description);
      if (similarDescription) {
        similarProducts = await this.productRepository.find({
          where: {
            description: Like(`%${similarDescription}%`),
            ean: mainProduct.ean ? Not(mainProduct.ean) : undefined,
          },
          select: { id: true, code: true, description: true, technicalName: true, ean: true, unit: true },
        });
      }
    }

    const allProducts = [mainProduct, ...similarProducts];

    const results = await Promise.all(
      allProducts.map(async (prod) => {
        const stocks = await this.elfaApiService.getStocks(new ElfaApiStocksRequestModel(warehouse.cnpj, prod.code));
        return { product: prod, stocks };
      }),
    );

    return results;
  }

  private async applyProductConversion(products: any[]): Promise<any[]> {
    const productCodes = products.map((product) => product.code);
    const productEntities = await this.productRepository.find({
      where: { code: In(productCodes) },
      select: ['code', 'description', 'conversionFactor', 'conversionType', 'canConvert'],
    });

    return products.map((product) => {
      const productEntity = productEntities.find((p) => p.code === product.code);

      if (productEntity) {
        const { conversionFactor, conversionType, canConvert } = productEntity;

        if (canConvert && conversionType === 'D' && conversionFactor) {
          const convertedAmount = product.amount / conversionFactor;
          if (convertedAmount > 0 && Number.isInteger(convertedAmount)) {
            product.amount = convertedAmount;
          }
        }
      }
      return product;
    });
  }

  private extractSimilarDescription(description: string): string | null {
    const regex = /(\d+[A-Z]*\s*-\s*[A-Z]+)/i;
    const match = description.match(regex);
    if (match) {
      return match[1].trim();
    }
    return null;
  }

  private async listWarehouseProductStocksByProductDescription(warehouseId: number, description: string) {
    return this.getProductAndStocksByCode(warehouseId, { description: Like(`%${description}%`) });
  }
}
