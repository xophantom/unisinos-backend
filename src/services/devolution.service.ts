import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import {
  ImportOrderDto,
  ImportWarehouseOrderDetailsDto,
  ElfmedApiDevolutionRequestModel,
  ElfaApiOrderResponseModel,
  ElfmedApiDevolutionRequestModelWithoutZeroLeft,
  ElfmedApiDevolutionRequestModelByBranchCGC,
  ElfaApiOrderProductModel,
} from '../domain';
import { Product, ProductItem, Devolution, DevolutionProductIten, Warehouse } from '../entities';
import {
  OrderAlreadyExistsError,
  OrderNotFoundError,
  DevolutionShipmentTypeError,
  MissingBatchCodeError,
  WarehouseNotFoundError,
} from '../errors';
import { ElfaApiService } from './elfa-api.service';
import { OrderService } from './order.service';
import { WarehouseService } from './warehouse.service';
import { StoreService } from './store.service';
import { ConsignmentType } from 'src/domain/enums/consigment-type.enum';
import { applyProductConversion } from 'src/tools/productConversion';

@Injectable()
export class DevolutionService {
  constructor(
    @InjectRepository(Product)
    public productRepository: Repository<Product>,
    @InjectRepository(Devolution)
    private readonly devolutionRepository: Repository<Devolution>,
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
    private readonly warehouseService: WarehouseService,
    private readonly elfaApiService: ElfaApiService,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
    private readonly storeSerice: StoreService,
  ) {}

  // --- Public methods ---
  async getDevolutionByNfe(nfe: string): Promise<Devolution> {
    const devolution = await this.devolutionRepository
      .createQueryBuilder('devolution')
      .select()
      .where('devolution.nfe = :nfe', { nfe })
      .getRawOne();

    return devolution;
  }

  async ensureDevolutionDoesNotExist(nfe: string) {
    const alreadyExists = await this.devolutionRepository.findOneBy({ nfe });

    if (alreadyExists) {
      throw new OrderAlreadyExistsError();
    }
  }

  async ensureDevolutionExists(nfe: string): Promise<boolean> {
    const exists = await this.devolutionRepository.findOneBy({ nfe });

    return !!exists;
  }

  async importWarehouseOrderDevolution(
    warehouseId: number,
    invoiceNumber: number,
    invoiceSeries: number,
    storeDocument: string,
    dto: ImportWarehouseOrderDetailsDto,
  ) {
    const { order, store } = await this.getWarehouseDevolution(
      warehouseId,
      invoiceNumber,
      invoiceSeries,
      storeDocument,
    );

    order.products = await applyProductConversion(order.products, this.productRepository);
    order.totalAmount = order.products.reduce((sum, product) => sum + product.amount, 0);

    return this.orderService.importDevolution(ImportOrderDto.fromElfaApiOrderResponse(order, dto, store, warehouseId));
  }

  async getWarehouseDevolution(
    warehouseId: number,
    invoiceNumber: number,
    invoiceSeries: number,
    storeDocument: string,
  ) {
    await this.warehouseService.getWarehouseById(warehouseId);
    const order = await this.getDevolutionFromExternalApi(storeDocument, invoiceNumber, invoiceSeries);
    await this.addProductName(order);
    this.checkConsignmentTypeDevolution(order.ConsignmentType);
    const store = await this.storeSerice.getStoreByDocument(order.storeDocument);

    return { order, store };
  }

  async listWarehouseDevolutions(warehouseId: number, page?: number, pageSize?: number) {
    const warehouse = await this.warehouseService.getWarehouseById(warehouseId);
    const { total, items } = await this.getDevolutionsFromExternalApi(warehouse.cnpj, page, pageSize);

    const orders = await Promise.all(
      items.map(async (order) => {
        await this.addProductName(order);
        return { order };
      }),
    );

    return {
      total_items: total,
      page: page || 1,
      pageSize: pageSize || 10,
      orders,
    };
  }

  async saveDevolution(entityManager: EntityManager, orderToImport: ImportOrderDto): Promise<Devolution> {
    const entityDevolution = entityManager.create(Devolution, {
      id: null,
      nfe: String(orderToImport.code),
      warehouse: orderToImport.warehouseId,
      store: orderToImport.store.id,
      devolutionDate: new Date(),
      invoiceEmission: orderToImport.order.invoiceEmission,
      customerCGC: orderToImport.order.customerCGC,
      consignmentType: orderToImport.order.ConsignmentType
        ? orderToImport.order.ConsignmentType
        : 'CONSIGNADO - RETORNO',
    });

    const savedEntity = await entityManager.save(entityDevolution);
    return savedEntity;
  }

  async saveItemDevolutionProduct(
    entityManager: EntityManager,
    idDevolution: number,
    productItems: ProductItem[],
    orderProducts: ElfaApiOrderProductModel[],
  ): Promise<void> {
    const entitiesToInsert = productItems.map((productItem) => {
      const orderProd = orderProducts.find(
        (prod) => prod.code === productItem.product.code && prod.lot === productItem.lot,
      );
      return {
        id: null,
        devolution: idDevolution,
        productIten: productItem.id,
        originalInvoiceNumber: orderProd?.originalInvoiceNumber,
        originalInvoiceSeries: orderProd?.originalInvoiceSeries,
        originalOrderNumber: orderProd?.originalOrderNumber,
      };
    });

    const productsItens = entityManager.create(DevolutionProductIten, entitiesToInsert);
    await entityManager.save(productsItens);
  }

