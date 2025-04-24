import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetProductDetailsByCodeSwagger } from 'src/openapi/product.controller.swagger';
import { GetProductDetailsByIdSwagger } from '../openapi';
import { ProductService } from '../services';
import { EProductItemStatus } from 'src/domain';
import { ProductPrintView } from '../entities';
import { ProductPrintsFilterDto } from 'src/domain/dtos/get-product-prints.dto';
import { UpdateProductItemStatusDto } from 'src/domain/dtos/update-product-item-status.dto';
import { MissingParams } from 'src/errors';

@ApiTags('Produtos')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @GetProductDetailsByIdSwagger()
  @Get(':productId')
  async getProductDetailsById(@Param('productId', ParseIntPipe) productId: number) {
    return this.productService.getProductDetailsById(productId);
  }

  @Get()
  async getProductDetailsByName(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe)
    pageSize: number,
    @Query('produto') produto: string,
  ) {
    return this.productService.getProductDetailsByName(produto, page, pageSize);
  }

  @GetProductDetailsByCodeSwagger()
  @Get('code/:code')
  async getProductDetailsByCode(@Param('code') code: string) {
    return this.productService.getProductDetailsByBarcode(code);
  }

  @GetProductDetailsByCodeSwagger()
  @Get('product/:epc')
  async getProductDetailsByEPC(@Param('epc') epc: string) {
    return this.productService.getProductDetailsByEPC(epc);
  }

  @Get('productItem/:productId')
  async getProductItemsByProductId(@Param('productId') productId: number) {
    return this.productService.getProductItemsByProductId(productId);
  }

  @Get('productItem/identification/:identification')
  async getProductItemsByIdentification(@Param('identification') identification: string) {
    return this.productService.getProductItemsByIdentification(identification);
  }

  @Get('summary/:startDate/:endDate/:armazemId')
  async getSummary(
    @Param('startDate') startDate: string,
    @Param('endDate') endDate: string,
    @Param('armazemId') armazemId: number,
  ) {
    return this.productService.getSummary(startDate, endDate, armazemId);
  }

  @Get('orders/summary/:startDate/:endDate/:armazemId')
  async getPedidosSummary(
    @Param('startDate') startDate: string,
    @Param('endDate') endDate: string,
    @Param('armazemId') armazemId: number,
  ) {
    return this.productService.getPedidosSummary(startDate, endDate, armazemId);
  }

  @Get('devolution/summary/:startDate/:endDate/:armazemId')
  async getDevolutionSummary(
    @Param('startDate') startDate: string,
    @Param('endDate') endDate: string,
    @Param('armazemId') armazemId: number,
  ) {
    return this.productService.getDevolucoesSummary(startDate, endDate, armazemId);
  }

  @Get('summary/:UF')
  async getSummaryByUF(@Param('UF') UF: string) {
    return this.productService.getSummaryByUF(UF);
  }

  @Put('productItem/status')
  async updateProductItemStatus(@Body('epc') identification: string, @Body('status') status: EProductItemStatus) {
    if (!Object.values(EProductItemStatus).includes(status)) {
      throw new BadRequestException('Invalid status');
    }
    return this.productService.updateProductItemStatus(identification, status);
  }

  /** Atualiza os status de multiplos produtos */
  @Put('productItem/status/bulk-update')
  async bulkUpdateProductItemStatus(@Body() products: UpdateProductItemStatusDto[]) {
    if (products.length === 0) {
      throw new BadRequestException('Não há status para atualizar.');
    }
    return this.productService.bulkUpdateProductItemStatus(products);
  }

  @Post('product-prints')
  async getProductPrints(@Body() filters: ProductPrintsFilterDto): Promise<ProductPrintView[]> {
    const { armazemId, nomeLoteImpressao, produtoLote, epc } = filters;

    if (!armazemId) {
      throw new BadRequestException('O armazemId é obrigatório.');
    }

    return this.productService.getProductPrintsByFilters(armazemId, nomeLoteImpressao, produtoLote, epc);
  }

  @Post('productItem/search')
  async searchProductItems(
    @Body()
    searchParams: {
      epc?: string;
      lot?: string;
      productCode?: string;
      productDescription?: string;
      orderCode?: string;
      invoiceNumber?: string;
      patientName?: string;
      operationDate?: string;
      status?: string;
    },
  ) {
    if (
      !searchParams.epc &&
      !searchParams.lot &&
      !searchParams.productCode &&
      !searchParams.productDescription &&
      !searchParams.orderCode &&
      !searchParams.invoiceNumber &&
      !searchParams.patientName &&
      !searchParams.operationDate &&
      !searchParams.status
    ) {
      throw new MissingParams();
    }

    return this.productService.searchProductItems(searchParams);
  }
}
