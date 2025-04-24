import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import {
  GetWarehouseOrderDetailsDto,
  ImportWarehouseOrderDetailsDto,
  mapToGetWarehouseOrderDetailsDto,
} from '../domain';
import {
  GetWarehouseOrderDetailsSwagger,
  ImportWarehouseOrderDetailsSwagger,
  ListWarehousePrintersSwagger,
  ListWarehouseProductStocksSwagger,
  ListWarehouseSwagger,
} from '../openapi/warehouse.controller.swagger';

import { DevolutionService } from 'src/services/devolution.service';
import { WarehouseService } from 'src/services/warehouse.service';
import { applyProductConversion } from 'src/tools/productConversion';

@ApiTags('Armazéns')
@Controller('warehouses')
export class WarehouseController {
  constructor(
    private readonly warehouseService: WarehouseService,
    private readonly devolutionService: DevolutionService,
  ) {}

  @ListWarehouseSwagger()
  @Get()
  async listWarehouses(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe)
    pageSize: number,
  ) {
    return this.warehouseService.listWarehouses(page, pageSize);
  }

  @ListWarehousePrintersSwagger()
  @Get(':warehouseId/printers')
  async listWarehousePrinters(
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe)
    pageSize: number,
  ) {
    return this.warehouseService.listWarehousePrinters(warehouseId, page, pageSize);
  }

  @ListWarehouseProductStocksSwagger()
  @Get(':warehouseId/products/code/:code/stocks')
  async listWarehouseProductStocks(
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Param('code') code: string,
  ) {
    return this.warehouseService.listWarehouseProductStocks(warehouseId, code);
  }

  @Get(':warehouseId/products/stocks')
  async listWarehouseProductStocksByDescription(
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Query('description') description?: string,
  ) {
    return this.warehouseService.listWarehouseProductStocksByDescription(warehouseId, description);
  }

  @GetWarehouseOrderDetailsSwagger()
  @Get(':warehouseId/orders/code/:orderCode/details')
  async getWarehouseOrderDetails(
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Param('orderCode', ParseIntPipe) orderCode: number,
  ): Promise<GetWarehouseOrderDetailsDto> {
    const response = await this.warehouseService.getWarehouseOrderDetails(warehouseId, orderCode);
    return mapToGetWarehouseOrderDetailsDto(response);
  }

  @ImportWarehouseOrderDetailsSwagger()
  @HttpCode(HttpStatus.CREATED)
  @Post(':warehouseId/orders/code/:orderCode/import')
  async importWarehouseOrderDetails(
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Param('orderCode', ParseIntPipe) orderCode: number,
    @Body() body: ImportWarehouseOrderDetailsDto,
  ) {
    return this.warehouseService.importWarehouseOrderDetails(warehouseId, orderCode, body);
  }

  @Get(':warehouseId/devolution/nfe/:invoiceNumber/:invoiceSeries/store/:storeDocument/details')
  async getWarehouseOrderDevolution(
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Param('invoiceNumber', ParseIntPipe) invoiceNumber: number,
    @Param('invoiceSeries', ParseIntPipe) invoiceSeries: number,
    @Param('storeDocument') storeDocument: string,
  ): Promise<GetWarehouseOrderDetailsDto> {
    const response = await this.devolutionService.getWarehouseDevolution(
      warehouseId,
      invoiceNumber,
      invoiceSeries,
      storeDocument,
    );
    response.order.products = await applyProductConversion(
      response.order.products,
      this.devolutionService.productRepository,
    );
    response.order.totalAmount = response.order.products.reduce((sum, product) => sum + product.amount, 0);

    return mapToGetWarehouseOrderDetailsDto(response);
  }

  @ImportWarehouseOrderDetailsSwagger()
  @HttpCode(HttpStatus.CREATED)
  @Post(':warehouseId/devolution/nfe/:invoiceNumber/:invoiceSeries/store/:storeDocument/import')
  async importWarehouseOrderDevolution(
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Param('invoiceNumber', ParseIntPipe) invoiceNumber: number,
    @Param('invoiceSeries', ParseIntPipe) invoiceSeries: number,
    @Param('storeDocument') storeDocument: string,
    @Body() body: ImportWarehouseOrderDetailsDto,
  ) {
    return this.devolutionService.importWarehouseOrderDevolution(
      warehouseId,
      invoiceNumber,
      invoiceSeries,
      storeDocument,
      body,
    );
  }

  @Get(':warehouseId/devolutions')
  async getWarehouseDevolutions(
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Query('invoiceNumber') invoiceNumber?: number,
    @Query('invoiceSeries') invoiceSeries?: number,
    @Query('storeDocument') storeDocument?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.devolutionService.getWarehouseDevolutions(
      warehouseId,
      invoiceNumber,
      invoiceSeries,
      storeDocument,
      page ? page : 1,
      pageSize ? pageSize : 10,
    );
  }

  @Get(':warehouseId/orders')
  async getWarehouseOrders(
    @Param('warehouseId', ParseIntPipe) warehouseId: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
    @Query('orderNumber') orderNumber?: string,
  ) {
    return this.warehouseService.getWarehouseOrders(
      warehouseId,
      page,
      pageSize,
      orderNumber ? Number(orderNumber) : undefined,
    );
  }
}
