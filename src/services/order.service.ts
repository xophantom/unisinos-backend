import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

import {
  BadRequestError,
  InvalidBatchCodeError,
  NotFoundError,
  OrderAlreadyExistsError,
  OrderProductIdentifiersMissingError,
  OrderProductsIncorrectAmountError,
  OrderProductsMissingError,
  OrderProductsMissingErrorV2,
  OrderProductsNotInElfStockError,
  ProductAvailabilityStatusError,
  ProductAvailabilityStatusErrorV4,
  QuantityProductsError,
} from '../errors';
import { DevolutionService } from './devolution.service';
import { ProductService } from './product.service';
import { MovementService } from './movements.service';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { Order, OrderProduct, ProductItem, ProductItemDetailView, Store } from '../entities';
import { ImportOrderDto, ProductImport } from 'src/domain/dtos';
import { EProductItemStatus } from 'src/domain/enums';
import { mapToEOrderType } from 'src/tools/map-order-type';
import { UpdateProductItemStatusDto } from 'src/domain/dtos/update-product-item-status.dto';

@Injectable()
export class OrderService {
  private static readonly CHUNK_SIZE = 100;

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @Inject(forwardRef(() => DevolutionService))
    private readonly devolutionService: DevolutionService,
    private readonly productService: ProductService,
    private readonly movementService: MovementService,
  ) {}

  async getOrderDetails(orderId: number) {
    const order = await this.orderRepository.findOne({
      relations: {
        store: true,
      },
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundError();
    }

    const store = await this.storeRepository.findOne({
      relations: {
        client: true,
      },
      where: {
        id: order.store.id,
      },
    });

    if (!store) {
      throw new NotFoundError();
    }

    const { client, code, ...storeData } = store;

    return {
      ...order,
      storeCode: code,
      ...storeData,
      clientCode: client.code,
    };
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

  async importOrder(orderToImport: ImportOrderDto) {
    console.log('orderToImport', orderToImport.armazemId);

    await this.ensureOrderDoesNotExist(Number(orderToImport.code), Number(orderToImport.armazemId));

    this.ensureAllProductsHaveIdentifications(orderToImport);
    this.ensureProductAmountMatchesIdentifications(orderToImport);

    const productCodes = this.getProductCodesFromOrder(orderToImport);
    const identifications = this.getIdentificationsFromOrder(orderToImport);
    const productStatus = await this.getProductStatus(orderToImport);

    const productItems = await this.productService.findProductItemsByIdentificationsAndCodes(
      identifications,
      productCodes,
    );

    await this.validateProductsInElfStock(productItems, orderToImport);
    this.validateIdentifications(identifications, productItems);
    await this.updateProductsStatus(productStatus);

    await this.dataSource.transaction(async (entityManager) => {
      const savedOrderId = await this.saveOrder(entityManager, orderToImport);
      await this.saveOrderProducts(entityManager, orderToImport, savedOrderId, productCodes);
      await this.movementService.saveMovements(entityManager, savedOrderId, productItems);
      const updatedProductItems = this.calculateUpdatedProductItems(productItems, orderToImport);
      await this.productService.updateProductItemsWithCustomFields(entityManager, updatedProductItems);
    });
  }

  async importDevolution(orderToImport: ImportOrderDto) {
    await this.devolutionService.ensureDevolutionDoesNotExist(orderToImport.code);
    this.ensureAllProductsHaveIdentifications(orderToImport);
    this.ensureProductAmountMatchesIdentifications(orderToImport);
    await this.ensureAllProductItemsExist(orderToImport);

    const productCodes = this.getProductCodesFromOrder(orderToImport);
    const identifications = this.getIdentificationsFromOrder(orderToImport);

    const productItems = await this.productService.findProductItemsByIdentificationsAndCodes(
      identifications,
      productCodes,
    );

    this.checkProductBatch(orderToImport.products, productItems);
    this.validateElfaStockStatus(productItems);
    this.validateProductsInvoiced(productItems);
    this.validateIdentifications(identifications, productItems);
    this.validateProductsInStoreStock(productItems);

    await this.dataSource.transaction(async (entityManager) => {
      const returnEntered = await this.devolutionService.saveDevolution(entityManager, orderToImport);
      await this.devolutionService.saveItemDevolutionProduct(
        entityManager,
        returnEntered.id,
        productItems,
        orderToImport.order.products,
      );
      await this.productService.updateProductItemsStatusEntityManager(
        entityManager,
        EProductItemStatus.IN_ELFA_STOCK,
        productItems,
      );
      await this.movementService.updateMovements(entityManager, productItems);
    });
  }

  // --- Private methods ---
  private async ensureOrderDoesNotExist(orderCode: number, armazemId: number) {
    const alreadyExists = await this.orderRepository.findOneBy({
      code: orderCode,
      warehouse: { id: armazemId },
    });
    if (alreadyExists) {
      throw new OrderAlreadyExistsError();
    }
  }

  async checkOrderExists(orderCode: number): Promise<boolean> {
    const order = await this.orderRepository.findOneBy({ code: orderCode });
    return !!order;
  }

  private ensureAllProductsHaveIdentifications(orderToImport: ImportOrderDto) {
    const allProductsExist = orderToImport.products.every((orderProduct, index) => {
      const hasIdentifications = orderProduct.identifications.length > 0;

      if (!hasIdentifications) {
        console.warn(`[ensureAllProductsHaveIdentifications] Produto na posição ${index} está sem identificações.`, {
          product: orderProduct,
        });
      }

      return hasIdentifications;
    });

    if (!allProductsExist) {
      throw new OrderProductsMissingError();
    }
  }

  private ensureProductAmountMatchesIdentifications(orderToImport: ImportOrderDto) {
    const isAmountValid = orderToImport.products.every((product) => {
      return product.amount === product.identifications.length;
    });
    if (!isAmountValid) {
      throw new OrderProductsIncorrectAmountError();
    }
  }

  private async getProductStatus(orderToImport: ImportOrderDto) {
    const statusListPromise: Promise<UpdateProductItemStatusDto | null>[] = [];

    orderToImport.products.forEach((product) => {
      product.identifications.forEach((identification) => {
        const productPromise = this.productService.getProductStatusByEPC(identification).then((status) => {
          if (!status) {
            return null;
          }
          return status;
        });

        statusListPromise.push(productPromise);
      });
    });

    const statusList = await Promise.all(statusListPromise);

    return statusList;
  }

  private async updateProductsStatus(products: UpdateProductItemStatusDto[]) {
    try {
      if (
        products.some(
          (product) =>
            product.status === EProductItemStatus.IN_CLIENT_STOCK || product.status === EProductItemStatus.CONSUMED,
        )
      ) {
        const updatedProducts = products.map((product) => ({ ...product, status: EProductItemStatus.IN_CLIENT_STOCK }));

        await this.productService.bulkUpdateProductItemStatus(updatedProducts);
      }
    } catch (error) {
      throw new BadRequestError();
    }
  }

  private async ensureAllProductItemsExist(orderToImport: ImportOrderDto) {
    const inexistentProductsPromises: Promise<string | null>[] = [];

    orderToImport.products.forEach((product) => {
      product.identifications.forEach((identification) => {
        const productExistsPromise = this.productService
          .checkIfProductExistsByEPC(identification)
          .then((productExists) => {
            if (!productExists) {
              return `${product.code} - ${product.lot}`;
            }
            return null;
          });

        inexistentProductsPromises.push(productExistsPromise);
      });
    });

    const inexistentProductsResolved = await Promise.all(inexistentProductsPromises);

    let inexistentProducts = inexistentProductsResolved.filter((product): product is string => product !== null);
    inexistentProducts = [...new Set(inexistentProducts)];

    if (inexistentProducts.length > 0) {
      throw new OrderProductsMissingErrorV2('Produtos:', inexistentProducts);
    }
  }

  private getProductCodesFromOrder(orderToImport: ImportOrderDto) {
    return [...new Set(orderToImport.products.flatMap((product) => product.code))];
  }

  private getIdentificationsFromOrder(orderToImport: ImportOrderDto): string[] {
    return orderToImport.products.flatMap((product) => product.identifications);
  }

  private async getProductItemDetailsById(
    productItemId: number,
  ): Promise<{ orderCode: number | null; invoiceNumber: number | null; invoiceSeries: number | null }> {
    const productItemDetail = await this.dataSource.manager
      .createQueryBuilder(ProductItemDetailView, 'productItem')
      .select(['productItem.orderCode', 'productItem.invoiceNumber', 'productItem.invoiceSeries'])
      .where('productItem.productItemId = :productItemId', { productItemId })
      .getOne();

    return productItemDetail
      ? {
          orderCode: productItemDetail.orderCode,
          invoiceNumber: productItemDetail.invoiceNumber,
          invoiceSeries: productItemDetail.invoiceSeries,
        }
      : { orderCode: null, invoiceNumber: null, invoiceSeries: null };
  }

  private async validateProductsInElfStock(productItems: ProductItem[], orderToImport: ImportOrderDto) {
    const invalidItems = productItems.filter(
      (item) =>
        item.status !== EProductItemStatus.IN_ELFA_STOCK &&
        item.status !== EProductItemStatus.IN_CLIENT_STOCK &&
        item.status !== EProductItemStatus.CONSUMED,
    );

    if (invalidItems.length > 0) {
      const detailsPromises = invalidItems.map(async (item) => {
        const productCode = item.product ? item.product.code : 'Código do produto indisponível';
        const lot = item.lot ? item.lot : 'Lote indisponível';
        const clientCode = orderToImport.store?.client?.code
          ? orderToImport.store.client.code
          : 'Código do cliente indisponível';
        const clientName = orderToImport.store?.client?.name ? orderToImport.store.client.name : '-';
        const storeCode = orderToImport.store ? orderToImport.store.code : 'Código da loja indisponível';

        // let remessa = '-';
        // let invoiceNumber = '-';
        // let invoiceSeries = '-';

        // if (item.status === EProductItemStatus.IN_CLIENT_STOCK) {
        //   const details = await this.getProductItemDetailsById(item.id);
        //   remessa = details.orderCode !== null ? details.orderCode.toString() : remessa;
        //   invoiceNumber = details.invoiceNumber !== null ? details.invoiceNumber.toString() : invoiceNumber;
        //   invoiceSeries = details.invoiceSeries !== null ? details.invoiceSeries.toString() : invoiceSeries;
        // }

        // return `Produto [${productCode} - Lote: ${lot}] está no cliente: [${clientCode} - Loja ${storeCode} - ${clientName}] no pedido ${remessa}, com nota fiscal ${invoiceNumber}/${invoiceSeries} e não foi devolvido.`;
        return `Produto [${productCode} - Lote: ${lot}] está no cliente: [${clientCode} - Loja ${storeCode} - ${clientName}] e não foi devolvido.`;
      });

      const details = (await Promise.all(detailsPromises)).join('\n');
      throw new OrderProductsNotInElfStockError(details);
    }
  }

  private validateProductsInStoreStock(productItems: ProductItem[]) {
    const allowed = [
      EProductItemStatus.AWAITING_DELIVERY,
      EProductItemStatus.IN_CLIENT_STOCK,
      EProductItemStatus.STOCK_DISCREPANCY,
    ] as string[];

    if (productItems.some((item) => !allowed.includes(item.status))) {
      throw new ProductAvailabilityStatusError();
    }
  }

  private validateProductsInvoiced(productItems: ProductItem[]) {
    const productItemStatus = [
      // EProductItemStatus.CONSUMED,
      EProductItemStatus.PRE_INVOICED,
      EProductItemStatus.INVOICED,
    ] as string[];

    if (productItems.some((item) => productItemStatus.indexOf(item.status) > -1)) {
      throw new ProductAvailabilityStatusError();
    }
  }

  private validateElfaStockStatus(productItems: ProductItem[]) {
    const anyInElfaStockOrConsumed = productItems.some(
      (item) => item.status === EProductItemStatus.IN_ELFA_STOCK || item.status === EProductItemStatus.CONSUMED,
    );

    const productsEpcs: string[] = [];
    if (anyInElfaStockOrConsumed) {
      const errorDetails = productItems
        .filter(
          (item) => item.status === EProductItemStatus.IN_ELFA_STOCK || item.status === EProductItemStatus.CONSUMED,
        )
        .map((item) => `Produto [${item.product.code} - ${item.lot}] NÃO está no cliente.`)
        .join('\n');

      productItems
        .filter(
          (item) => item.status === EProductItemStatus.IN_ELFA_STOCK || item.status === EProductItemStatus.CONSUMED,
        )
        .map((item) => productsEpcs.push(item.identification));

      // throw new ProductAvailabilityStatusErrorV3(errorDetails);
      throw new ProductAvailabilityStatusErrorV4(errorDetails, productsEpcs);
    }
  }

  private validateIdentifications(identifications: string[], productItems: ProductItem[]) {
    const identificationsAlreadyExists = productItems.map((item) => item.identification);
    const notFoundIdentifications = identifications.filter((id) => !identificationsAlreadyExists.includes(id));
    if (notFoundIdentifications.length > 0) {
      throw new OrderProductIdentifiersMissingError(notFoundIdentifications);
    }

    if (identificationsAlreadyExists.length > productItems.length) {
      throw new QuantityProductsError();
    }
  }

  private checkProductBatch(productItemsParams: ProductImport[], productItemsRepository: ProductItem[]) {
    const removeLeadingZeros = (str: string) => str.replace(/^0+/, '');

    productItemsParams.forEach((productItemParam) => {
      const cleanedLot = removeLeadingZeros(productItemParam.lot);

      const productRepository = productItemsRepository.find(
        (productItemRepository) =>
          productItemRepository.lot === productItemParam.lot || productItemRepository.lot.endsWith(cleanedLot),
      );

      if (!productRepository) {
        console.error(
          `[Batch Validation Error] Lote inválido informado para o produto. Código: ${productItemParam.code} | Lote vindo: ${productItemParam.lot} | Valor limpo: ${cleanedLot}`,
        );
        throw new InvalidBatchCodeError();
      }
    });
  }

  private async saveOrder(entityManager: EntityManager, orderToImport: ImportOrderDto): Promise<number> {
    const { store, requestedAt, armazemId, username } = orderToImport;
    const receivedAt = store.isOnline ? null : new Date();
    const shippedAt = new Date();
    const code = Number(orderToImport.code);
    const invoiceNumber = Number(orderToImport.order.invoiceNumber);
    const invoiceSeries = Number(orderToImport.order.invoiceSeries);
    const patientName = orderToImport.patientName;
    const sellerName = orderToImport.products[0].sellerName;
    const opDateStr = orderToImport.operationDate;
    let formattedOperationDate: Date | null = null;
    if (opDateStr) {
      formattedOperationDate = new Date(
        Number(opDateStr.slice(0, 4)),
        Number(opDateStr.slice(4, 6)) - 1,
        Number(opDateStr.slice(6)),
      );
    }

    const lastWord = orderToImport.type.split(' ').pop();
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
  ) {
    const products = await this.productService.getProductsByCodes(productCodes);
    const formattedOrderProducts = products.map(({ id, code }) => {
      const { amount, unitCost, totalValue } = orderToImport.products.find((p) => p.code === code);
      return { amount, unitCost, totalValue, product: { id }, order: { id: orderId } };
    });
    const entities = entityManager.create(OrderProduct, formattedOrderProducts);
    return entityManager.save(entities, { chunk: OrderService.CHUNK_SIZE });
  }

  private calculateUpdatedProductItems(productItems: ProductItem[], orderToImport: ImportOrderDto): ProductItem[] {
    return productItems.map((item) => {
      const matchingProduct = orderToImport.products.find((product) =>
        product.identifications.includes(item.identification),
      );

      if (!matchingProduct) {
        throw new Error(`Nenhum produto correspondente encontrado para o identificador ${item.identification}`);
      }

      return {
        ...item,
        status: orderToImport.store.isOnline
          ? EProductItemStatus.AWAITING_DELIVERY
          : EProductItemStatus.IN_CLIENT_STOCK,
        consignmentItem: matchingProduct.consignmentItem,
        consignmentCode: matchingProduct.consignmentCode,
      };
    });
  }
}