  async getWarehouseDevolutions(
    warehouseId: number,
    invoiceNumber?: number,
    invoiceSeries?: number,
    storeDocument?: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<
    | {
        warehouseName: string;
        warehouseId: number;
        warehouseCode: number;
        invoiceNumber: string;
        invoiceSeries: string;
        totalValue: number;
        totalAmount: number;
        status: string;
      }
    | {
        total_items: number;
        page: number;
        pageSize: number;
        orders: {
          warehouseName: string;
          warehouseId: number;
          warehouseCode: number;
          invoiceNumber: string;
          invoiceSeries: string;
          totalValue: number;
          totalAmount: number;
          status: string;
        }[];
      }
  > {
    const transformOrder = async (orderData: {
      order: ElfaApiOrderResponseModel;
    }): Promise<{
      warehouseName: string;
      warehouseId: number;
      warehouseCode: number;
      invoiceNumber: string;
      invoiceSeries: string;
      totalValue: number;
      totalAmount: number;
      status: string;
    }> => {
      const warehouse = await this.getWarehouseByDocument(orderData.order.BranchCGC);
      const existsInDb = await this.ensureDevolutionExists(orderData.order.code);
      const status = existsInDb ? 'CONCLUIDO' : 'PENDENTE';

      return {
        warehouseName: warehouse.name,
        warehouseId: warehouse.id,
        warehouseCode: warehouse.code,
        invoiceNumber: orderData.order.invoiceNumber,
        invoiceSeries: orderData.order.invoiceSeries,
        totalValue: orderData.order.totalValue,
        totalAmount: orderData.order.totalAmount,
        status,
      };
    };

    if (invoiceNumber && invoiceSeries && storeDocument) {
      const order = await this.getWarehouseDevolution(warehouseId, invoiceNumber, invoiceSeries, storeDocument);
      return transformOrder(order);
    }

    const {
      total_items,
      page: currentPage,
      pageSize: currentPageSize,
      orders,
    } = await this.listWarehouseDevolutions(warehouseId, page, pageSize);
    const transformedOrders = await Promise.all(orders.map((order) => transformOrder(order)));
    return { total_items, page: currentPage, pageSize: currentPageSize, orders: transformedOrders };
  }

  // --- Private methods ---

  private async getWarehouseByDocument(branchCGC: string): Promise<Warehouse | null> {
    const warehouse = await this.warehouseRepository.findOne({
      where: { cnpj: branchCGC },
    });

    if (!warehouse) {
      throw new WarehouseNotFoundError();
    }

    return warehouse;
  }

  private checkConsignmentTypeDevolution(batchCode: string) {
    const allowedOrderValues = [ConsignmentType.RETORNO, ConsignmentType.RETORNO_SIMBOLICO] as string[];

    if (allowedOrderValues.indexOf(batchCode) === -1) {
      throw new DevolutionShipmentTypeError();
    }
  }

  private async getDevolutionFromExternalApi(storeDocument: string, invoiceNumber: number, invoiceSeries: number) {
    try {
      const [devolution] = await this.elfaApiService.getDevolution(
        new ElfmedApiDevolutionRequestModel(storeDocument, invoiceNumber, invoiceSeries),
      );
      if (!devolution) {
        throw new OrderNotFoundError();
      }
      return devolution;
    } catch (error) {
      if (error instanceof MissingBatchCodeError) {
        throw new MissingBatchCodeError();
      }

      try {
        const [devolution] = await this.elfaApiService.getDevolutionWithoutZeroLeft(
          new ElfmedApiDevolutionRequestModelWithoutZeroLeft(storeDocument, invoiceNumber, invoiceSeries),
        );

        if (!devolution) {
          throw new OrderNotFoundError();
        }

        return devolution;
      } catch (secondError) {
        throw new OrderNotFoundError();
      }
    }
  }

  private async getDevolutionsFromExternalApi(
    branchDocument: string,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<{ total: number; items: ElfaApiOrderResponseModel[] }> {
    try {
      const devolutions = await this.elfaApiService.getDevolution(
        new ElfmedApiDevolutionRequestModelByBranchCGC(branchDocument),
      );

      if (!devolutions || devolutions.length === 0) {
        throw new OrderNotFoundError();
      }

      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const filtered = devolutions.filter((order) => {
        const { invoiceEmission } = order;
        if (!invoiceEmission || invoiceEmission.length !== 8) {
          return false;
        }
        const year = Number(invoiceEmission.substring(0, 4));
        const month = Number(invoiceEmission.substring(4, 6)) - 1;
        const day = Number(invoiceEmission.substring(6, 8));
        const orderDate = new Date(year, month, day);
        return orderDate >= threeDaysAgo;
      });

      const total = filtered.length;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginated = filtered.slice(startIndex, endIndex);

      if (paginated.length === 0) {
        throw new OrderNotFoundError();
      }

      return { total, items: paginated };
    } catch (error) {
      throw new OrderNotFoundError();
    }
  }

  private async addProductName(devolution: ElfaApiOrderResponseModel) {
    if (!devolution.products || !Array.isArray(devolution.products)) {
      devolution.products = [];
    }

    const productPromises = devolution.products.map(async (product) => {
      const productFound = await this.productRepository.findOne({
        where: { code: product.code },
      });
      if (productFound) {
        product.name = productFound.description;
      }
    });

    await Promise.all(productPromises);
  }
}
