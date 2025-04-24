import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { CustomElfaApiOrdersRequestModel, EOrderType, EProductItemStatus } from 'src/domain';
import { format } from 'date-fns';
import {
  GetListProductStockClientByStore,
  GetProductStockClientDTO,
  ProductsStockClientOrderDetals,
} from 'src/domain/dtos/get-product-stock-client';
import {
  PostProductsForInvoicesDTO,
  PostProductsForPreInvoicesDTO,
} from 'src/domain/dtos/post-product-stock-costomer-invoiced.dto';
import { InvalidProductInvoiceError } from 'src/errors';
import { DataSource, In, Repository } from 'typeorm';
import { Order, ProductItem, ProductItemDetailView, Store } from '../entities';
import { ProductService } from './product.service';
import { ElfaApiService } from './elfa-api.service';
import { StoreService } from './store.service';
import {
  InvoicedEntityProductsItemResponseDTO,
  InvoicedProductsRequestDTO,
} from 'src/domain/dtos/pre-invoiced-products.dto';
import { GetProductStockClienDTO } from 'src/domain/dtos/get-product-stock-client.dto';
import { PreInvoicing } from '@/entities/pre-invoice.entity';
import { PreInvoicingProduct } from '@/entities/pre-invoice.product.entity';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(PreInvoicing)
    private readonly preInvoicingRepository: Repository<PreInvoicing>,
    @InjectRepository(PreInvoicingProduct)
    private readonly preInvoicingProductRepository: Repository<PreInvoicingProduct>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly productService: ProductService,
    private readonly storeService: StoreService,
    private readonly elfaApiService: ElfaApiService,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async getProductStockClient(
    storeId: number,
    params: GetListProductStockClientByStore,
  ): Promise<ProductsStockClientOrderDetals[]> {
    const products = await this.listProductStockClientByStore(storeId, params);

    return await this.orderProductStore(products);
  }

  async listProductStockClientByStore(
    storeId: number,
    params: GetListProductStockClientByStore,
  ): Promise<GetProductStockClientDTO[]> {
    const query = await this.dataSource.manager.createQueryBuilder(ProductItemDetailView, 'productItem');

    query.select([
      'solicitacao.SolicitacaoId',
      'solicitacao.Codigo as Pedido',
      'solicitacao.DataSolicitacao',
      'solicitacao.Tipo',
      'productItem.ProdutoId',
      'productItem.Codigo',
      'productItem.Descricao',
      'productItem.Lote',
      'productItem.Estado',
      'productItem.DataValidade',
      "STRING_AGG(CAST(productItem.ProdutoItemId AS VARCHAR), ',') as ProdutosItemIds",
      'COUNT(productItem.ProdutoItemId) as Quantidade',
      'productItem.ValorUnitario',
      'SUM(productItem.ValorUnitario) as ValorTotal',
      'productItem.Paciente',
      'productItem.DataProcedimento',
    ]);

    query.innerJoin(Order, 'solicitacao', 'solicitacao.Codigo = productItem.Remessa');
    query.where('productItem.LojaId = :storeId', { storeId });
    query.andWhere('productItem.Estado IN (:status)', { status: EProductItemStatus.CONSUMED });
    query.andWhere('solicitacao.Tipo != :inventoryType', { inventoryType: EOrderType.INVENTARIO });

    if (params.orderCode) {
      query.andWhere('solicitacao.Codigo = :orderCode', { orderCode: params.orderCode });
    }

    if (params.productName) {
      query.andWhere('productItem.Descricao LIKE :productName', { productName: `%${params.productName}%` });
    }

    if (params.lote) {
      query.andWhere('productItem.Lote = :lote', { lote: params.lote });
    }

    if (params.type) {
      query.andWhere('solicitacao.Tipo = :type', { type: params.type });
    }

    if (params.patientName) {
      query.andWhere('productItem.Paciente LIKE :patientName', { patientName: `%${params.patientName}%` });
    }

    query.groupBy('solicitacao.SolicitacaoId');
    query.addGroupBy('solicitacao.Codigo');
    query.addGroupBy('solicitacao.Tipo');
    query.addGroupBy('productItem.Codigo');
    query.addGroupBy('productItem.Descricao');
    query.addGroupBy('productItem.Lote');
    query.addGroupBy('productItem.ValorUnitario');
    query.addGroupBy('solicitacao.DataSolicitacao');
    query.addGroupBy('productItem.Estado');
    query.addGroupBy('solicitacao.SolicitacaoId');
    query.addGroupBy('productItem.ProdutoId');
    query.addGroupBy('productItem.DataValidade');
    query.addGroupBy('productItem.Paciente');
    query.addGroupBy('productItem.DataProcedimento');
    query.orderBy('solicitacao.Codigo', 'ASC');

    const result = await query.getRawMany<GetProductStockClientDTO>();

    const groupedResults = result.reduce((acc, item) => {
      const key = `${item.Pedido}-${item.Codigo}-${item.Lote}`;
      if (!acc[key]) {
        acc[key] = {
          ...item,
          ProdutosItemIds: item.ProdutosItemIds.split(',').map(Number),
          Quantidade: parseInt(item.Quantidade as unknown as string, 10),
          ValorTotal: parseFloat(item.ValorTotal as unknown as string),
        };
      } else {
        acc[key].Quantidade += parseInt(item.Quantidade as unknown as string, 10);
        acc[key].ValorTotal += parseFloat(item.ValorTotal as unknown as string);
        acc[key].ProdutosItemIds.push(...item.ProdutosItemIds.split(',').map(Number));
      }
      return acc;
    }, {});

    return Object.values(groupedResults) as GetProductStockClientDTO[];
  }

  // * Rota interna, Solicita o pedido de faturamento.
  async postProductsForPreInvoices(params: PostProductsForPreInvoicesDTO, username: string) {
    const store = await this.storeService.getStoreById(params.lojaId);

    const productsRequests: number[] = params.pedidos.flatMap((pedido) => pedido.produtosItemId);
    const productsDataBase = await this.listProductStockClientByStoreConsumed(params.lojaId, productsRequests);

    await this.checkListProductStockClientByStoreConsumed(productsRequests, productsDataBase);

    const itens = this.mapProductItens(productsDataBase, store);
    const groupedItems = this.groupItems(itens);

    const branchCGCs = productsDataBase.length > 0 ? productsDataBase[0].armazemCNPJ : '';

    const operationId = await this.createPreInvoicingRecord(params, store.id, username);
    const paramsRequest = this.createInvoicedProductsRequest(
      params,
      store,
      groupedItems,
      operationId,
      branchCGCs,
      username,
    );
    await this.elfaApiService.preInvoicedProducts(paramsRequest);
    await this.productService.updateProductItemsStatusGroup(productsRequests, EProductItemStatus.PROCESSING_INVOICED);
  }

  // * 1. Inclusão/Não inclusão do faturamento.
  async postProductsForFirstEventInvoices(
    paramsArray: {
      CustomerCGC: string;
      OperationId: string;
      ExternalOrderNumber: number;
      Status: number;
    }[],
  ): Promise<void> {
    for (const params of paramsArray) {
      const { OperationId, ExternalOrderNumber, Status } = params;

      const order = await this.orderRepository.findOne({
        where: { code: ExternalOrderNumber },
      });

      if (!order) {
        throw new Error(`No order found with ExternalOrderNumber: ${ExternalOrderNumber}`);
      }

      const preInvoicingProducts = await this.preInvoicingProductRepository.find({
        where: {
          OperationId,
          SolicitacaoId: order.id,
        },
        relations: ['productItem'],
      });

      if (!preInvoicingProducts || preInvoicingProducts.length === 0) {
        throw new Error(`No products found for OperationId: ${OperationId}`);
      }

      const productItemIds = preInvoicingProducts.map((product) => product.ProdutoItemId);

      await this.updateProductItemsStatus(
        productItemIds,
        Status === 1 ? EProductItemStatus.PRE_INVOICED : EProductItemStatus.FAILED_PRE_INVOICED,
      );
    }
  }

  // * 2. Confirmação/Cancelamento do faturamento
  async postProductsForInvoices(paramsArray: PostProductsForInvoicesDTO[]) {
    for (const params of paramsArray) {
      const epcs = params.Epcs;

      if (!epcs || epcs.length === 0) {
        throw new Error(`No EPCs provided for ExternalOrderNumber: ${params.ExternalOrderNumber}`);
      }

      const productItems = await this.preInvoicingProductRepository.find({
        where: {
          productItem: {
            identification: In(epcs),
          },
        },
        relations: ['productItem'],
      });

      if (!productItems || productItems.length === 0) {
        throw new Error(`No products found for EPCs in ExternalOrderNumber: ${params.ExternalOrderNumber}`);
      }

      const productItemIds = productItems.map((item) => item.ProdutoItemId);

      await this.updateProductItemsStatus(
        productItemIds,
        params.Status === 1 ? EProductItemStatus.INVOICED : EProductItemStatus.FAILED_INVOICED,
      );

      await this.updatePreInvoicingStatus(
        params.OperationId,
        params.Status === 1 ? 'SUCCESS' : 'FAILED',
        params.Description,
      );
    }

    return 'success';
  }

  /* ----------------------------- Private methods ---------------------------- */

  /* -------------------------- getProductStockClient ------------------------- */
  private async orderProductStore(products: GetProductStockClientDTO[]): Promise<ProductsStockClientOrderDetals[]> {
    const productsReturn: { [key: number]: ProductsStockClientOrderDetals } = {};

    for (const product of products) {
      if (!productsReturn[product.Pedido]) {
        productsReturn[product.Pedido] = {
          SolicitacaoId: product.SolicitacaoId,
          Codigo: product.Pedido,
          DataSolicitacao: product.DataSolicitacao,
          Tipo: product.Tipo,
          UsuarioAlteracao: '',
          Paciente: product.Paciente,
          DataProcedimento: product.DataProcedimento,
          produtos: [
            {
              ProdutoId: product.ProdutoId,
              ProdutosItemIds: product.ProdutosItemIds,
              ProdutoItemId: product.ProdutoItemId,
              Nome: product.Descricao,
              Codigo: product.Codigo,
              Lote: product.Lote,
              DataValidade: product.DataValidade,
              Quantidade: product.Quantidade,
              ValorUnitario: product.ValorUnitario,
              ValorTotal: product.ValorTotal,
            },
          ],
        };
      } else {
        productsReturn[product.Pedido].produtos.push({
          ProdutoId: product.ProdutoId,
          ProdutoItemId: product.ProdutoItemId,
          ProdutosItemIds: product.ProdutosItemIds,
          Nome: product.Descricao,
          Codigo: product.Codigo,
          Lote: product.Lote,
          DataValidade: product.DataValidade,
          Quantidade: product.Quantidade,
          ValorUnitario: product.ValorUnitario,
          ValorTotal: product.ValorTotal,
        });
      }
    }

    return Object.values(productsReturn);
  }

  /* ----------------------- postProductsForPreInvoices ----------------------- */
  private async listProductStockClientByStoreConsumed(
    storeId: number,
    ProdutoItemIds: number[],
  ): Promise<GetProductStockClientDTO[]> {
    const results = await this.dataSource.manager
      .createQueryBuilder(ProductItemDetailView, 'productItemDetail')
      .select([
        'solicitacao.SolicitacaoId',
        'solicitacao.Codigo as Pedido',
        'solicitacao.DataSolicitacao',
        'productItem.ProdutoItemId',
        'productItem.ProdutoId',
        'productItemDetail.Codigo',
        'productItemDetail.Descricao',
        'productItem.Lote',
        'productItem.ItemConsignado',
        'productItem.CodigoConsignado',
        'productItem.Estado',
        'productItem.DataValidade',
        'COUNT(productItem.ProdutoItemId) as Quantidade',
        'productItemDetail.ValorUnitario',
        'productItemDetail.ValorUnitario * COUNT(productItem.ProdutoItemId) as ValorTotal',
        'productItemDetail.armazemCNPJ as armazemCNPJ',
        'productItem.Identificacao as EPC',
      ])
      .innerJoin(Order, 'solicitacao', 'solicitacao.Codigo = productItemDetail.Remessa')
      .innerJoin(ProductItem, 'productItem', 'productItemDetail.ProdutoItemId = productItem.ProdutoItemId')
      .where('productItemDetail.LojaId = :storeId', { storeId })
      .andWhere('productItemDetail.Estado IN (:status)', { status: EProductItemStatus.CONSUMED })
      .andWhere('productItemDetail.ProdutoItemId IN (:...ProdutoItemIds)', { ProdutoItemIds })
      .groupBy('solicitacao.Codigo')
      .addGroupBy('productItemDetail.Codigo')
      .addGroupBy('productItemDetail.Descricao')
      .addGroupBy('productItem.Lote')
      .addGroupBy('productItem.ItemConsignado')
      .addGroupBy('productItem.CodigoConsignado')
      .addGroupBy('productItemDetail.ValorUnitario')
      .addGroupBy('solicitacao.DataSolicitacao')
      .addGroupBy('productItem.Estado')
      .addGroupBy('solicitacao.SolicitacaoId')
      .addGroupBy('productItem.ProdutoId')
      .addGroupBy('productItem.DataValidade')
      .addGroupBy('productItem.ProdutoItemId')
      .addGroupBy('productItemDetail.armazemCNPJ')
      .addGroupBy('productItem.Identificacao')
      .orderBy('solicitacao.Codigo', 'ASC')
      .getRawMany<GetProductStockClientDTO>();

    return results;
  }

  private async checkListProductStockClientByStoreConsumed(
    productsRequests: number[],
    productsDataBase: GetProductStockClientDTO[],
  ) {
    productsRequests.map((productRequest) => {
      const exist = productsDataBase.find((productDataBase) => productDataBase.ProdutoItemId === productRequest);

      if (!exist) {
        throw new InvalidProductInvoiceError();
      }
    });
  }

  private async createPreInvoicingRecord(
    params: PostProductsForPreInvoicesDTO,
    storeId: number,
    username: string,
  ): Promise<string> {
    const preInvoicing = new PreInvoicing();
    preInvoicing.StoreId = storeId;
    preInvoicing.DataProcedimento = params.dataProcedimento;
    preInvoicing.Procedimento = params.procedimento;
    preInvoicing.NomeMedico = params.nomeMedico;
    preInvoicing.CRM = params.CRM;
    preInvoicing.NomePaciente = params.nomePaciente;
    preInvoicing.Observacao = params.Obsevacao;
    preInvoicing.NomeConvenio = params.nomeConvenio;
    preInvoicing.Status = 'WAITING';
    preInvoicing.Usuario = username;

    preInvoicing.produtos = params.pedidos.flatMap((pedido) =>
      pedido.produtosItemId.map((produtoItemId) => {
        const product = new PreInvoicingProduct();
        product.SolicitacaoId = pedido.SolicitacaoId;
        product.ProdutoItemId = produtoItemId;
        return product;
      }),
    );

    const result = await this.preInvoicingRepository.save(preInvoicing);
    return result.OperationId;
  }

  private mapProductItens(
    productsDataBase: GetProductStockClientDTO[],
    store: Store,
  ): InvoicedEntityProductsItemResponseDTO[] {
    const productsReturn = productsDataBase.map((product) => {
      return {
        ProductCode: String(product.Codigo).padStart(7, '0'),
        Quantity: product.Quantidade,
        ConsignmentItem: product.ItemConsignado,
        ConsignmentCode: product.CodigoConsignado,
        Price: product.ValorUnitario,
        TotalValue: product.ValorTotal,
        BatchCode: product.Lote,
        Code: String(product.ProdutoItemId).padStart(7, '0'),
        ExternalOrderNumber: String(product.Pedido),
        Inactive: false,
        StartsAt: format(new Date(product.DataSolicitacao), 'yyyyMMdd'),
        EndsAt: format(new Date(product.DataValidade), 'yyyyMMdd'),
        UF: store.state,
        Batch: product.Lote,
        MininalPrice: product.ValorUnitario,
        DiscountPercentage: 0.0,
        Validity: format(new Date(product.DataValidade), 'yyyyMMdd'),
        Epcs: [product.EPC],
      };
    });

    return productsReturn;
  }

  private groupItems(
    itens: InvoicedEntityProductsItemResponseDTO[],
  ): Record<string, InvoicedEntityProductsItemResponseDTO> {
    return itens.reduce<Record<string, InvoicedEntityProductsItemResponseDTO>>((acc, item) => {
      const key = `${item.ProductCode}-${item.BatchCode}-${item.ExternalOrderNumber}`;
      if (!acc[key]) {
        acc[key] = {
          ...item,
          Quantity: item.Quantity,
          TotalValue: item.TotalValue,
          Epcs: [...(item.Epcs || [])],
        };
      } else {
        acc[key].Quantity += item.Quantity;
        acc[key].TotalValue += item.TotalValue;
        acc[key].Epcs = [...(acc[key].Epcs || []), ...(item.Epcs || [])];
      }
      acc[key].TotalValue = Math.round(acc[key].TotalValue * 100) / 100;
      return acc;
    }, {});
  }

  private createInvoicedProductsRequest(
    params: PostProductsForPreInvoicesDTO,
    store: Store,
    groupedItems: Record<string, InvoicedEntityProductsItemResponseDTO>,
    operationId: string,
    branchCGC: string,
    username: string,
  ): InvoicedProductsRequestDTO {
    return {
      CustomerCGC: store.document,
      BranchCGC: branchCGC,
      OperationId: operationId,
      LaboratoryId: 'RFD',
      OrderMessage: params.Obsevacao,
      PaymentTermCode: params.pagamento,
      UpdatedByUser: username,
      Installments: {
        Installment1Value: 0,
        Installment1Date: '0',
        Installment2Value: 0,
        Installment2Date: '0',
        Installment3Value: 0,
        Installment3Date: '0',
        Installment4Value: 0,
        Installment4Date: '0',
      },
      MedicalProfessionalName: params.nomeMedico,
      MedicalProfessionalLicense: params.CRM,
      PatientName: params.nomePaciente,
      InsuranceCustomerCode: params.codigoConvenio,
      InsuranceCustomerBranch: params.branchConvenio,
      InsuranceName: params.nomeConvenio,
      InvoiceCustomerCode: '0',
      InvoiceCustomerBranch: '0',
      UpdateDate: params.dataProcedimento,
      UpdateTime: '12:00',
      ConsignmentType: '1',
      OperationDate: params.dataProcedimento,
      Items: Object.values(groupedItems).map((item) => ({
        ExternalOrderNumber: item.ExternalOrderNumber,
        ProductCode: item.ProductCode,
        Quantity: item.Quantity,
        ConsignmentCode: item.ConsignmentCode,
        ConsignmentItem: item.ConsignmentItem,
        Price: item.Price,
        TotalValue: item.TotalValue,
        BatchCode: item.BatchCode,
        Epcs: item.Epcs,
      })),
    };
  }

  private async getBranchCGCsForGroupedItems(
    groupedItems: Record<string, InvoicedEntityProductsItemResponseDTO>,
    store: Store,
  ): Promise<string[]> {
    return await Promise.all(
      Object.values(groupedItems).map(async (item) => {
        const response = await this.elfaApiService.getOrders(
          new CustomElfaApiOrdersRequestModel(store.document, Number(item.ExternalOrderNumber)),
        );
        return response[0]?.BranchCGC || '0';
      }),
    );
  }

  /* ------------------------- postProductsForInvoices ------------------------ */
  private async listProductStockClientPreInvoiced(
    storeId: number,
    productCode: number,
    batchCode: string,
    orderCode: number,
  ): Promise<GetProductStockClienDTO[]> {
    const results = await this.dataSource.manager
      .createQueryBuilder(ProductItemDetailView, 'productItemDetail')
      .select([
        'productItem.ProdutoItemId ProdutoItemId',
        'productItem.Lote Lote',
        'productItem.ProdutoId ProdutoId',
        'productItem.Estado Estado',
      ])
      .innerJoin(Order, 'solicitacao', 'solicitacao.Codigo = productItemDetail.Remessa')
      .innerJoin(ProductItem, 'productItem', 'productItemDetail.ProdutoItemId = productItem.ProdutoItemId')
      .where('productItemDetail.LojaId = :storeId', { storeId })
      .andWhere('productItemDetail.Estado IN (:status)', { status: EProductItemStatus.PRE_INVOICED })
      .andWhere('productItemDetail.Codigo = :productCode', { productCode })
      .andWhere('productItemDetail.Lote = :batchCode', { batchCode })
      .andWhere('productItemDetail.Remessa = :orderCode', { orderCode })
      .getRawMany<GetProductStockClienDTO>();

    return results;
  }

  private async updatePreInvoicingStatus(OperationId: string, Status: string, Description?: string): Promise<void> {
    await this.preInvoicingRepository.update(OperationId, { Status, Description });
  }

  private async processProducts(
    params: PostProductsForInvoicesDTO,
    productsDataBase: GetProductStockClienDTO[],
  ): Promise<void> {
    if (params.Status === 1) {
      for (let i = 0; i < params.Quantity; i++) {
        const productToUpdate = productsDataBase[i];
        await this.productService.updateProductItemsStatusGroup(
          [productToUpdate.ProdutoItemId],
          EProductItemStatus.INVOICED,
        );
      }

      await this.updatePreInvoicingStatus(params.OperationId, 'SUCCESS', params.Description);
    } else if (params.Status === 0) {
      await this.updatePreInvoicingStatus(params.OperationId, 'FAILED', params.Description);
    }
  }

  private async updateProductItemsStatus(ids: number[], status: EProductItemStatus): Promise<void> {
    if (ids.length > 0) {
      await this.preInvoicingProductRepository.manager.update(ProductItem, { id: In(ids) }, { status: status });
    }
  }
}
