import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  PostProductsForFirstEventInvoicesDTO,
  PostProductsForInvoicesDTO,
} from 'src/domain/dtos/post-product-stock-costomer-invoiced.dto';
import { StockService } from 'src/services/stock.service';

@Controller('api-services')
export class InvoiceController {
  constructor(private readonly stockService: StockService) {}

  //* 1. Inclusão/Não inclusão do faturamento.
  @Post('invoice/consignment')
  @HttpCode(HttpStatus.OK)
  async postProductsForFirstEventInvoices(@Body() params: PostProductsForFirstEventInvoicesDTO[]) {
    await this.stockService.postProductsForFirstEventInvoices(params);
    return { message: 'Success' };
  }

  //* 2. Confirmação/Cancelamento do faturamento
  @Post('invoice/process')
  @HttpCode(HttpStatus.OK)
  async postProductsForInvoices(@Body() paramsArray: PostProductsForInvoicesDTO[]) {
    await this.stockService.postProductsForInvoices(paramsArray);
    return { message: 'Success' };
  }
}
