import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InvoiceService } from '../services';
import { GeneratePreInvoiceDto } from '../domain';
import { GeneratePreInvoicePrintSwagger, GetPaymentConditionsSwagger, UpdateToInvoicedSwagger } from '../openapi';

@ApiTags('Faturas')
@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @GeneratePreInvoicePrintSwagger()
  @Post('generate-pre-invoice')
  async generatePreInvoice(@Body() generatePreInvoiceDto: GeneratePreInvoiceDto) {
    return this.invoiceService.generatePreInvoice(generatePreInvoiceDto);
  }

  @UpdateToInvoicedSwagger()
  @Patch('saleOrderCode/:saleOrderCode/update-to-invoiced')
  async updateToInvoiced(@Param('saleOrderCode', ParseIntPipe) saleOrderCode: number) {
    return this.invoiceService.updateToInvoiced(saleOrderCode);
  }

  @GetPaymentConditionsSwagger()
  @Get('payment-conditions')
  async getPaymentConditions() {
    return this.invoiceService.getPaymentConditions();
  }
}
