import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, In, Repository } from 'typeorm';
import { Divergence, Order, OrderProduct, ProductItem, Store, Warehouse } from '../entities';
import { ElfaApiService } from './elfa-api.service';
import {
  ClientDivergenceNotFoundError,
  DevolutionDivergenceMatch,
  DevolutionNotFound,
  DivergenceNotFound,
  MissingParams,
  OrderDivergenceNotFound,
  OrderNullType,
  WarehouseNotFoundError,
} from 'src/errors';
import { GroupedDivergence } from 'src/domain/interfaces/divergences';
import {
  CustomElfaApiOrdersRequestModel,
  ElfaApiOrderResponseModel,
  ElfmedApiDevolutionRequestModelWithoutDocument,
  EOrderType,
  EProductItemStatus,
  ImportOrderDto,
} from 'src/domain';
import { mapToEOrderType } from 'src/tools/map-order-type';
import { ProductService } from './product.service';
import { MovementService } from './movements.service';

@Injectable()
export class DivergenceService {
  private static readonly CHUNK_SIZE = 100;

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(ProductItem)
    private readonly productItemRepository: Repository<ProductItem>,

    @InjectRepository(Divergence)
    private readonly divergenceRepository: Repository<Divergence>,

    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,

    private readonly elfaApiService: ElfaApiService,
    private readonly productService: ProductService,
    private readonly movementService: MovementService,
  ) {}

  async getDivergencesByStoreId(storeId: number, type?: string) {
    const allDivergences = await this.fetchAllDivergences(storeId, type);

    if (!allDivergences.length) {
      throw new DivergenceNotFound();
    }

    const groupedDivergences = this.groupDivergences(allDivergences);

    return this.mapGroupedDivergences(groupedDivergences, storeId);
  }

  async transferBetweenClients(
    divergenceIds: number[],
    orderCode?: number,
    invoiceNumber?: number,
    invoiceSeries?: number,
  ): Promise<void> {
    if (!orderCode && !invoiceNumber && !invoiceSeries) {
      throw new MissingParams();
    }

    const divergences = await this.fetchDivergences(divergenceIds);

    const existingOrder = await this.findExistingOrder(orderCode, invoiceNumber, invoiceSeries);

    if (existingOrder) {
      const CustomerCGC = await this.getCustomerCGCFromDivergences(divergenceIds);

      const externalOrder = await this.findExternalOrder(CustomerCGC, orderCode, invoiceNumber, invoiceSeries);

      if (!externalOrder.type) {
        throw new OrderNullType();
      }

      await this.dataSource.transaction(async (entityManager) => {
        const divergenceProductIds = await this.fetchDivergenceProductIds(divergenceIds);

        await this.addProductsToExistingOrder(entityManager, existingOrder.id, divergenceIds, externalOrder);

        await this.movementService.saveMovements(
          entityManager,
          existingOrder.id,
          divergences.map((d) => d.productItem),
        );

        await this.updateProductItemsStatus(entityManager, divergenceProductIds, EProductItemStatus.IN_CLIENT_STOCK);
      });

      return;
    }

    const CustomerCGC = divergences[0].store.document;
    if (!CustomerCGC) {
      throw new ClientDivergenceNotFoundError();
    }

    const externalOrder = await this.findExternalOrder(CustomerCGC, orderCode, invoiceNumber, invoiceSeries);
    const warehouse = await this.getWarehouseByDocument(externalOrder.BranchCGC);
    const importOrderDto = this.buildImportOrderDto(externalOrder, divergences[0].store, warehouse.id);

    await this.processTransaction(importOrderDto, divergences);
  }

  async transferFromStock(
    divergenceIds: number[],
    orderCode?: number,
    invoiceNumber?: number,
    invoiceSeries?: number,
  ): Promise<void> {
    if (!orderCode && !invoiceNumber && !invoiceSeries) {
      throw new MissingParams();
    }

    const existingOrder = await this.findExistingOrder(orderCode, invoiceNumber, invoiceSeries);

    if (existingOrder) {
      const CustomerCGC = await this.getCustomerCGCFromDivergences(divergenceIds);
      const externalOrder = await this.findExternalOrder(CustomerCGC, orderCode, invoiceNumber, invoiceSeries);

      if (!externalOrder.type) {
        throw new OrderNullType();
      }

      await this.dataSource.transaction(async (entityManager) => {
        const divergenceProductIds = await this.fetchDivergenceProductIds(divergenceIds);

        await this.addProductsToExistingOrder(entityManager, existingOrder.id, divergenceIds, externalOrder);

        await this.movementService.saveMovements(
          entityManager,
          existingOrder.id,
          divergences.map((d) => d.productItem),
        );

        await this.updateProductItemsStatus(entityManager, divergenceProductIds, EProductItemStatus.IN_CLIENT_STOCK);
      });

      return;
    }

    const divergences = await this.fetchDivergences(divergenceIds);

    const CustomerCGC = divergences[0].store.document;
    if (!CustomerCGC) {
      throw new ClientDivergenceNotFoundError();
    }

    const externalOrder = await this.findExternalOrder(CustomerCGC, orderCode, invoiceNumber, invoiceSeries);
    const warehouse = await this.getWarehouseByDocument(externalOrder.BranchCGC);
    const importOrderDto = this.buildImportOrderDto(externalOrder, divergences[0].store, warehouse.id);

    await this.processTransaction(importOrderDto, divergences);
  }

  /* ----------------------------- Private Methods ---------------------------- */

  private async fetchAllDivergences(storeId: number, type?: string) {
    const query = this.divergenceRepository
      .createQueryBuilder('divergence')
      .leftJoinAndSelect('divergence.productItem', 'productItem')
      .leftJoinAndSelect('productItem.product', 'product')
      .where('divergence.storeId = :storeId', { storeId })
      .andWhere('divergence.status = :status', { status: false });

    if (type) {
      query.andWhere('divergence.type = :type', { type });
    }

    return await query.getMany();
  }

  private groupDivergences(allDivergences: Divergence[]): Record<string, GroupedDivergence> {
    return allDivergences.reduce<Record<string, GroupedDivergence>>((acc, divergence) => {
      const key = `${divergence.type}-${divergence.productItem.product.id}-${divergence.productItem.lot}`;

      if (!acc[key]) {
        acc[key] = {
          divergenceIds: [],
          type: divergence.type,
          productCode: divergence.productItem.product.code,
          productLot: divergence.productItem.lot,
          quantity: 0,
          productExpirationDate: divergence.productItem.expiresAt,
          productDescription: divergence.productItem.product.description,
          originStoreId: divergence.originStoreId,
          createdAt: divergence.createdAt,
          concludedAt: divergence.concludedAt,
        };
      }

      acc[key].divergenceIds.push(divergence.id);
      acc[key].quantity += 1;

      return acc;
    }, {});
  }

  private mapGroupedDivergences(groupedDivergences: Record<string, GroupedDivergence>, storeId: number) {
    return Object.values(groupedDivergences).map((group) => ({
      divergenceId: group.divergenceIds,
      storeId,
      type: group.type,
      productCode: group.productCode,
      productLot: group.productLot,
      productExpirationDate: group.productExpirationDate,
      productDescription: group.productDescription,
      quantity: group.quantity,
      originStoreId: group.originStoreId,
      createdAt: group.createdAt,
      concludedAt: group.concludedAt,
    }));
  }

  /* ---------------------------------- Transfer --------------------------------- */

  private async findExistingOrder(orderCode?: number, invoiceNumber?: number, invoiceSeries?: number) {
    return this.orderRepository.findOne({
      where: orderCode
        ? { code: orderCode }
        : {
            invoiceNumber,
            invoiceSeries,
          },
    });
  }

  private async fetchDivergences(divergenceIds: number[]) {
    const divergences = await this.divergenceRepository.find({
      where: { id: In(divergenceIds) },
      relations: ['store', 'store.client', 'productItem', 'productItem.product'],
    });

    if (divergences.length !== divergenceIds.length) {
      throw new DivergenceNotFound();
    }

    return divergences;
  }

  private async findExternalOrder(
    CustomerCGC: string,
    orderCode?: number,
    invoiceSeries?: number,
    invoiceNumber?: number,
  ) {
    const apiRequest = new CustomElfaApiOrdersRequestModel(CustomerCGC, orderCode, invoiceSeries, invoiceNumber);

    const externalOrders = await this.elfaApiService.getOrders(apiRequest);

    if (!externalOrders.length) {
      throw new OrderDivergenceNotFound();
    }

    return externalOrders[0];
  }

  private buildImportOrderDto(
    externalOrder: ElfaApiOrderResponseModel,
    store: Store,
    warehouseId: number,
  ): ImportOrderDto {
    return ImportOrderDto.fromElfaApiOrderResponse(externalOrder, { products: [] }, store, warehouseId);
  }

  private async processTransaction(importOrderDto: ImportOrderDto, divergences: Divergence[]) {
    await this.dataSource.transaction(async (entityManager) => {
      const savedOrderId = await this.saveOrder(entityManager, importOrderDto);

      const productCodes = divergences.map((divergence) => divergence.productItem.product.code);
      const divergenceProductIds = divergences.map((divergence) => divergence.productItem.id);

      await this.saveOrderProducts(entityManager, importOrderDto, savedOrderId, productCodes, divergences);

      await this.movementService.saveMovements(
        entityManager,
        savedOrderId,
        divergences.map((d) => d.productItem),
      );

      await this.updateProductItemsStatus(entityManager, divergenceProductIds, EProductItemStatus.IN_CLIENT_STOCK);
    });
  }

  private async saveOrder(entityManager: EntityManager, orderToImport: ImportOrderDto): Promise<number> {
    const { store, requestedAt, armazemId, username } = orderToImport;
    const receivedAt = store.isOnline ? null : new Date();
    const shippedAt = new Date();
    const code = Number(orderToImport.code);
    const invoiceNumber = Number(orderToImport.order.invoiceNumber);
    const invoiceSeries = Number(orderToImport.order.invoiceSeries);
    const sellerName = orderToImport.products[0].sellerName;
    const patientName = orderToImport.patientName;

    const opDateStr = orderToImport.operationDate;
    let formattedOperationDate: Date | null = null;
    if (opDateStr) {
      formattedOperationDate = new Date(
        Number(opDateStr.slice(0, 4)),
        Number(opDateStr.slice(4, 6)) - 1,
        Number(opDateStr.slice(6)),
      );
    }

    const lastWord = orderToImport.type ? orderToImport.type.split(' ').pop() : EOrderType.FIXED;
    if (!lastWord) throw new Error('Type inválido ou vazio');
    const type = mapToEOrderType(lastWord);

    const entity = entityManager.create(Order, {
      code,
      type,
      requestedAt,
      shippedAt,
      receivedAt,
      store,
      warehouse: { id: armazemId },
      username,
      createdAt: new Date(),
      invoiceNumber,
      invoiceSeries,
      sellerName,
      patientName,
      operationDate: formattedOperationDate,
    });
    const savedOrder = await entityManager.save(entity);

    return savedOrder.id;
  }

  private async saveOrderProducts(
    entityManager: EntityManager,
    orderToImport: ImportOrderDto,
    orderId: number,
    productCodes: number[],
    divergences: Divergence[],
  ) {
    const uniqueProductCodes = [...new Set(productCodes)];
    const products = await this.productService.getProductsByCodes(uniqueProductCodes);

    const formattedOrderProducts = products
      .filter((product) => {
        const match = orderToImport.products?.find((p) => p.code === product.code);
        return !!match;
      })
      .map(({ id, code }) => {
        const productMatch = orderToImport.products?.find((p) => p.code === code);

        if (!productMatch) {
          throw new Error(`Product with code ${code} not found in orderToImport.products`);
        }

        const quantityFromDivergences = divergences.filter(
          (divergence) => divergence.productItem.product.code === code,
        ).length;

        const amount = quantityFromDivergences || 1;
        const unitCost = productMatch.unitCost;

        return { amount, unitCost, product: { id }, order: { id: orderId } };
      });

    const entities = entityManager.create(OrderProduct, formattedOrderProducts);
    return entityManager.save(entities, { chunk: DivergenceService.CHUNK_SIZE });
  }

  private async getWarehouseByDocument(branchCGC: string): Promise<Warehouse | null> {
    const warehouse = await this.warehouseRepository.findOne({
      where: { cnpj: branchCGC },
    });

    if (!warehouse) {
      throw new WarehouseNotFoundError();
    }

    return warehouse;
  }

  private async updateProductItemsStatus(entityManager: EntityManager, ids: number[], status: EProductItemStatus) {
    if (ids.length > 0) {
      await entityManager.update(ProductItem, { id: In(ids) }, { status });
    }
  }

  private async addProductsToExistingOrder(
    entityManager: EntityManager,
    orderId: number,
    divergenceIds: number[],
    externalOrder: ElfaApiOrderResponseModel,
  ): Promise<void> {
    const divergences = await this.fetchDivergences(divergenceIds);

    const formattedOrderProducts = divergences.map((divergence) => {
      const productItem = divergence.productItem;
      const productMatch = externalOrder.products.find(
        (extProduct) => extProduct.code === productItem.product.code && extProduct.lot === productItem.lot,
      );

      if (!productMatch) {
        throw new Error(
          `Produto ${productItem.product.code} com lote ${productItem.lot} não encontrado no pedido externo.`,
        );
      }

      return {
        amount: 1,
        unitCost: productMatch.unitCost,
        product: { id: productItem.product.id },
        order: { id: orderId },
      };
    });

    const entities = entityManager.create(OrderProduct, formattedOrderProducts);
    await entityManager.save(entities, { chunk: 50 });
  }

  private async fetchDivergenceProductIds(divergenceIds: number[]): Promise<number[]> {
    const divergences = await this.fetchDivergences(divergenceIds);
    return divergences.map((d) => d.productItem.id);
  }

  private async getCustomerCGCFromDivergences(divergenceIds: number[]): Promise<string> {
    const divergences = await this.fetchDivergences(divergenceIds);
    if (!divergences[0]?.store?.document) {
      console.error('CGC do cliente não encontrado nas divergências.');
      throw new Error('CGC do cliente não encontrado.');
    }
    return divergences[0].store.document;
  }

  private async validateDevolutionOrder(
    invoiceNumber: number,
    invoiceSeries: number,
    divergenceIds: number[],
  ): Promise<ElfaApiOrderResponseModel> {
    const devolutionRequest = new ElfmedApiDevolutionRequestModelWithoutDocument(invoiceNumber, invoiceSeries);

    const devolutionOrders = await this.elfaApiService.getDevolutionWithoutDocument(devolutionRequest);

    if (!devolutionOrders.length) {
      throw new DevolutionNotFound();
    }

    const divergences = await this.fetchDivergences(divergenceIds);

    const matchingProducts = divergences.filter((divergence) =>
      devolutionOrders.some((order) =>
        order.products.some(
          (product) =>
            product.code === divergence.productItem.product.code && product.lot === divergence.productItem.lot,
        ),
      ),
    );

    if (matchingProducts.length !== divergences.length) {
      throw new DevolutionDivergenceMatch();
    }

    return devolutionOrders[0];
  }
}
