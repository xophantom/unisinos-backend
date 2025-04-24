import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';

import {
  AddProductInventoryOrderDTO,
  AddProductInventoryOrderResponse,
  CreateInventoryOrderDTO,
  CreateReversalOrderDTO,
  EOrderStatus,
  EOrderType,
  EProductItemStatus,
} from 'src/domain';
import { IElfaApiPriceItem } from 'src/domain/interfaces/elfa-api-price-items-response.interface';
import { Movement, Order, ProductItem, ProductItemDetailView, Store } from '../entities';

import { NotFoundError, OrderAlreadyExistsError } from '../errors';
import { StoreService } from './store.service';
import { PrintLabelsService } from './print-labels.service';
import { OrderProductService } from './order-product.service';
import { ElfaApiService } from './elfa-api.service';
import { ProductService } from './product.service';
import { ReverseProductDTO } from 'src/domain/dtos/reverse-product.dto';
import { ElfaApiOrderByProductViewResponseModel } from 'src/domain/models/elfa-api-orders-by-product-response.model';

@Injectable()
export class InventoryOrderService {
  private static readonly CHUNK_SIZE = 100;

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private _storeService: StoreService,
    private _printLabelsService: PrintLabelsService,
    private _orderProductService: OrderProductService,
    private _elfaApiService: ElfaApiService,
    private _productService: ProductService,
  ) {}

  // * Cria o pedido de inventário
  async createInventoryOrder(params: CreateInventoryOrderDTO): Promise<Order> {
    const store = await this._storeService.getStoreById(params.storeId);
    const code = Number(this.formatCode());
    await this.ensureOrderDoesNotExist(code);

    const inventoryOrder = await this.orderRepository.save({
      id: null,
      code,
      type: EOrderType.INVENTARIO,
      requestedAt: new Date(),
      shippedAt: new Date(),
      receivedAt: new Date(),
      store,
    });

    return inventoryOrder;
  }

  // * Cria o pedido de estorno do inventário
  async createReversalOrder(params: CreateReversalOrderDTO): Promise<Order> {
    const store = await this._storeService.getStoreById(params.storeId);
    const code = Number(this.formatCode());
    await this.ensureOrderDoesNotExist(code);

    const reversalOrder = await this.orderRepository.save({
      id: null,
      code,
      type: EOrderType.INVENTARIO,
      status: EOrderStatus.REVERSAL,
      requestedAt: new Date(),
      shippedAt: new Date(),
      receivedAt: new Date(),
      store,
    });

    return reversalOrder;
  }

  // * Adiciona produtos ao pedido de inventário com impressão
  async addProductInventoryOrder(
    params: AddProductInventoryOrderDTO,
    username: string,
  ): Promise<AddProductInventoryOrderResponse> {
    const order = await this.getInventoryOrderDetails(params.orderId);

    await this.dataSource
      .createQueryBuilder()
      .update(Order)
      .set({
        order: params.orderCode,
        status: 'INVENTARIO',
        type: params.orderType as EOrderType,
      })
      .where('SolicitacaoId = :orderId', { orderId: params.orderId })
      .execute();

    return await this.dataSource.transaction(async (entityManager) => {
      const printInventoryParams = {
        warehouseId: order.store.id,
        productId: params.product.id,
        printerId: 0,
        lot: params.product.lot,
        expirationDate: params.product.expirationDate,
        amount: params.product.quantity,
      };

      const { productItems, productLabel } = await this._printLabelsService.printInventoryProductLabels(
        printInventoryParams,
        username,
      );

      await this.saveMovements(entityManager, params.orderId, productItems);

      const productParams = {
        id: params.product.id,
        amount: params.product.quantity,
        unitCost: params.product.unitCost,
      };

      const orderProduct = await this._orderProductService.saveOrderProducts(params.orderId, productParams);

      return { orderProduct, productLabel };
    });
  }

  // * Adiciona produtos ao pedido de inventário sem impressão
  async addProductInventoryOrderWithoutPrint(
    params: AddProductInventoryOrderDTO,
  ): Promise<AddProductInventoryOrderResponse> {
    const order = await this.getInventoryOrderDetails(params.orderId);

    await this.dataSource
      .createQueryBuilder()
      .update(Order)
      .set({
        order: params.orderCode,
        status: 'INVENTARIO',
        type: params.orderType as EOrderType,
      })
      .where('SolicitacaoId = :orderId', { orderId: params.orderId })
      .execute();

    return await this.dataSource.transaction(async (entityManager) => {
      const printInventoryParams = {
        warehouseId: order.store.id,
        productId: params.product.id,
        printerId: 0,
        lot: params.product.lot,
        expirationDate: params.product.expirationDate,
        amount: params.product.quantity,
      };

      const { productItems, productLabel } =
        await this._printLabelsService.generateInventoryProductLabels(printInventoryParams);

      await this.saveMovements(entityManager, params.orderId, productItems);

      const productParams = {
        id: params.product.id,
        amount: params.product.quantity,
        unitCost: params.product.unitCost,
      };

      const orderProduct = await this._orderProductService.saveOrderProducts(params.orderId, productParams);

      return { orderProduct, productLabel };
    });
  }

  // * Realiza estorno dos produtos de um pedido inventário
  async reverseProduct(params: ReverseProductDTO): Promise<void> {
    if (params.epc) {
      // * Estorno com EPC, validando remessa e lojaDocumento
      await this.dataSource.transaction(async (entityManager) => {
        const produtoItemDetail = await entityManager
          .createQueryBuilder(ProductItemDetailView, 'productItemDetail')
          .where('productItemDetail.EPC = :epc', { epc: params.epc })
          .andWhere('productItemDetail.LojaDocumento = :lojaDocumento', { lojaDocumento: params.lojaDocumento })
          .getOne();

        if (!produtoItemDetail) {
          throw new BadRequestException(
            'Produto não encontrado, já estornado, ou não corresponde à remessa e documento da loja fornecidos.',
          );
        }

        const produtoItem = await entityManager.findOne(ProductItem, {
          where: { id: produtoItemDetail.productItemId },
        });

        if (!produtoItem || produtoItem.status === EProductItemStatus.REVERSED) {
          throw new BadRequestException('Produto não encontrado ou já estornado.');
        }

        produtoItem.status = EProductItemStatus.REVERSED;
        await entityManager.save(produtoItem);
      });
    } else if (params.produtoId && params.lote && params.quantidade) {
      // * Estorno sem EPC
      await this.dataSource.transaction(async (entityManager) => {
        const existingOrder = await entityManager
          .createQueryBuilder(ProductItemDetailView, 'productItemDetail')
          .where('productItemDetail.Remessa = :remessa', { remessa: params.remessa })
          .andWhere('productItemDetail.LojaDocumento = :lojaDocumento', { lojaDocumento: params.lojaDocumento })
          .getCount();

        if (existingOrder === 0) {
          throw new BadRequestException('Remessa não encontrada para o documento da loja fornecido.');
        }

        const allProdutoItems = await entityManager
          .createQueryBuilder(ProductItemDetailView, 'productItemDetail')
          .innerJoin(ProductItem, 'productItem', 'productItemDetail.ProdutoItemId = productItem.id')
          .where('productItemDetail.ProdutoId = :produtoId', { produtoId: params.produtoId })
          .andWhere('productItemDetail.Lote = :lote', { lote: params.lote })
          .andWhere('productItemDetail.Remessa = :remessa', { remessa: params.remessa })
          .andWhere('productItemDetail.LojaDocumento = :lojaDocumento', { lojaDocumento: params.lojaDocumento })
          .andWhere('productItem.status = :status', { status: EProductItemStatus.IN_CLIENT_STOCK })
          .orderBy('productItem.id', 'ASC')
          .getMany();

        const produtoItems = allProdutoItems.slice(0, params.quantidade);

        if (produtoItems.length < params.quantidade) {
          throw new BadRequestException(
            `Não há produtos disponíveis para estorno na quantidade fornecida. Itens disponíveis: ${produtoItems
              .map((pi) => pi.epc)
              .join(', ')}`,
          );
        }

        for (const produtoItemDetail of produtoItems) {
          const produtoItem = await entityManager.findOne(ProductItem, {
            where: { id: produtoItemDetail.productItemId },
          });

          if (!produtoItem || produtoItem.status === EProductItemStatus.REVERSED) {
            throw new BadRequestException('Produto não encontrado ou já estornado.');
          }

          produtoItem.status = EProductItemStatus.REVERSED;
          await entityManager.save(produtoItem);
        }
      });
    } else {
      throw new BadRequestException('Parâmetros inválidos para estorno.');
    }
  }

  async getInventoryOrderDetails(orderId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      relations: {
        store: true,
      },
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundError();
    }

    return order;
  }

  async getOrderShippingStatus(orderId: number) {
    const orderShipping = await this.orderRepository.findOne({
      where: {
        id: orderId,
      },
      select: {
        requestedAt: true,
        shippedAt: true,
        receivedAt: true,
      },
    });

    if (!orderShipping) {
      throw new NotFoundException();
    }

    return orderShipping;
  }

  async getOrdersByProductDetailsFromView(
    CustomerCGC: string,
    ProductCode: number,
    BatchCode: string,
  ): Promise<ElfaApiOrderByProductViewResponseModel[]> {
    const queryResult = await this.dataSource
      .createQueryBuilder(ProductItemDetailView, 'productItemDetail')
      .select([
        'productItemDetail.orderCode AS code',
        'productItemDetail.storeDocument AS storeDocument',
        'productItemDetail.RemessaInventario AS RemessaInventario',
        'productItemDetail.receivedAt AS requestedAt',
        'SUM(productItemDetail.unitCost * 1) AS totalValue',
        'COUNT(productItemDetail.productId) AS totalAmount',
        'productItemDetail.productCode AS productCode',
        'productItemDetail.lot AS lot',
        'productItemDetail.productDescription AS name',
      ])
      .where('productItemDetail.storeDocument = :CustomerCGC', { CustomerCGC })
      .andWhere('productItemDetail.productCode = :ProductCode', { ProductCode })
      .andWhere('productItemDetail.lot = :BatchCode', { BatchCode })
      .andWhere('productItemDetail.status != :status', { status: 'ESTORNADO' })
      .groupBy(
        'productItemDetail.orderCode, productItemDetail.storeDocument,productItemDetail.RemessaInventario, productItemDetail.receivedAt, productItemDetail.productCode, productItemDetail.lot, productItemDetail.productDescription',
      )
      .getRawMany();

    if (queryResult.length === 0) {
      return [];
    }

    const ordersMap = new Map<string, ElfaApiOrderByProductViewResponseModel>();

    queryResult.forEach((item) => {
      const existingOrder = ordersMap.get(item.code);

      const product = {
        code: Number(item.productCode),
        lot: item.lot,
        name: item.name,
        amount: Number(item.totalAmount),
        unitCost: Number(item.totalValue) / Number(item.totalAmount),
        serialNumbers: [null],
      };

      if (existingOrder) {
        existingOrder.products.push(product);
        existingOrder.totalAmount += 1;
        existingOrder.totalValue += Number(item.totalValue);
      } else {
        const newOrder: ElfaApiOrderByProductViewResponseModel = {
          BranchCGC: item.storeDocument,
          invoiceNumber: null,
          invoiceSeries: null,
          storeDocument: item.storeDocument,
          invoice: null,
          isCancelled: false,
          code: item.code,
          codeInventory: item.RemessaInventario,
          requestedAt: item.requestedAt,
          type: EOrderType.INVENTARIO,
          totalValue: Number(item.totalValue),
          totalAmount: Number(item.totalAmount),
          ConsignmentType: '',
          products: [product],
        };
        ordersMap.set(item.code, newOrder);
      }
    });

    return Array.from(ordersMap.values());
  }

  /* ----------------------------- Private methods ---------------------------- */
  private formatCode(): string {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const hour = String(date.getHours()).padStart(2, '0');
    const minut = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}${hour}${minut}${seconds}`;
  }

  private async getSmallerPriceProduct(priceList: Store, productCode: string): Promise<IElfaApiPriceItem> {
    const products = await this._elfaApiService.listBookItems(priceList, productCode);
    const smallerPriceProduct = await products.reduce(
      (smaller, currentProduct) => (currentProduct.Price < smaller.Price ? currentProduct : smaller),
      products[0],
    );

    return smallerPriceProduct;
  }

  private async ensureOrderDoesNotExist(orderCode: number) {
    const alreadyExists = await this.orderRepository.findOneBy({ code: orderCode });
    if (alreadyExists) {
      throw new OrderAlreadyExistsError();
    }
  }

  async saveMovements(entityManager: EntityManager, orderId: number, productItems: ProductItem[]) {
    const formattedMovements = productItems.map(({ id }) => ({
      productItem: { id },
      order: { id: orderId },
    }));
    const movementEntities = entityManager.create(Movement, formattedMovements);
    return entityManager.save(movementEntities, { chunk: InventoryOrderService.CHUNK_SIZE });
  }
}
