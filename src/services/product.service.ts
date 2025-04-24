/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import {
  OrderNotFoundError,
  OrderProductItemsNotFoundError,
  OrderProductsNotFoundError,
  ProductNotFoundError,
} from 'src/errors';
import { IDecodedBarcode, decodeBarcode, logger } from 'src/tools';
import { DataSource, EntityManager, ILike, In, Like, Not, Repository, SelectQueryBuilder } from 'typeorm';
import {
  ElfmedApiDevolutionByBranchCGCRequestModel,
  EProductItemStatus,
  GetProductDetailsByBarcodeDTO,
  SortDirection,
  SortFilter,
} from '../domain';
import {
  Product,
  ProductConsumedGridView,
  ProductGridView,
  ProductInventoryLog,
  ProductItem,
  ProductItemDetailView,
  ProductItemDetailViewAll,
  ProductMetricsView,
  ProductPrintView,
  StoreSummaryView,
} from '../entities';
import { decodeCsv } from '../tools/csv';
import { ElfaApiService } from './elfa-api.service';
import { UpdateProductItemStatusDto } from 'src/domain/dtos/update-product-item-status.dto';
import { Divergence } from '@/entities/divergence.entity';
import * as XLSX from 'xlsx';
import * as path from 'path';

@Injectable()
export class ProductService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductItem)
    private readonly productItemRepository: Repository<ProductItem>,
    @InjectRepository(ProductPrintView)
    private readonly productPrintViewRepository: Repository<ProductPrintView>,
    @InjectRepository(ProductInventoryLog)
    private readonly productInventoryLogRepository: Repository<ProductInventoryLog>,
    @InjectRepository(StoreSummaryView)
    private readonly storeSummaryViewRepository: Repository<StoreSummaryView>,
    @InjectRepository(Divergence)
    private readonly divergenceRepository: Repository<Divergence>,
    @InjectRepository(ProductItemDetailView)
    private readonly productItemViewRepository: Repository<ProductItemDetailView>,
    private readonly elfaApiService: ElfaApiService,
  ) {}

  async getStoreProductMetrics(storeId: number, startDate?: string, endDate?: string, dateType?: string) {
    const query = this.dataSource
      .createQueryBuilder()
      .select("SUM(CASE WHEN vw.Estado = 'AGUARDANDO_ENTREGA' THEN 1 ELSE 0 END)", 'awaitingDeliveryAmount')
      .addSelect(
        "SUM(CASE WHEN vw.Estado = 'AGUARDANDO_ENTREGA' THEN vw.ValorUnitario ELSE 0 END)",
        'awaitingDeliveryValue',
      )
      .addSelect(
        "SUM(CASE WHEN vw.Estado = 'ESTOQUE_CLIENTE' AND vw.StatusRemessa = 'ELETIVO' THEN 1 ELSE 0 END)",
        'inClientStockAmountElective',
      )
      .addSelect(
        "SUM(CASE WHEN vw.Estado = 'ESTOQUE_CLIENTE' AND vw.StatusRemessa = 'ELETIVO' THEN vw.ValorUnitario ELSE 0 END)",
        'inClientStockValueElective',
      )
      .addSelect(
        "SUM(CASE WHEN vw.Estado = 'ESTOQUE_CLIENTE' AND vw.StatusRemessa = 'FIXO' THEN 1 ELSE 0 END)",
        'inClientStockAmountFixed',
      )
      .addSelect(
        "SUM(CASE WHEN vw.Estado = 'ESTOQUE_CLIENTE' AND vw.StatusRemessa = 'FIXO' THEN vw.ValorUnitario ELSE 0 END)",
        'inClientStockValueFixed',
      )
      .addSelect("SUM(CASE WHEN vw.Estado = 'ESTOQUE_CLIENTE' THEN 1 ELSE 0 END)", 'inClientStockAmount')
      .addSelect("SUM(CASE WHEN vw.Estado = 'ESTOQUE_CLIENTE' THEN vw.ValorUnitario ELSE 0 END)", 'inClientStockValue')
      .addSelect("SUM(CASE WHEN vw.Estado = 'DIVERGENCIA_ESTOQUE' THEN 1 ELSE 0 END)", 'stockDiscrepancyAmount')
      .addSelect(
        "SUM(CASE WHEN vw.Estado = 'DIVERGENCIA_ESTOQUE' THEN vw.ValorUnitario ELSE 0 END)",
        'stockDiscrepancyValue',
      )
      .addSelect("SUM(CASE WHEN vw.Estado = 'CONSUMIDO' THEN 1 ELSE 0 END)", 'consumedAmount')
      .addSelect("SUM(CASE WHEN vw.Estado = 'CONSUMIDO' THEN vw.ValorUnitario ELSE 0 END)", 'consumedValue')
      .from('VW_PRODUTO_ITEM_DETALHE', 'vw')
      .where('vw.LojaId = :storeId', { storeId });

    if (startDate && endDate && dateType) {
      if (!['DataSolicitacao', 'DataEnvio'].includes(dateType)) {
        throw new BadRequestException('Parâmetro dateType inválido. Utilize "DataSolicitacao" ou "DataEnvio".');
      }
      const start = new Date(startDate);
      const end = new Date(endDate);
      const dateColumn = dateType === 'DataSolicitacao' ? 'vw.DataSolicitacao' : 'vw.DataEnvio';
      query.andWhere(`${dateColumn} BETWEEN :start AND :end`, { start, end });
    }

    const metrics = await query.getRawOne();

    const totalAmount =
      Number(metrics.awaitingDeliveryAmount) +
      Number(metrics.inClientStockAmount) +
      Number(metrics.stockDiscrepancyAmount) +
      Number(metrics.consumedAmount);

    const totalValue =
      Number(metrics.awaitingDeliveryValue) +
      Number(metrics.inClientStockValue) +
      Number(metrics.stockDiscrepancyValue) +
      Number(metrics.consumedValue);

    return { ...metrics, totalAmount, totalValue };
  }

  async getStoreProductsFinanceMetrics(storeId: number, startDate?: string, endDate?: string, dateType?: string) {
    const query = this.dataSource
      .createQueryBuilder()
      .select("SUM(CASE WHEN vw.Estado = 'CONSUMIDO' THEN 1 ELSE 0 END)", 'consumedAmount')
      .addSelect("SUM(CASE WHEN vw.Estado = 'CONSUMIDO' THEN vw.ValorUnitario ELSE 0 END)", 'consumedValue')
      .addSelect("SUM(CASE WHEN vw.Estado = 'PRE_FATURADO' THEN 1 ELSE 0 END)", 'preInvoicedAmount')
      .addSelect("SUM(CASE WHEN vw.Estado = 'PRE_FATURADO' THEN vw.ValorUnitario ELSE 0 END)", 'preInvoicedValue')
      .addSelect("SUM(CASE WHEN vw.Estado = 'FATURADO' THEN 1 ELSE 0 END)", 'invoicedAmount')
      .addSelect("SUM(CASE WHEN vw.Estado = 'FATURADO' THEN vw.ValorUnitario ELSE 0 END)", 'invoicedValue')
      .addSelect("SUM(CASE WHEN vw.Estado = 'PROCESSANDO_FATURAMENTO' THEN 1 ELSE 0 END)", 'awaitingInvoicingAmount')
      .addSelect(
        "SUM(CASE WHEN vw.Estado = 'PROCESSANDO_FATURAMENTO' THEN vw.ValorUnitario ELSE 0 END)",
        'awaitingInvoicingAmountValue',
      )
      .addSelect(
        "SUM(CASE WHEN vw.StatusRemessa = 'ELETIVO' AND vw.Estado IN ('CONSUMIDO','PRE_FATURADO','FATURADO','PROCESSANDO_FATURAMENTO') THEN 1 ELSE 0 END)",
        'inClientStockAmountElective',
      )
      .addSelect(
        "SUM(CASE WHEN vw.StatusRemessa = 'ELETIVO' AND vw.Estado IN ('CONSUMIDO','PRE_FATURADO','FATURADO','PROCESSANDO_FATURAMENTO') THEN vw.ValorUnitario ELSE 0 END)",
        'inClientStockValueElective',
      )
      .addSelect(
        "SUM(CASE WHEN vw.StatusRemessa = 'FIXO' AND vw.Estado IN ('CONSUMIDO','PRE_FATURADO','FATURADO','PROCESSANDO_FATURAMENTO') THEN 1 ELSE 0 END)",
        'inClientStockAmountFixed',
      )
      .addSelect(
        "SUM(CASE WHEN vw.StatusRemessa = 'FIXO' AND vw.Estado IN ('CONSUMIDO','PRE_FATURADO','FATURADO','PROCESSANDO_FATURAMENTO') THEN vw.ValorUnitario ELSE 0 END)",
        'inClientStockValueFixed',
      )
      .addSelect('COUNT(DISTINCT vw.Remessa)', 'orderAmount')
      .from('VW_PRODUTO_ITEM_DETALHE', 'vw')
      .where('vw.LojaId = :storeId', { storeId });

    if (startDate && endDate && dateType) {
      if (!['DataSolicitacao', 'DataEnvio'].includes(dateType)) {
        throw new BadRequestException('Parâmetro dateType inválido. Utilize "DataSolicitacao" ou "DataEnvio".');
      }
      const start = new Date(startDate);
      const end = new Date(endDate);
      const dateColumn = dateType === 'DataSolicitacao' ? 'vw.DataSolicitacao' : 'vw.DataEnvio';
      query.andWhere(`${dateColumn} BETWEEN :start AND :end`, { start, end });
    }

    const metrics = await query.getRawOne();

    const totalAmount =
      Number(metrics.consumedAmount) +
      Number(metrics.preInvoicedAmount) +
      Number(metrics.invoicedAmount) +
      Number(metrics.awaitingInvoicingAmount);

    const totalValue =
      Number(metrics.consumedValue) +
      Number(metrics.preInvoicedValue) +
      Number(metrics.invoicedValue) +
      Number(metrics.awaitingInvoicingAmountValue);

    return { ...metrics, totalAmount, totalValue };
  }

  async listStoreProductsDetails(
    storeId: number,
    productId: number,
    page: number,
    pageSize: number,
    sortFilter: SortFilter<ProductItemDetailView>,
    additionalFilters?: {
      receivedAt?: string;
      orderCode?: string;
      saleOrderCode?: string;
      epc?: string;
      lot?: string;
      expiresAt?: string;
      status?: string;
      patientName?: string;
      operationDate?: string;
      invoiceNumber?: string;
      invoiceSeries?: string;
    },
  ) {
    const excludedStatuses = [EProductItemStatus.IN_ELFA_STOCK, EProductItemStatus.REVERSED];

    let query = this.buildProductDetailsQuery(storeId, productId, excludedStatuses, additionalFilters);
    query = query.take(pageSize).skip((page - 1) * pageSize);

    this.applySortFilter(query, sortFilter);

    const countQuery = this.buildProductDetailsCountQuery(storeId, productId, excludedStatuses, additionalFilters);

    const [productDetails, totalItems] = await Promise.all([query.getMany(), countQuery.getCount()]);

    const mappedProductDetails = productDetails.map((item) => ({
      ...item,
      orderCode: item.orderType === 'INVENTARIO' ? item.RemessaInventario : item.orderCode,
    }));

    return { productDetails: mappedProductDetails, totalItems };
  }

  async listStoreProducts(
    storeId: number,
    page: number,
    pageSize: number,
    search?: string,
    startDate?: string,
    endDate?: string,
    dateType?: string,
    lote?: string,
    paciente?: string,
    dataProcedimento?: string,
    remessa?: string,
    faturaRemessa?: string,
    tipoRemessa?: string,
    sortFilter?: SortFilter<ProductGridView>,
  ) {
    let qb = this.buildBaseQuery(storeId);

    qb = this.applySearchFilter(qb, search);
    qb = this.applyDateFilter(qb, startDate, endDate, dateType);
    qb = this.applyProductFilters(qb, lote, paciente, dataProcedimento, remessa, faturaRemessa, tipoRemessa);
    qb = this.applyGroupBy(qb);
    qb = this.applySorting(qb, sortFilter);

    qb.skip((page - 1) * pageSize).take(pageSize);

    const productsPromise = qb.getRawMany();

    const countQb = qb.clone();
    countQb.select('COUNT(*)', 'total');
    const totalItems = await this.getTotalCount(qb);

    const products = await productsPromise;
    return { products, totalItems };
  }

  async listStoreProductsFinance(
    storeId: number,
    page: number,
    pageSize: number,
    startDate?: string,
    endDate?: string,
    dateType?: string,
    search?: string,
    lote?: string,
    paciente?: string,
    dataProcedimento?: string,
    remessa?: string,
    faturaRemessa?: string,
    tipoRemessa?: string,
    sortFilter?: SortFilter<ProductGridView>,
  ) {
    const qb = this.createProductFinanceGridQueryBuilder(
      storeId,
      startDate,
      endDate,
      dateType,
      search,
      lote,
      paciente,
      dataProcedimento,
      remessa,
      faturaRemessa,
      tipoRemessa,
      sortFilter,
    );

    qb.skip((page - 1) * pageSize).take(pageSize);

    const products = await qb.getRawMany();
    const totalItems = await this.getTotalCount(qb);

    return { products, totalItems };
  }

  async getProductDetailsById(productId: number) {
    return this.productRepository.findOne({
      select: {
        code: true,
        description: true,
        technicalName: true,
        modelSizeReference: true,
        manufacturer: true,
        anvisaRegistry: true,
        anvisaVigencyStartDate: true,
        tissCode: true,
        classification: true,
        speciality: true,
      },
      where: {
        id: productId,
      },
    });
  }

  async getProductsByCodes(productCodes: number[]) {
    console.log('productCodes', productCodes);
    const products = await this.productRepository.find({ where: { code: In(productCodes) } });
    console.log('products', products);

    if (products.length !== productCodes.length) {
      console.log('cai aqui no erro');
      throw new OrderProductsNotFoundError();
    }
    return products;
  }

  async getProductDetailsByBarcode(code: string): Promise<GetProductDetailsByBarcodeDTO> {
    let codeParams = {};
    let decode: IDecodedBarcode;

    if (code.length > 7) {
      decode = decodeBarcode(code);
      codeParams = {
        ean: decode.gtin,
      };
    } else {
      codeParams = {
        code,
      };
    }

    const product = await this.productRepository.findOne({
      select: {
        id: true,
        code: true,
        description: true,
        technicalName: true,
        modelSizeReference: true,
        manufacturer: true,
        anvisaRegistry: true,
        anvisaVigencyStartDate: true,
        tissCode: true,
        classification: true,
        speciality: true,
      },
      where: codeParams,
    });

    if (!product) {
      throw new ProductNotFoundError();
    }

    return {
      id: product.id,
      code: product.code,
      description: product.description,
      lote: decode && decode.lot ? decode.lot : null,
      exp: decode && decode.exp ? decode.exp : null,
    };
  }

  async getProductDetailsByName(productName: string, page: number, pageSize: number) {
    const totalItems = await this.productRepository.count({
      where: {
        description: ILike(`%${productName}%`),
      },
    });

    const totalPages = Math.ceil(totalItems / pageSize);

    const data = await this.productRepository.find({
      select: {
        code: true,
        description: true,
        technicalName: true,
        modelSizeReference: true,
        manufacturer: true,
        anvisaRegistry: true,
        anvisaVigencyStartDate: true,
        tissCode: true,
        classification: true,
        speciality: true,
        id: true,
      },
      where: {
        description: ILike(`%${productName}%`),
      },
      order: {
        id: 'ASC',
      },
      take: pageSize,
      skip: (page - 1) * pageSize,
    });

    return {
      data,
      page,
      pageSize,
      totalPages,
    };
  }

  async listPendingInvoicingProducts(
    storeId: number,
    page: number,
    pageSize: number,
    sortFilter?: SortFilter<ProductGridView>,
  ) {
    const where = { storeId };
    const promises: [Promise<ProductConsumedGridView[]>, Promise<number>] = [
      this.dataSource.manager.find(ProductConsumedGridView, {
        select: {
          productCode: true,
          productDescription: true,
          lot: true,
          expiresAt: true,
          consumedAmount: true,
          consumedValue: true,
          productItemIds: true,
        },
        where,
        take: pageSize,
        skip: (page - 1) * pageSize,
        order: sortFilter,
      }),
      this.dataSource.manager.count(ProductConsumedGridView, { where }),
    ];

    const [products, totalItems] = await Promise.all(promises);
    return { products, totalItems };
  }

  async findProductItemsByIdentificationsAndCodes(identifications: string[], productCodes: number[]) {
    const productItems = await this.productItemRepository.find({
      where: {
        identification: In(identifications),
        product: { code: In(productCodes) },
      },
      relations: ['product'],
    });
    if (productItems.length <= 0) {
      throw new OrderProductItemsNotFoundError();
    }
    return productItems;
  }

  async exportPendingInvoicingProductsList(storeId: number) {
    return this.dataSource.manager.find(ProductItemDetailView, {
      where: { storeId, status: EProductItemStatus.CONSUMED },
    });
  }

  async exportCsvPendingInvoicingProductsList(storeId: number) {
    const productItems = await this.exportPendingInvoicingProductsList(storeId);
    let csvContent = 'Codigo;Descricao;Lote;Validade;Valor;Remessa;EPC\n';

    productItems.forEach((p) => {
      const validade = p.expiresAt
        ? p.expiresAt.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
        : '';
      csvContent += `${p.productCode};${p.productDescription};${p.lot};${validade};${p.unitCost};${p.orderCode};${p.epc}\n`;
    });

    return csvContent;
  }

  async getStoreProductInventory(storeId: number) {
    const productItems = await this.getProductItemsByStoreId(storeId);

    if (productItems.length <= 0) {
      return {
        logId: null,
        totalQuantityPortal: 0,
        total: [],
        divergent: [],
      };
    }

    const groupedProducts = productItems.reduce(
      (acc, item) => {
        const uniqueKey = `${item.product.code}-${item.lot}-${item.status}-${item.expiresAt}`;

        const group = acc[uniqueKey] || {
          code: item.product.code,
          description: item.product.description,
          lot: item.lot,
          status: item.status,
          expiresAt: item.expiresAt,
          quantityPortal: 0,
        };

        group.quantityPortal += 1;
        acc[uniqueKey] = group;
        return acc;
      },
      {} as Record<string, any>,
    );

    const allProducts = Object.values(groupedProducts);

    const divergent = allProducts.filter((item) => item.status === EProductItemStatus.STOCK_DISCREPANCY);

    const total = allProducts.filter((item) => !divergent.includes(item));

    const totalQuantityPortal = [...total, ...divergent].reduce((sum, item) => sum + item.quantityPortal, 0);

    return {
      totalQuantityPortal,
      total,
      divergent,
    };
  }

  async updateStoreProductInventory(storeId: number, files: Express.Multer.File[], username: string) {
    let epcs = await this.extractEpcsFromMultipleFiles(files);
    epcs = Array.from(new Set(epcs));

    const productItems = await this.getProductItemsByStoreIdToUpdateInventory(storeId);

    if (productItems.length <= 0) return;

    /**
     * convergentIds: estão tanto no banco de dados quanto no CSV, tornam-se IN_CLIENT_STOCK
     * divergentIds: estão no banco de dados, mas não estão no CSV, tornam-se CONSUMED
     * csvOnlyEpcs: estão no CSV mas não estão no banco, tornam-se STOCK_DISCREPANCY
     */

    const { convergentIds, divergentIds, csvOnlyEpcs } = this.sortProductItemsByEpcs(productItems, epcs);

    const groupedProducts = productItems.reduce(
      (acc, item) => {
        const uniqueKey = `${item.product.code}-${item.lot}-${item.status}-${item.expiresAt}`;

        const group = acc[uniqueKey] || {
          code: item.product.code,
          description: item.product.description,
          lot: item.lot,
          status: item.status,
          expiresAt: item.expiresAt,
          quantityPortal: 0,
          quantityCount: 0,
          identifications: new Set<string>(),
          unitCost: item.valorUnitario,
        };

        group.quantityPortal += 1;
        if (item.identification) {
          group.identifications.add(item.identification);
        }

        acc[uniqueKey] = group;
        return acc;
      },
      {} as Record<string, any>,
    );

    const groupedProductsWithValues = Object.values(groupedProducts).map((group: any) => ({
      ...group,
      totalValue: group.unitCost * group.quantityPortal,
    }));

    await this.processCsvOnlyEpcs(csvOnlyEpcs, groupedProductsWithValues);

    this.updateCsvEpcsCount(epcs, productItems, groupedProductsWithValues);

    const allProducts = Object.values(groupedProductsWithValues);

    const divergent = allProducts.filter((item) => item.quantityCount > item.quantityPortal || item.code === 'UNKNOWN');

    const invoicedFiltered = allProducts
      .filter((item) => {
        const isInvoiced = item.status === EProductItemStatus.INVOICED;
        const identificationsSet = item.identifications instanceof Set ? item.identifications : new Set();
        const existsInCsv = [...identificationsSet].some((epc) => epcs.includes(epc));

        return isInvoiced && existsInCsv;
      })
      .map((item) => ({
        ...item,
        quantityConciliation: item.quantityPortal - item.quantityCount,
        identifications: [...(item.identifications || new Set())],
      }));

    const total = allProducts
      .filter((item) => !divergent.includes(item) && item.status !== EProductItemStatus.INVOICED)
      .map((item) => ({
        ...item,
        quantityConciliation: item.quantityPortal - item.quantityCount,
        identifications: [...(item.identifications || new Set())],
      }));

    const conciliation = total
      .filter((item) => item.quantityConciliation >= 1)
      .map((item) => ({
        ...item,
        identifications: [...(item.identifications || new Set())],
      }));

    const totalQuantityPortal = [...total, ...divergent, ...invoicedFiltered].reduce((sum, item) => {
      return sum + (item.quantityPortal > 0 ? item.quantityPortal : item.quantityCount);
    }, 0);

    const totalQuantityCount = [...total, ...divergent, ...invoicedFiltered].reduce(
      (sum, item) => sum + item.quantityCount,
      0,
    );

    const totalQuantityConciliation = conciliation.reduce((sum, item) => sum + item.quantityConciliation, 0);

    let logId: number;

    const discrepancyIds = await this.getDiscrepancyIds(csvOnlyEpcs);

    const itemsWithStatusBeforeUpdate = await this.productItemRepository.find({
      where: { id: In(discrepancyIds) },
      relations: ['movements', 'movements.order', 'movements.order.store'],
      select: ['id', 'status'],
    });

    await this.dataSource.transaction(async (entityManager) => {
      await Promise.all([
        this.updateProductItemsStatus(entityManager, convergentIds, EProductItemStatus.IN_CLIENT_STOCK),
        this.updateProductItemsStatus(entityManager, divergentIds, EProductItemStatus.CONSUMED),
        this.updateProductItemsStatus(entityManager, discrepancyIds, EProductItemStatus.STOCK_DISCREPANCY),
      ]);

      logId = await this.logInventory(storeId, username);
      await this.createDivergences(entityManager, itemsWithStatusBeforeUpdate, storeId, username);
    });

    return {
      logId,
      totalQuantityPortal,
      totalQuantityCount,
      totalQuantityConciliation,
      total,
      conciliation,
      divergent,
      invoiced: invoicedFiltered,
    };
  }

  async updateProductItemsStatusEntityManager(
    entityManager: EntityManager,
    status: EProductItemStatus,
    productItems: ProductItem[],
  ) {
    const productItemIds = productItems.map(({ id }) => id);

    return entityManager.update(ProductItem, { id: In(productItemIds) }, { status });
  }

  async updateProductItemsWithCustomFields(
    entityManager: EntityManager,
    productItems: Partial<ProductItem>[],
  ): Promise<void> {
    const productItemUpdates = productItems.map((item) =>
      entityManager.update(
        ProductItem,
        { id: item.id },
        {
          status: item.status,
          consignmentItem: item.consignmentItem,
          consignmentCode: item.consignmentCode,
        },
      ),
    );

    await Promise.all(productItemUpdates);
  }

  async updateProductItemsStatusGroup(ids: number[], status: EProductItemStatus) {
    const result = await this.productItemRepository
      .createQueryBuilder()
      .update(ProductItem)
      .set({ status })
      .whereInIds(ids)
      .execute();

    return result.affected;
  }

  async getProductById(productId: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      select: { id: true, code: true, description: true, reference: true },
    });

    if (!product) {
      throw new OrderProductsNotFoundError();
    }

    return product;
  }

  async getProductsByIds(productIds: number[]): Promise<Product[]> {
    const products = await this.productRepository.findBy({
      id: In(productIds),
    });

    if (!products.length) {
      throw new OrderProductsNotFoundError();
    }

    return products;
  }

  async getProductItemsByProductId(productId: number) {
    return this.productItemRepository.find({
      where: {
        product: { id: productId },
      },
      relations: ['product', 'movements', 'tag', 'invoice', 'printLot'],
    });
  }

  async getProductItemsByIdentification(identification: string) {
    const productItem = await this.productItemRepository.findOne({
      where: {
        identification,
      },
      relations: ['product', 'movements', 'tag', 'invoice', 'printLot'],
    });

    if (!productItem) {
      throw new NotFoundException();
    }

    const additionalInfo = await this.dataSource
      .createQueryBuilder()
      .select(['solicitacao.Codigo AS remessa', 'armazem.CNPJ AS armazemCNPJ'])
      .from(ProductItem, 'productItem')
      .innerJoin('movimentacao', 'movement', 'movement.ProdutoItemId = productItem.ProdutoItemId')
      .innerJoin('solicitacao', 'solicitacao', 'solicitacao.SolicitacaoId = movement.SolicitacaoId')
      .innerJoin('loja', 'loja', 'loja.LojaId = solicitacao.LojaId')
      .leftJoin('armazem', 'armazem', 'armazem.ArmazemId = solicitacao.armazemId')
      .where('productItem.ProdutoItemId = :productItemId', { productItemId: productItem.id })
      .getRawOne();

    return {
      ...productItem,
      remessa: additionalInfo?.remessa || null,
      armazemCNPJ: additionalInfo?.armazemCNPJ || null,
    };
  }

  async updateProductItemStatus(identification: string, status: EProductItemStatus) {
    const productItem = await this.productItemRepository.findOne({
      where: { identification },
    });

    if (!productItem) {
      throw new NotFoundException();
    }

    productItem.status = status;
    return this.productItemRepository.save(productItem);
  }

  async bulkUpdateProductItemStatus(products: UpdateProductItemStatusDto[]) {
    await Promise.all(
      products.map((product) => {
        this.updateProductItemStatus(product.epc, product.status);
      }),
    );
  }

  async getSummary(startDate: string, endDate: string, armazemId: number) {
    const pedidosGerados = await this.dataSource
      .createQueryBuilder()
      .select('COUNT(SolicitacaoId)', 'count')
      .from('solicitacao', 's')
      .where('s.DataEnvio BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('s.armazemId = :armazemId', { armazemId })
      .getRawOne();

    const produtosEnviados = await this.dataSource
      .createQueryBuilder()
      .select('COUNT(m.MovimentacaoId)', 'count')
      .from('solicitacao', 's')
      .innerJoin('MOVIMENTACAO', 'm', 'm.SolicitacaoId = s.SolicitacaoId')
      .where('s.DataEnvio BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('s.armazemId = :armazemId', { armazemId })
      .getRawOne();

    const etiquetasGeradas = await this.dataSource
      .createQueryBuilder()
      .select('SUM(Quantidade)', 'sum')
      .from('LOTE_IMPRESSAO', 'l')
      .where('l.DataGeracao BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('l.ArmazemId = :armazemId', { armazemId })
      .getRawOne();

    const itensDevolucao = await this.dataSource
      .createQueryBuilder()
      .select('COUNT(DevolucaoId)', 'count')
      .from('DEVOLUCAO', 'd')
      .where('CAST(d.DataDevolucao AS DATE) BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('d.ArmazemId = :armazemId', { armazemId })
      .getRawOne();

    const valorPedidos = await this.dataSource
      .createQueryBuilder()
      .select('SUM(sp.Quantidade * sp.ValorUnitario)', 'total')
      .from('SOLICITACAO_PRODUTO', 'sp')
      .innerJoin('solicitacao', 's', 's.SolicitacaoId = sp.SolicitacaoId')
      .where('s.DataEnvio BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('s.armazemId = :armazemId', { armazemId })
      .getRawOne();

    const armazemInfo = await this.dataSource
      .createQueryBuilder()
      .select(['a.ArmazemId', 'a.Codigo', 'a.Nome', 'a.CNPJ'])
      .from('ARMAZEM', 'a')
      .where('a.ArmazemId = :armazemId', { armazemId })
      .getRawOne();

    const impressoraInfo = await this.dataSource
      .createQueryBuilder()
      .select(['i.ImpressoraId', 'i.Descricao', 'i.IP', 'i.Porta', 'i.Ativo'])
      .from('IMPRESSORA', 'i')
      .where('i.ArmazemId = :armazemId', { armazemId })
      .getRawMany();

    return {
      armazem: armazemInfo
        ? `${armazemInfo.Nome} (Código: ${armazemInfo.Codigo}, CNPJ: ${armazemInfo.CNPJ})`
        : 'Armazém não encontrado',
      pedidosGerados: pedidosGerados.count || 0,
      valorPedidos: valorPedidos.total || 0,
      produtosEnviados: produtosEnviados.count || 0,
      etiquetasGeradas: etiquetasGeradas.sum || 0,
      itensDevolucao: itensDevolucao.count || 0,
      impressoras: impressoraInfo.map((impressora) => ({
        ImpressoraId: impressora.ImpressoraId,
        Descricao: impressora.Descricao,
        IP: impressora.IP,
        Porta: impressora.Porta,
        Ativo: impressora.Ativo,
      })),
    };
  }

  async getPedidosSummary(startDate: string, endDate: string, armazemId: number) {
    const pedidos = await this.dataSource
      .createQueryBuilder()
      .select([
        's.SolicitacaoId',
        's.DataEnvio',
        's.Codigo',
        's.Tipo',
        'SUM(sp.Quantidade * sp.ValorUnitario) AS ValorRemessa',
        'SUM(sp.Quantidade) AS qtdItensRemessa',
      ])
      .from('solicitacao', 's')
      .innerJoin('SOLICITACAO_PRODUTO', 'sp', 'sp.SolicitacaoId = s.SolicitacaoId')
      .where('s.DataEnvio BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('s.armazemId = :armazemId', { armazemId })
      .groupBy('s.SolicitacaoId, s.DataEnvio, s.Codigo, s.Tipo')
      .getRawMany();

    const armazemInfo = await this.dataSource
      .createQueryBuilder()
      .select(['a.ArmazemId', 'a.Codigo', 'a.Nome', 'a.CNPJ'])
      .from('ARMAZEM', 'a')
      .where('a.ArmazemId = :armazemId', { armazemId })
      .getRawOne();

    if (!armazemInfo || !armazemInfo.CNPJ) {
      throw new BadRequestException('CNPJ do armazém não encontrado');
    }

    const resultados = pedidos.map((pedido) => ({
      dataEnvio: pedido.DataEnvio,
      remessa: pedido.Codigo || 'Remessa não registrada',
      tipoRemessa: pedido.Tipo || 'Tipo da Remessa não registrada',
      valorRemessa: parseFloat(pedido.ValorRemessa) || 0,
      qtdItensRemessa: parseInt(pedido.qtdItensRemessa, 10) || 0,
    }));

    return {
      armazemInfo,
      items: resultados,
    };
  }

  async getDevolucoesSummary(startDate: string, endDate: string, armazemId: number) {
    const devolucoes = await this.dataSource
      .createQueryBuilder()
      .select([
        'd.DevolucaoId',
        'd.DataDevolucao',
        'LEFT(d.Nfe, 9) AS nfe',
        'COUNT(dpi.DevolucaoItemId) AS qtdItensDevolucao',
      ])
      .from('DEVOLUCAO', 'd')
      .leftJoin('DEVOLUCAO_PRODUTO_ITEM', 'dpi', 'dpi.DevolucaoId = d.DevolucaoId')
      .where('CAST(d.DataDevolucao AS DATE) BETWEEN :startDate AND :endDate', { startDate, endDate })
      .andWhere('d.ArmazemId = :armazemId', { armazemId })
      .groupBy('d.DevolucaoId, d.DataDevolucao, d.Nfe')
      .orderBy('d.DataDevolucao', 'ASC')
      .getRawMany();

    const armazemInfo = await this.dataSource
      .createQueryBuilder()
      .select(['a.ArmazemId', 'a.Codigo', 'a.Nome', 'a.CNPJ'])
      .from('ARMAZEM', 'a')
      .where('a.ArmazemId = :armazemId', { armazemId })
      .getRawOne();

    if (!armazemInfo || !armazemInfo.CNPJ) {
      throw new BadRequestException('CNPJ do armazém não encontrado');
    }

    const resultados = [];

    for (const devolucao of devolucoes) {
      const invoiceNumber = parseInt(devolucao.nfe, 10);
      const invoiceSeries = 1;

      const externalDevolution = await this.getDevolutionByBranchFromExternalApi(
        armazemInfo.CNPJ,
        invoiceNumber,
        invoiceSeries,
      );

      // Log para verificar o objeto retornado da API externa
      console.log('External devolution data:', externalDevolution);

      // Log para ver cada produto e seus detalhes
      externalDevolution.products.forEach((product, index) => {
        console.log(`Produto ${index}:`, product);
      });

      // Cálculo do valor total com log para cada iteração
      const valorTotalDevolucao = externalDevolution.products.reduce((total, product) => {
        const productTotal = product.amount * product.unitCost;
        console.log(
          `Calculando produto - amount: ${product.amount}, unitCost: ${product.unitCost}, subtotal: ${productTotal}`,
        );
        return total + productTotal;
      }, 0);

      console.log('Valor total da devolução calculado:', valorTotalDevolucao);

      resultados.push({
        dataDevolucao: devolucao.DataDevolucao,
        nfe: devolucao.nfe || 'NFE não registrada',
        qtdItensDevolucao: devolucao.qtdItensDevolucao || 0,
        valorTotalDevolucao,
      });
    }

    return {
      armazemInfo,
      items: resultados,
    };
  }

  async getSummaryByUF(UF: string) {
    const query = this.storeSummaryViewRepository
      .createQueryBuilder('view')
      .select([
        'view.LojaId as storeId',
        'view.ClienteCodigo as clientCode',
        'view.LojaCodigo as storeCode',
        'view.LojaDocumento as storeDocument',
        'view.LojaUF as storeState',
        'view.LojaNome as storeName',
        'view.QuantidadeTotalProdutos as totalProducts',
        'view.ProdutosEstoqueCliente as productsInClientStock',
        'view.ProdutosConsumido as consumedProducts',
        'view.ProdutosPreFaturado as preInvoicedProducts',
        'view.ProdutosProcessandoFaturamento as productsProcessingInvoice',
        'view.ProdutosFaturado as invoicedProducts',
        'view.ProdutosDivergencia as divergentProducts',
        'view.ValorTotal as totalValue',
        'view.ValorEstoqueCliente as clientStockValue',
        'view.ValorConsumido as consumedValue',
        'view.ValorPreFaturado as preInvoicedValue',
        'view.ValorProcessandoFaturamento as processingInvoiceValue',
        'view.ValorFaturado as invoicedValue',
        'view.ValorDivergencia as divergentValue',
        'view.DataUltimaContagem as lastInventoryDate',
        'view.ProdutosEstoqueClienteFixo as productsInClientStockFixed',
        'view.ValorEstoqueClienteFixo as clientStockValueFixed',
        'view.ProdutosEstoqueClienteEletivo as productsInClientStockElective',
        'view.ValorEstoqueClienteEletivo as clientStockValueElective',
        'view.ProdutosConsumidoFixo as consumedProductsFixed',
        'view.ValorConsumidoFixo as consumedValueFixed',
        'view.ProdutosConsumidoEletivo as consumedProductsElective',
        'view.ValorConsumidoEletivo as consumedValueElective',
      ])
      .where('view.LojaUF = :UF', { UF });

    const results = await query.getRawMany();

    if (results.length === 0) {
      throw new NotFoundException();
    }

    return results.map((result) => ({
      LojaId: result.storeId,
      ClienteCodigo: result.clientCode,
      LojaCodigo: result.storeCode,
      LojaDocumento: result.storeDocument,
      LojaUF: result.storeState,
      ClienteNome: result.storeName,
      TotalProdutos: result.totalProducts,
      ValorTotalProdutos: result.totalValue,
      ProdutosEstoqueCliente: result.productsInClientStock,
      ValorEstoqueCliente: result.clientStockValue,
      ProdutosConsumido: result.consumedProducts,
      ValorConsumido: result.consumedValue,
      ProdutosPreFaturado: result.preInvoicedProducts,
      ValorPreFaturado: result.preInvoicedValue,
      ProdutosProcessandoFaturamento: result.productsProcessingInvoice,
      ValorProcessandoFaturamento: result.processingInvoiceValue,
      ProdutosFaturado: result.invoicedProducts,
      ValorFaturado: result.invoicedValue,
      ProdutosDivergencia: result.divergentProducts,
      ValorDivergencia: result.divergentValue,
      UltimaContagem: result.lastInventoryDate,
      ProdutosEstoqueClienteFixo: result.productsInClientStockFixed,
      ValorEstoqueClienteFixo: result.clientStockValueFixed,
      ProdutosEstoqueClienteEletivo: result.productsInClientStockElective,
      ValorEstoqueClienteEletivo: result.clientStockValueElective,
      ProdutosConsumidoFixo: result.consumedProductsFixed,
      ValorConsumidoFixo: result.consumedValueFixed,
      ProdutosConsumidoEletivo: result.consumedProductsElective,
      ValorConsumidoEletivo: result.consumedValueElective,
    }));
  }

  async getProductDetailsByEPC(epc: string): Promise<GetProductDetailsByBarcodeDTO> {
    const productItem = await this.productItemRepository.findOne({
      where: { identification: epc },
      relations: ['product'],
    });

    if (!productItem || !productItem.product) {
      throw new BadRequestException('Produto não encontrado para o EPC fornecido.');
    }

    return {
      id: productItem.product.id,
      code: productItem.product.code,
      description: productItem.product.description,
      lote: productItem.lot,
      exp: productItem.expiresAt ? productItem.expiresAt.toISOString() : null,
      epc: productItem.identification,
    };
  }

  async checkIfProductExistsByEPC(epc: string): Promise<boolean> {
    const productCount = await this.productItemRepository.count({
      where: { identification: epc },
      relations: ['product'],
    });

    return productCount > 0;
  }

  async getProductStatusByEPC(epc: string): Promise<UpdateProductItemStatusDto> {
    const product = await this.productItemRepository.findOne({
      where: { identification: epc },
    });

    return { epc, status: product.status };
  }

  async searchProductItems(searchParams: {
    epc?: string;
    lot?: string;
    productCode?: string;
    productDescription?: string;
    orderCode?: string;
    invoiceNumber?: string;
    patientName?: string;
    operationDate?: string;
    status?: string;
  }) {
    const queryBuilder = this.dataSource.getRepository(ProductItemDetailViewAll).createQueryBuilder('productItem');

    if (searchParams.epc) {
      queryBuilder.andWhere('productItem.EPC = :epc', { epc: searchParams.epc });
    }
    if (searchParams.lot) {
      queryBuilder.andWhere('productItem.Lote = :lot', { lot: searchParams.lot });
    }
    if (searchParams.productCode) {
      queryBuilder.andWhere('productItem.Codigo = :productCode', { productCode: searchParams.productCode });
    }
    if (searchParams.productDescription) {
      queryBuilder.andWhere('productItem.Descricao LIKE :productDescription', {
        productDescription: `%${searchParams.productDescription}%`,
      });
    }
    if (searchParams.orderCode) {
      queryBuilder.andWhere('productItem.Remessa = :orderCode', { orderCode: searchParams.orderCode });
    }
    if (searchParams.invoiceNumber) {
      queryBuilder.andWhere('productItem.FaturaRemessa = :invoiceNumber', {
        invoiceNumber: searchParams.invoiceNumber,
      });
    }

    if (searchParams.patientName) {
      queryBuilder.andWhere('productItem.NomePaciente LIKE :patientName', {
        patientName: searchParams.patientName,
      });
    }

    if (searchParams.operationDate) {
      queryBuilder.andWhere('productItem.DataProcedimento = :operationDate', {
        operationDate: searchParams.operationDate,
      });
    }

    if (searchParams.status) {
      queryBuilder.andWhere('productItem.StatusRemessa = :status', {
        status: searchParams.status,
      });
    }

    const productItems = await queryBuilder.getMany();

    if (productItems.length === 0) {
      throw new ProductNotFoundError();
    }

    const groupedItems = productItems.reduce((acc, item) => {
      const key = `${item.productCode}-${item.productDescription}-${item.armazemNome}-${item.storeName}-${item.lot}-${item.status}`;

      if (!acc[key]) {
        acc[key] = {
          productId: item.productId,
          productCode: item.productCode,
          productDescription: item.productDescription,
          armazemNome: item.armazemNome,
          storeName: item.storeName,
          clientId: item.clientId,
          clientCode: item.clientCode,
          storeId: item.storeId,
          storeCode: item.storeCode,
          lot: item.lot,
          status: item.status,
          order: item.orderCode,
          nf: item.invoiceNumber,
          quantity: 0,
        };
      }

      acc[key].quantity += 1;
      return acc;
    }, {});

    return Object.values(groupedItems);
  }

  async getProductPrintsByFilters(
    armazemId: number,
    nomeLoteImpressao?: string,
    produtoLote?: string,
    epc?: string,
  ): Promise<any[]> {
    if (!armazemId) {
      throw new BadRequestException('O armazemId é obrigatório.');
    }

    const query = this.productPrintViewRepository
      .createQueryBuilder('view')
      .select([
        'view.NomeLoteImpressao as NomeLoteImpressao',
        'view.ProdutoId as ProdutoId',
        'view.ProdutoCodigo as ProdutoCodigo',
        'view.ProdutoLote as ProdutoLote',
        'view.ProdutoValidade as ProdutoValidade',
        'view.DataGeracao as DataGeracao',
        'view.ProdutoNome as ProdutoNome',
        'view.EPC as EPC',
        'view.Status as Status',
        'view.LojaNome as LojaNome',
        'view.LojaDocumento as LojaDocumento',
        'view.LojaCodigo as LojaCodigo',
        'view.ClienteCodigo as ClienteCodigo',
      ])
      .where('view.ArmazemId = :armazemId', { armazemId });

    if (nomeLoteImpressao) {
      query.andWhere('view.NomeLoteImpressao = :nomeLoteImpressao', { nomeLoteImpressao });
    }

    if (produtoLote) {
      query.andWhere('view.ProdutoLote = :produtoLote', { produtoLote });
    }

    if (epc) {
      query.andWhere('view.EPC = :epc', { epc });
    }

    const results = await query.getRawMany();

    const groupedData = results.reduce((acc, item) => {
      const {
        NomeLoteImpressao,
        ProdutoId,
        ProdutoLote,
        ProdutoValidade,
        EPC,
        Status,
        DataGeracao,
        ProdutoNome,
        ProdutoCodigo,
        LojaNome,
        LojaDocumento,
        LojaCodigo,
        ClienteCodigo,
      } = item;

      if (!EPC) {
        return acc;
      }

      const existingGroup = acc.find((group) => group.NomeLoteImpressao === NomeLoteImpressao);

      if (existingGroup) {
        existingGroup.existingEpcs.push({ EPC, Status, LojaNome, LojaDocumento, LojaCodigo, ClienteCodigo });
      } else {
        acc.push({
          NomeLoteImpressao,
          ProdutoId,
          ProdutoLote,
          ProdutoValidade,
          existingEpcs: [{ EPC, Status, LojaNome, LojaDocumento, LojaCodigo, ClienteCodigo }],
          DataGeracao,
          ProdutoNome,
          ProdutoCodigo,
        });
      }

      return acc;
    }, []);

    return groupedData;
  }

  /* ----------------------------- Private methods ---------------------------- */

  private async getProductItemsByStoreId(storeId: number) {
    const validProductItemStatusesToUpdateInventory = [
      EProductItemStatus.IN_ELFA_STOCK,
      EProductItemStatus.AWAITING_DELIVERY,
      EProductItemStatus.IN_CLIENT_STOCK,
      EProductItemStatus.STOCK_DISCREPANCY,
      EProductItemStatus.CONSUMED,
    ];

    return this.productItemRepository.find({
      where: {
        movements: { order: { store: { id: storeId } } },
        status: In(validProductItemStatusesToUpdateInventory),
      },
      select: {
        id: true,
        identification: true,
        lot: true,
        expiresAt: true,
        status: true,
      },
      relations: ['product'],
    });
  }

  private async getProductItemsByStoreIdToUpdateInventory(storeId: number) {
    const validProductItemStatusesToUpdateInventory = [
      EProductItemStatus.IN_ELFA_STOCK,
      EProductItemStatus.AWAITING_DELIVERY,
      EProductItemStatus.IN_CLIENT_STOCK,
      EProductItemStatus.STOCK_DISCREPANCY,
      EProductItemStatus.CONSUMED,
      EProductItemStatus.INVOICED,
    ];

    const rawItems = await this.productItemRepository
      .createQueryBuilder('productItem')
      .innerJoinAndSelect('productItem.product', 'product')
      .innerJoin('movimentacao', 'movimentacao', 'movimentacao.ProdutoItemId = productItem.ProdutoItemId')
      .innerJoin('solicitacao', 'solicitacao', 'solicitacao.SolicitacaoId = movimentacao.SolicitacaoId')
      .where('solicitacao.LojaId = :storeId', { storeId })
      .andWhere(
        'solicitacao.DataSolicitacao = (' +
          'SELECT MAX(s2.DataSolicitacao) FROM solicitacao s2 ' +
          'INNER JOIN movimentacao m2 ON m2.SolicitacaoId = s2.SolicitacaoId ' +
          'WHERE m2.ProdutoItemId = productItem.ProdutoItemId' +
          ')',
      )
      .andWhere('productItem.Estado IN (:...validStatuses)', {
        validStatuses: validProductItemStatusesToUpdateInventory,
      })
      .select(['productItem', 'product'])
      .getMany();

    const epcs = rawItems.map((item) => item.identification);
    const unitValuesMap = await this.getUnitValuesForEpcs(epcs);

    const productItems = rawItems.map((item) => ({
      id: item.id,
      identification: item.identification,
      lot: item.lot,
      expiresAt: item.expiresAt,
      status: item.status,
      address: item.address,
      createdAt: item.createdAt,
      consignmentItem: item.consignmentItem,
      consignmentCode: item.consignmentCode,
      printCounter: item.printCounter,
      product: {
        id: item.product?.id,
        code: item.product?.code,
        description: item.product?.description,
        complement: item.product?.complement,
        type: item.product?.type,
        unit: item.product?.unit,
        manufacturer: item.product?.manufacturer,
        isConsigned: item.product?.isConsigned,
        anvisaRegistry: item.product?.anvisaRegistry,
        anvisaVigencyStartDate: item.product?.anvisaVigencyStartDate,
        classification: item.product?.classification,
        speciality: item.product?.speciality,
        modelSizeReference: item.product?.modelSizeReference,
        tissCode: item.product?.tissCode,
        comercialName: item.product?.comercialName,
        technicalName: item.product?.technicalName,
        isActive: item.product?.isActive,
        ean: item.product?.ean,
        reference: item.product?.reference,
        canConvert: item.product?.canConvert,
        conversionFactor: item.product?.conversionFactor,
        conversionType: item.product?.conversionType,
        class: item.product?.class,
        classDescription: item.product?.classDescription,
      },
      printLot: item.printLot,
      movements: item.movements,
      tag: item.tag,
      invoice: item.invoice,
      valorUnitario: unitValuesMap.get(item.identification),
    }));

    return productItems;
  }

  private async extractEpcsFromFile(file: Express.Multer.File): Promise<string[]> {
    const extension = path.extname(file.originalname).toLowerCase();

    if (extension === '.csv') {
      const csvData = await decodeCsv(file, 5);
      return csvData.map((row) => row.split(',')[0]).filter((epc) => epc);
    } else if (extension === '.xls' || extension === '.xlsx') {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const epcs = sheetData
        .slice(1)
        .map((row) => row[0])
        .filter((value) => !!value);

      return epcs as string[];
    } else {
      throw new BadRequestException(`Formato de arquivo não suportado: ${extension}`);
    }
  }

  private async extractEpcsFromMultipleFiles(files: Express.Multer.File[]): Promise<string[]> {
    const allEpcs: string[] = [];
    for (const file of files) {
      const epcs = await this.extractEpcsFromFile(file);
      allEpcs.push(...epcs);
    }
    return allEpcs;
  }

  private sortProductItemsByEpcs(productItems: ProductItem[], csvEpcs: string[]) {
    const convergentIds: number[] = [];
    const divergentIds: number[] = [];

    productItems.forEach((item) => {
      if (csvEpcs.includes(item.identification)) {
        convergentIds.push(item.id);
      } else {
        divergentIds.push(item.id);
      }
    });

    const csvOnlyEpcs = csvEpcs.filter((epc) => !productItems.some((item) => item.identification === epc));

    return { convergentIds, divergentIds, csvOnlyEpcs };
  }

  private async updateProductItemsStatus(entityManager: EntityManager, ids: number[], status: EProductItemStatus) {
    if (ids.length > 0) {
      const validIds = await this.productItemRepository.find({
        where: { id: In(ids), status: Not(EProductItemStatus.INVOICED) },
        select: ['id'],
      });

      const filteredIds = validIds.map((item) => item.id);

      if (filteredIds.length > 0) {
        await entityManager.update(ProductItem, { id: In(filteredIds) }, { status });
      }
    }
  }

  private async getDevolutionByBranchFromExternalApi(
    branchDocument: string,
    invoiceNumber: number,
    invoiceSeries: number,
  ) {
    const [devolution] = await this.elfaApiService.getDevolutionByBranchCGC(
      new ElfmedApiDevolutionByBranchCGCRequestModel(branchDocument, invoiceNumber, invoiceSeries),
    );
    if (!devolution) throw new OrderNotFoundError();
    return devolution;
  }

  private async createInventoryLog(storeId: number, userName: string, fileName: string): Promise<number> {
    const logEntry = this.productInventoryLogRepository.create({
      storeId,
      userName,
      fileName,
    });

    const savedLog = await this.productInventoryLogRepository.save(logEntry);
    return savedLog.id;
  }

  private async processCsvOnlyEpcs(csvOnlyEpcs: string[], groupedProducts: any[]) {
    for (const epc of csvOnlyEpcs) {
      try {
        const item = await this.getProductItemsByIdentification(epc);
        const uniqueKey = `${item.product?.code || 'UNKNOWN'}-${item.lot || 'N/A'}-${item.status}-${item.expiresAt}`;

        let group = groupedProducts.find((g) => {
          const groupKey = `${g.code}-${g.lot}-${g.status}-${g.expiresAt}`;
          return groupKey === uniqueKey;
        });

        if (!group) {
          group = {
            code: item.product?.code || 'UNKNOWN',
            description: item.product?.description || 'Unknown Product',
            lot: item.lot || 'N/A',
            status: item.status,
            expiresAt: item.expiresAt || null,
            quantityPortal: 0,
            quantityCount: 0,
            identifications: new Set<string>(),
            //@ts-expect-error - Valor unitário não é um campo do model
            valorUnitario: item.valorUnitario,
          };
          groupedProducts.push(group);
        }

        group.quantityCount += 1;
      } catch (error) {
        console.error(`EPC ${epc} não encontrado no sistema. Marcado como divergente.`);
      }
    }
  }

  private updateCsvEpcsCount(csvEpcs: string[], productItems: ProductItem[], groupedProducts: any[]) {
    csvEpcs.forEach((epc) => {
      const productItem = productItems.find((item) => item.identification === epc);
      if (productItem) {
        const uniqueKey = `${productItem.product.code}-${productItem.lot}-${productItem.status}-${productItem.expiresAt}`;

        const group = groupedProducts.find((g) => {
          const groupKey = `${g.code}-${g.lot}-${g.status}-${g.expiresAt}`;
          return groupKey === uniqueKey;
        });

        if (group) {
          group.quantityCount += 1;
        }
      }
    });
  }

  private async logInventory(storeId: number, username: string): Promise<number> {
    const filename = `${storeId} - ${Date.now()}`;
    return this.createInventoryLog(storeId, username, filename);
  }

  private async getDiscrepancyIds(csvOnlyEpcs: string[]): Promise<number[]> {
    const existingItems = await this.productItemRepository.find({
      where: {
        identification: In(csvOnlyEpcs),
        status: Not(EProductItemStatus.INVOICED),
      },
    });
    return existingItems.map((item) => item.id);
  }

  private async createDivergences(
    entityManager: EntityManager,
    itemsWithStatus: ProductItem[],
    storeId: number,
    username: string,
  ): Promise<void> {
    const divergences = itemsWithStatus.map((item) => {
      let type: string;
      let originStoreId: number | null = null;

      switch (item.status) {
        case EProductItemStatus.IN_CLIENT_STOCK:
        case EProductItemStatus.CONSUMED:
          type = 'TransferenciasEntreClientes';
          originStoreId = item.movements?.[0]?.order?.store?.id || null;
          break;
        case EProductItemStatus.IN_ELFA_STOCK:
          type = 'VinculoRemessaPedido';
          break;
        default:
          type = 'UNKNOWN';
      }

      return this.divergenceRepository.create({
        user: username,
        storeId,
        productItemId: item.id,
        type,
        originStoreId,
      });
    });

    await entityManager.createQueryBuilder().insert().into(Divergence).values(divergences).execute();
  }

  private async getUnitValuesForEpcs(epcs: string[]): Promise<Map<string, number>> {
    const productItemViews = await this.productItemViewRepository.find({
      where: { epc: In(epcs) },
    });

    const unitValueMap = new Map<string, number>();
    productItemViews.forEach((view) => {
      unitValueMap.set(view.epc, view.unitCost);
    });

    return unitValueMap;
  }

  private buildBaseQuery(storeId: number) {
    return this.dataSource
      .createQueryBuilder()
      .select('vw.LojaId', 'storeId')
      .addSelect('vw.ProdutoId', 'productId')
      .addSelect('vw.Codigo', 'productCode')
      .addSelect('vw.Descricao', 'productDescription')
      .addSelect("SUM(CASE WHEN vw.Estado = 'AGUARDANDO_ENTREGA' THEN 1 ELSE 0 END)", 'awaitingDeliveryAmount')
      .addSelect(
        "SUM(CASE WHEN vw.Estado = 'AGUARDANDO_ENTREGA' THEN vw.ValorUnitario ELSE 0 END)",
        'awaitingDeliveryValue',
      )
      .addSelect("SUM(CASE WHEN vw.Estado = 'ESTOQUE_ELFA' THEN 1 ELSE 0 END)", 'inElfaStockAmount')
      .addSelect("SUM(CASE WHEN vw.Estado = 'ESTOQUE_ELFA' THEN vw.ValorUnitario ELSE 0 END)", 'inElfaStockValue')
      .addSelect("SUM(CASE WHEN vw.Estado = 'ESTOQUE_CLIENTE' THEN 1 ELSE 0 END)", 'inClientStockAmount')
      .addSelect("SUM(CASE WHEN vw.Estado = 'ESTOQUE_CLIENTE' THEN vw.ValorUnitario ELSE 0 END)", 'inClientStockValue')
      .addSelect("SUM(CASE WHEN vw.Estado = 'DIVERGENCIA_ESTOQUE' THEN 1 ELSE 0 END)", 'stockDiscrepancyAmount')
      .addSelect(
        "SUM(CASE WHEN vw.Estado = 'DIVERGENCIA_ESTOQUE' THEN vw.ValorUnitario ELSE 0 END)",
        'stockDiscrepancyValue',
      )
      .addSelect("SUM(CASE WHEN vw.Estado = 'CONSUMIDO' THEN 1 ELSE 0 END)", 'consumedAmount')
      .addSelect("SUM(CASE WHEN vw.Estado = 'CONSUMIDO' THEN vw.ValorUnitario ELSE 0 END)", 'consumedValue')
      .from('VW_PRODUTO_ITEM_DETALHE', 'vw')
      .where('vw.LojaId = :storeId', { storeId });
  }

  private applySearchFilter(qb: any, search?: string) {
    if (search) {
      qb.andWhere('(vw.Codigo = :searchCode OR vw.Descricao LIKE :searchDescription)', {
        searchCode: Number(search),
        searchDescription: `%${search}%`,
      });
    }
    return qb;
  }

  private applyDateFilter(qb: any, startDate?: string, endDate?: string, dateType?: string) {
    if (startDate && endDate && dateType) {
      if (!['DataSolicitacao', 'DataEnvio'].includes(dateType)) {
        throw new BadRequestException('Parâmetro dateType inválido. Utilize "DataSolicitacao" ou "DataEnvio".');
      }
      qb.andWhere(`vw.${dateType} BETWEEN :startDate AND :endDate`, {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });
    }
    return qb;
  }

  private applyProductFilters(
    qb: any,
    lote?: string,
    paciente?: string,
    dataProcedimento?: string,
    remessa?: string,
    faturaRemessa?: string,
    tipoRemessa?: string,
  ) {
    if (lote) {
      qb.andWhere('vw.Lote = :lote', { lote });
    }
    if (paciente) {
      qb.andWhere('vw.Paciente LIKE :paciente', { paciente: `%${paciente}%` });
    }
    if (dataProcedimento) {
      const formattedDate = dataProcedimento.replace(/-/g, '');
      qb = qb.andWhere('vw.DataProcedimento = :dataProcedimento', { dataProcedimento: formattedDate });
    }
    if (remessa) {
      qb.andWhere('vw.Remessa = :remessa', { remessa });
    }
    if (faturaRemessa) {
      qb.andWhere('vw.FaturaRemessa = :faturaRemessa', { faturaRemessa });
    }
    if (tipoRemessa) {
      qb.andWhere('vw.StatusRemessa = :tipoRemessa', { tipoRemessa });
    }
    return qb;
  }

  private applyGroupBy(qb: any) {
    return qb.groupBy('vw.LojaId').addGroupBy('vw.ProdutoId').addGroupBy('vw.Codigo').addGroupBy('vw.Descricao');
  }

  private applySorting(qb: any, sortFilter?: SortFilter<ProductGridView>) {
    const toSortOrder = (order: SortDirection): 'ASC' | 'DESC' => {
      return order.toUpperCase() as 'ASC' | 'DESC';
    };

    if (sortFilter) {
      if (sortFilter.productCode) {
        qb.addOrderBy('vw.Codigo', toSortOrder(sortFilter.productCode));
      }
      if (sortFilter.productDescription) {
        qb.addOrderBy('vw.Descricao', toSortOrder(sortFilter.productDescription));
      }
      if (sortFilter.awaitingDeliveryAmount) {
        qb.addOrderBy('awaitingDeliveryAmount', toSortOrder(sortFilter.awaitingDeliveryAmount));
      }
      if (sortFilter.awaitingDeliveryValue) {
        qb.addOrderBy('awaitingDeliveryValue', toSortOrder(sortFilter.awaitingDeliveryValue));
      }
      if (sortFilter.inClientStockAmount) {
        qb.addOrderBy('inClientStockAmount', toSortOrder(sortFilter.inClientStockAmount));
      }
      if (sortFilter.inClientStockValue) {
        qb.addOrderBy('inClientStockValue', toSortOrder(sortFilter.inClientStockValue));
      }
      if (sortFilter.stockDiscrepancyAmount) {
        qb.addOrderBy('stockDiscrepancyAmount', toSortOrder(sortFilter.stockDiscrepancyAmount));
      }
      if (sortFilter.stockDiscrepancyValue) {
        qb.addOrderBy('stockDiscrepancyValue', toSortOrder(sortFilter.stockDiscrepancyValue));
      }
      if (sortFilter.consumedAmount) {
        qb.addOrderBy('consumedAmount', toSortOrder(sortFilter.consumedAmount));
      }
      if (sortFilter.consumedValue) {
        qb.addOrderBy('consumedValue', toSortOrder(sortFilter.consumedValue));
      }
    }
    return qb;
  }

  private async getTotalCount(qb: SelectQueryBuilder<any>): Promise<number> {
    const countQb = qb.clone();
    countQb.expressionMap.skip = undefined;
    countQb.expressionMap.take = undefined;
    const results = await countQb.getRawMany();
    return results.length;
  }

  private createProductFinanceGridQueryBuilder(
    storeId: number,
    startDate?: string,
    endDate?: string,
    dateType?: string,
    search?: string,
    lote?: string,
    paciente?: string,
    dataProcedimento?: string,
    remessa?: string,
    faturaRemessa?: string,
    tipoRemessa?: string,
    sortFilter?: SortFilter<ProductGridView>,
  ): SelectQueryBuilder<any> {
    let qb = this.dataSource
      .createQueryBuilder()
      .select('vw.ProdutoId', 'productId')
      .addSelect('vw.Codigo', 'productCode')
      .addSelect('vw.Descricao', 'productDescription')
      .addSelect("SUM(CASE WHEN vw.Estado = 'CONSUMIDO' THEN 1 ELSE 0 END)", 'consumedAmount')
      .addSelect("SUM(CASE WHEN vw.Estado = 'CONSUMIDO' THEN vw.ValorUnitario ELSE 0 END)", 'consumedValue')
      .addSelect("SUM(CASE WHEN vw.Estado = 'PRE_FATURADO' THEN 1 ELSE 0 END)", 'preInvoicedAmount')
      .addSelect("SUM(CASE WHEN vw.Estado = 'PRE_FATURADO' THEN vw.ValorUnitario ELSE 0 END)", 'preInvoicedValue')
      .addSelect("SUM(CASE WHEN vw.Estado = 'FATURADO' THEN 1 ELSE 0 END)", 'invoicedAmount')
      .addSelect("SUM(CASE WHEN vw.Estado = 'FATURADO' THEN vw.ValorUnitario ELSE 0 END)", 'invoicedValue')
      .addSelect("SUM(CASE WHEN vw.Estado = 'PROCESSANDO_FATURAMENTO' THEN 1 ELSE 0 END)", 'awaitingInvoicingAmount')
      .addSelect(
        "SUM(CASE WHEN vw.Estado = 'PROCESSANDO_FATURAMENTO' THEN vw.ValorUnitario ELSE 0 END)",
        'awaitingInvoicingAmountValue',
      )
      .from('VW_PRODUTO_ITEM_DETALHE', 'vw')
      .where('vw.LojaId = :storeId', { storeId });

    if (startDate && endDate && dateType) {
      if (!['DataSolicitacao', 'DataEnvio'].includes(dateType)) {
        throw new BadRequestException('Parâmetro dateType inválido. Utilize "DataSolicitacao" ou "DataEnvio".');
      }
      qb.andWhere(`vw.${dateType} BETWEEN :startDate AND :endDate`, {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      });
    }

    if (search) {
      qb.andWhere('(vw.Codigo = :searchCode OR vw.Descricao LIKE :searchDescription)', {
        searchCode: Number(search),
        searchDescription: `%${search}%`,
      });
    }

    qb = this.applyProductFilters(qb, lote, paciente, dataProcedimento, remessa, faturaRemessa, tipoRemessa);
    qb.groupBy('vw.LojaId').addGroupBy('vw.ProdutoId').addGroupBy('vw.Codigo').addGroupBy('vw.Descricao');
    qb = this.applySorting(qb, sortFilter);

    return qb;
  }

  private buildProductDetailsQuery(
    storeId: number,
    productId: number,
    excludedStatuses: EProductItemStatus[],
    additionalFilters?: {
      receivedAt?: string;
      orderCode?: string;
      saleOrderCode?: string;
      epc?: string;
      lot?: string;
      expiresAt?: string;
      status?: string;
      patientName?: string;
      operationDate?: string;
      invoiceNumber?: string;
      invoiceSeries?: string;
    },
  ): SelectQueryBuilder<ProductItemDetailView> {
    let query = this.dataSource.manager
      .createQueryBuilder(ProductItemDetailView, 'productItem')
      .select([
        'productItem.productItemId',
        'productItem.receivedAt',
        'productItem.orderCode',
        'productItem.orderStatus',
        'productItem.saleOrderCode',
        'productItem.unitCost',
        'productItem.totalValue',
        'productItem.epc',
        'productItem.lot',
        'productItem.expiresAt',
        'productItem.status',
        'productItem.orderType',
        'productItem.RemessaInventario',
        'productItem.patientName',
        'productItem.requestedAt',
        'productItem.operationDate',
        'productItem.invoiceNumber',
        'productItem.invoiceSeries',
        'productItem.lastInventoryDate',
      ])
      .where('productItem.storeId = :storeId', { storeId })
      .andWhere('productItem.productId = :productId', { productId })
      .andWhere('productItem.status NOT IN (:...excludedStatuses)', { excludedStatuses });

    if (additionalFilters) {
      query = this.applyAdditionalFilters(query, additionalFilters);
    }

    return query;
  }

  private applyAdditionalFilters(
    query: SelectQueryBuilder<ProductItemDetailView>,
    filters: {
      receivedAt?: string;
      orderCode?: string;
      saleOrderCode?: string;
      epc?: string;
      lot?: string;
      expiresAt?: string;
      status?: string;
      patientName?: string;
      operationDate?: string;
      invoiceNumber?: string;
      invoiceSeries?: string;
    },
  ): SelectQueryBuilder<ProductItemDetailView> {
    if (filters.receivedAt) {
      query.andWhere('productItem.receivedAt = :receivedAt', { receivedAt: filters.receivedAt });
    }
    if (filters.orderCode) {
      query.andWhere('productItem.orderCode = :orderCode', { orderCode: filters.orderCode });
    }
    if (filters.saleOrderCode) {
      query.andWhere('productItem.saleOrderCode = :saleOrderCode', { saleOrderCode: filters.saleOrderCode });
    }
    if (filters.epc) {
      query.andWhere('productItem.epc = :epc', { epc: filters.epc });
    }
    if (filters.lot) {
      query.andWhere('productItem.lot = :lot', { lot: filters.lot });
    }
    if (filters.expiresAt) {
      query.andWhere('productItem.expiresAt = :expiresAt', { expiresAt: filters.expiresAt });
    }
    if (filters.status) {
      query.andWhere('productItem.status = :status', { status: filters.status });
    }
    if (filters.patientName) {
      query.andWhere('productItem.patientName LIKE :patientName', { patientName: `%${filters.patientName}%` });
    }
    if (filters.operationDate) {
      query.andWhere('productItem.operationDate = :operationDate', { operationDate: filters.operationDate });
    }
    if (filters.invoiceNumber) {
      query.andWhere('productItem.invoiceNumber = :invoiceNumber', { invoiceNumber: filters.invoiceNumber });
    }
    if (filters.invoiceSeries) {
      query.andWhere('productItem.invoiceSeries = :invoiceSeries', { invoiceSeries: filters.invoiceSeries });
    }
    return query;
  }

  private applySortFilter(
    query: SelectQueryBuilder<ProductItemDetailView>,
    sortFilter: SortFilter<ProductItemDetailView>,
  ): void {
    Object.entries(sortFilter)
      .filter(([, value]) => value)
      .forEach(([key, value]) => {
        query.addOrderBy(`productItem.${key}`, value.toUpperCase() as 'ASC' | 'DESC');
      });
  }

  private buildProductDetailsCountQuery(
    storeId: number,
    productId: number,
    excludedStatuses: EProductItemStatus[],
    additionalFilters?: {
      receivedAt?: string;
      orderCode?: string;
      saleOrderCode?: string;
      epc?: string;
      lot?: string;
      expiresAt?: string;
      status?: string;
      patientName?: string;
      operationDate?: string;
      invoiceNumber?: string;
      invoiceSeries?: string;
    },
  ): SelectQueryBuilder<ProductItemDetailView> {
    let countQuery = this.dataSource.manager
      .createQueryBuilder(ProductItemDetailView, 'productItem')
      .where('productItem.storeId = :storeId', { storeId })
      .andWhere('productItem.productId = :productId', { productId })
      .andWhere('productItem.status NOT IN (:...excludedStatuses)', { excludedStatuses });

    if (additionalFilters) {
      countQuery = this.applyAdditionalFilters(countQuery, additionalFilters);
    }

    return countQuery;
  }
}
