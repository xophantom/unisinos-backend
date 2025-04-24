import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

import {
  ExportPendingInvoicingProductsListSwagger,
  GetStoreAntennaStatusSwagger,
  GetStoreDetailsSwagger,
  GetStoreProductMetricsSwagger,
  GetStoreProductsFinanceMetricsSwagger,
  ListPendingInvoicingProductsSwagger,
  ListStoreProductsFinanceSwagger,
  ListStoreProductsSwagger,
  UpdateStoreProductInventorySwagger,
} from '../openapi';
import { SortDirection, SortFilter } from '../domain';
import { SortQuery } from '../decorators';
import { ProductConsumedGridView, ProductGridView, ProductItemDetailView } from '../entities';
import { StoreService } from 'src/services/store.service';
import { ProductService } from 'src/services/product.service';
import { User } from 'src/decorators/user.decorator';
import { UserDetails } from 'src/domain/interfaces/user-cognito';

@ApiTags('Lojas')
@Controller('stores')
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    private readonly productService: ProductService,
  ) {}

  @GetStoreDetailsSwagger()
  @Get(':storeId')
  async getStoreInfo(@Param('storeId', ParseIntPipe) storeId: number) {
    const store = await this.storeService.getStoreInfo(storeId);
    return { ...store, cnpj: store?.document };
  }

  @GetStoreAntennaStatusSwagger()
  @Get(':storeId/antenna-status')
  async getStoreAntennaStatus(@Param('storeId', ParseIntPipe) storeId: number) {
    return this.storeService.getStoreAntennaStatus(storeId);
  }

  @GetStoreProductMetricsSwagger()
  @Get(':storeId/products/metrics')
  async getStoreProductMetrics(
    @Param('storeId', ParseIntPipe) storeId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('dateType') dateType: string,
  ) {
    return this.productService.getStoreProductMetrics(storeId, startDate, endDate, dateType);
  }

  @GetStoreProductsFinanceMetricsSwagger()
  @Get(':storeId/products/finance-metrics')
  async getStoreProductsFinanceMetrics(
    @Param('storeId', ParseIntPipe) storeId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('dateType') dateType: string,
  ) {
    return this.productService.getStoreProductsFinanceMetrics(storeId, startDate, endDate, dateType);
  }

  @ListStoreProductsSwagger()
  @Get(':storeId/products')
  async listStoreProducts(
    @Param('storeId', ParseIntPipe) storeId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
    @Query('search') search?: string,
    @SortQuery('productCode') productCode?: SortDirection,
    @SortQuery('productDescription') productDescription?: SortDirection,
    @SortQuery('awaitingDeliveryAmount') awaitingDeliveryAmount?: SortDirection,
    @SortQuery('awaitingDeliveryValue') awaitingDeliveryValue?: SortDirection,
    @SortQuery('inClientStockAmount') inClientStockAmount?: SortDirection,
    @SortQuery('inClientStockValue') inClientStockValue?: SortDirection,
    @SortQuery('stockDiscrepancyAmount') stockDiscrepancyAmount?: SortDirection,
    @SortQuery('stockDiscrepancyValue') stockDiscrepancyValue?: SortDirection,
    @SortQuery('consumedAmount') consumedAmount?: SortDirection,
    @SortQuery('consumedValue') consumedValue?: SortDirection,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('dateType') dateType?: string,
    @Query('lote') lote?: string,
    @Query('paciente') paciente?: string,
    @Query('dataProcedimento') dataProcedimento?: string,
    @Query('remessa') remessa?: string,
    @Query('faturaRemessa') faturaRemessa?: string,
    @Query('tipoRemessa') tipoRemessa?: string,
  ) {
    const sortFilter: SortFilter<ProductGridView> = {
      productCode,
      productDescription,
      awaitingDeliveryAmount,
      awaitingDeliveryValue,
      inClientStockAmount,
      inClientStockValue,
      stockDiscrepancyAmount,
      stockDiscrepancyValue,
      consumedAmount,
      consumedValue,
    };

    return this.productService.listStoreProducts(
      storeId,
      page,
      pageSize,
      search,
      startDate,
      endDate,
      dateType,
      lote,
      paciente,
      dataProcedimento,
      remessa,
      faturaRemessa,
      tipoRemessa,
      sortFilter,
    );
  }

  @ListStoreProductsFinanceSwagger()
  @Get(':storeId/products/finance')
  async listStoreProductsFinance(
    @Param('storeId', ParseIntPipe) storeId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('dateType') dateType?: string,
    @Query('search') search?: string,
    @Query('lote') lote?: string,
    @Query('paciente') paciente?: string,
    @Query('dataProcedimento') dataProcedimento?: string,
    @Query('remessa') remessa?: string,
    @Query('faturaRemessa') faturaRemessa?: string,
    @Query('tipoRemessa') tipoRemessa?: string,
    @SortQuery('productCode') productCode?: SortDirection,
    @SortQuery('productDescription') productDescription?: SortDirection,
    @SortQuery('consumedAmount') consumedAmount?: SortDirection,
    @SortQuery('consumedValue') consumedValue?: SortDirection,
    @SortQuery('preInvoicedAmount') preInvoicedAmount?: SortDirection,
    @SortQuery('preInvoicedValue') preInvoicedValue?: SortDirection,
    @SortQuery('invoicedAmount') invoicedAmount?: SortDirection,
    @SortQuery('invoicedValue') invoicedValue?: SortDirection,
    @SortQuery('awaitingInvoicingAmount') awaitingInvoicingAmount?: SortDirection,
    @SortQuery('awaitingInvoicingAmountValue') awaitingInvoicingAmountValue?: SortDirection,
  ) {
    const sortFilter: SortFilter<ProductGridView> = {
      productCode,
      productDescription,
      consumedAmount,
      consumedValue,
      preInvoicedAmount,
      preInvoicedValue,
      invoicedAmount,
      invoicedValue,
      awaitingInvoicingAmount,
      awaitingInvoicingAmountValue,
    };
    return this.productService.listStoreProductsFinance(
      storeId,
      page,
      pageSize,
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
  }

  @Get(':storeId/products/:productId/details')
  async listStoreProductsDetails(
    @Param('storeId', ParseIntPipe) storeId: number,
    @Param('productId', ParseIntPipe) productId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(50), ParseIntPipe) pageSize: number,
    @SortQuery('receivedAt') sortReceivedAt?: SortDirection,
    @SortQuery('orderCode') sortOrderCode?: SortDirection,
    @SortQuery('saleOrderCode') sortSaleOrderCode?: SortDirection,
    @SortQuery('epc') sortEpc?: SortDirection,
    @SortQuery('lot') sortLot?: SortDirection,
    @SortQuery('expiresAt') sortExpiresAt?: SortDirection,
    @SortQuery('status') sortStatus?: SortDirection,
    @SortQuery('PatientName') sortPatientName?: SortDirection,
    @SortQuery('OperationDate') sortOperationDate?: SortDirection,
    @SortQuery('InvoiceNumber') sortInvoiceNumber?: SortDirection,
    @SortQuery('InvoiceSeries') sortInvoiceSeries?: SortDirection,
    @Query('qReceivedAt') filterReceivedAt?: string,
    @Query('qOrderCode') filterOrderCode?: string,
    @Query('qSaleOrderCode') filterSaleOrderCode?: string,
    @Query('qEpc') filterEpc?: string,
    @Query('qLot') filterLot?: string,
    @Query('qExpiresAt') filterExpiresAt?: string,
    @Query('qStatus') filterStatus?: string,
    @Query('qPatientName') patientName?: string,
    @Query('qOperationDate') operationDate?: string,
    @Query('qInvoiceNumber') invoiceNumber?: string,
    @Query('qInvoiceSeries') invoiceSeries?: string,
  ) {
    const sortFilter: SortFilter<ProductItemDetailView> = {
      receivedAt: sortReceivedAt,
      orderCode: sortOrderCode,
      saleOrderCode: sortSaleOrderCode,
      epc: sortEpc,
      lot: sortLot,
      expiresAt: sortExpiresAt,
      status: sortStatus,
      patientName: sortPatientName,
      operationDate: sortOperationDate,
      invoiceNumber: sortInvoiceNumber,
      invoiceSeries: sortInvoiceSeries,
    };

    const additionalFilters = {
      receivedAt: filterReceivedAt,
      orderCode: filterOrderCode,
      saleOrderCode: filterSaleOrderCode,
      epc: filterEpc,
      lot: filterLot,
      expiresAt: filterExpiresAt,
      status: filterStatus,
      patientName,
      operationDate,
      invoiceNumber,
      invoiceSeries,
    };

    return this.productService.listStoreProductsDetails(
      storeId,
      productId,
      page,
      pageSize,
      sortFilter,
      additionalFilters,
    );
  }

  @Get(':storeId/products/inventory')
  async getStoreProductInventory(@Param('storeId', ParseIntPipe) storeId: number) {
    return this.productService.getStoreProductInventory(storeId);
  }

  @UpdateStoreProductInventorySwagger()
  @Post(':storeId/products/update-inventory')
  @UseInterceptors(FilesInterceptor('file'))
  async updateStoreProductInventory(
    @Param('storeId', ParseIntPipe) storeId: number,
    @User() user: UserDetails,
    @UploadedFiles() file: Express.Multer.File[],
  ) {
    console.log(file[0]);
    const username = user.email || user.username;
    return this.productService.updateStoreProductInventory(storeId, file, username);
  }

  @ListPendingInvoicingProductsSwagger()
  @Get(':storeId/products/pending-invoicing')
  async listPendingInvoicingProducts(
    @Param('storeId', ParseIntPipe) storeId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
    @SortQuery('productCode') productCode?: SortDirection,
    @SortQuery('productDescription') productDescription?: SortDirection,
    @SortQuery('lot') lot?: SortDirection,
    @SortQuery('expiresAt') expiresAt?: SortDirection,
    @SortQuery('consumedAmount') consumedAmount?: SortDirection,
    @SortQuery('consumedValue') consumedValue?: SortDirection,
  ) {
    const sortFilter: SortFilter<ProductConsumedGridView> = {
      productCode,
      productDescription,
      lot,
      expiresAt,
      consumedAmount,
      consumedValue,
    };

    return this.productService.listPendingInvoicingProducts(storeId, page, pageSize, sortFilter);
  }

  @ExportPendingInvoicingProductsListSwagger()
  @Get(':storeId/products/pending-invoicing/export')
  async exportPendingInvoicingProductsList(@Res() res: Response, @Param('storeId') storeId: number) {
    const csvString = await this.productService.exportCsvPendingInvoicingProductsList(storeId);
    res.header('Content-Type', 'text/csv; charset=utf-8');
    res.attachment('product-items.csv');
    res.send(csvString);
  }

  @Get(':storeId/logs')
  async listStoreLogs(@Param('storeId', ParseIntPipe) storeId: number) {
    return this.storeService.getStoreLogs(storeId);
  }

  @Get('metadata/sellers')
  async getSellers() {
    return this.storeService.getSellers();
  }

  @Get('metadata/states')
  async getStates() {
    return this.storeService.getStates();
  }
}
