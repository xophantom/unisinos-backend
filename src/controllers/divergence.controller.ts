import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DivergenceService } from 'src/services/divergence.service';

@ApiTags('Divergencias')
@Controller('divergence')
export class DivergenceController {
  constructor(private readonly divergenceService: DivergenceService) {}

  @Get('store/:storeId')
  async getDivergencesByStoreId(@Param('storeId') storeId: number, @Query('type') type?: string) {
    return this.divergenceService.getDivergencesByStoreId(storeId, type);
  }

  @Post('transfer/clients')
  async transferBetweenClients(
    @Body('divergenceIds') divergenceIds: number[],
    @Body('orderCode') orderCode?: number,
    @Body('invoiceNumber') invoiceNumber?: number,
    @Body('invoiceSeries') invoiceSeries?: number,
  ) {
    return this.divergenceService.transferBetweenClients(divergenceIds, orderCode, invoiceNumber, invoiceSeries);
  }

  @Post('transfer/stock')
  async transferFromStock(
    @Body('divergenceIds') divergenceIds: number[],
    @Body('orderCode') orderCode?: number,
    @Body('invoiceNumber') invoiceNumber?: number,
    @Body('invoiceSeries') invoiceSeries?: number,
  ) {
    return this.divergenceService.transferFromStock(divergenceIds, orderCode, invoiceNumber, invoiceSeries);
  }
}
