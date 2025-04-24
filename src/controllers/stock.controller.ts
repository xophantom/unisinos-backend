import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { User } from 'src/decorators/user.decorator';
import {
  GetListProductStockClientByStore,
  ProductsStockClientOrderDetals,
} from 'src/domain/dtos/get-product-stock-client';
import { PostProductsForPreInvoicesDTO } from 'src/domain/dtos/post-product-stock-costomer-invoiced.dto';
import { UserDetails } from 'src/domain/interfaces/user-cognito';
import { StockService } from 'src/services/stock.service';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get(':storeId/invoicing')
  async listClientStores(
    @Param('storeId') storeId: number,
    @Query() parametros: GetListProductStockClientByStore,
  ): Promise<ProductsStockClientOrderDetals[]> {
    return await this.stockService.getProductStockClient(storeId, parametros);
  }

  @Post('pre-invoicing')
  async postProductsForPreInvoices(@Body() params: PostProductsForPreInvoicesDTO, @User() user: UserDetails) {
    const username = user.email || user.username;
    return await this.stockService.postProductsForPreInvoices(params, username);
  }
}
