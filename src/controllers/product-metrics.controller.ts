/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, Get, Query, Res } from '@nestjs/common';
import { ProductMetricsService } from 'src/services/product-metrics.service';
import { Response } from 'express';
import { MetricsQueryParams } from 'src/domain/interfaces/metrics-query.interface';

@Controller('metrics')
export class ProductMetricsController {
  constructor(private readonly productMetricsService: ProductMetricsService) {}

  @Get('graphs')
  async getProductMetrics(
    @Query('dataEmissao') dataEmissao?: string,
    @Query('representante') representante?: string,
    @Query('filial') filial?: string,
    @Query('documentoCliente') documentoCliente?: string,
    @Query('clienteCodigo') clienteCodigo?: string,
    @Query('codigoProduto') codigoProduto?: string,
    @Query('descricaoProduto') descricaoProduto?: string,
    @Query('lote') lote?: string,
    @Query('notaFiscal') notaFiscal?: string,
    @Query('paciente') paciente?: string,
    @Query('dataProcedimento') dataProcedimento?: string,
    @Query('tipoRemessa') tipoRemessa?: string,
    @Query('remessa') remessa?: string,
    @Query('uf') uf?: string,
  ) {
    return this.productMetricsService.getProductMetrics({
      dataEmissao,
      representante,
      filial,
      documentoCliente,
      clienteCodigo,
      codigoProduto,
      descricaoProduto,
      lote,
      notaFiscal,
      paciente,
      dataProcedimento,
      tipoRemessa,
      remessa,
      uf,
    });
  }

  @Get('graphs/csv')
  async exportMetricsToCSV(@Query() filters: MetricsQueryParams, @Res() res: Response) {
    const csvContent = await this.productMetricsService.generateMetricsCSV(filters);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=metrics.csv');
    res.send(csvContent);
  }

  @Get('graphs/expiration')
  async getProductMetricsByExpiration(
    @Query('clienteCodigo') clienteCodigo?: string,
    @Query('codigoProduto') codigoProduto?: string,
    @Query('descricaoProduto') descricaoProduto?: string,
    @Query('uf') uf?: string,
    @Query('status') status?: 'green' | 'yellow' | 'red',
    @Query('tipoRemessa') tipoRemessa?: string,
    @Query('dataVencimento') dataVencimento?: string,
  ) {
    return this.productMetricsService.getProductMetricsByExpiration({
      clienteCodigo,
      codigoProduto,
      descricaoProduto,
      uf,
      status,
      tipoRemessa,
      dataVencimento,
    });
  }

  @Get('graphs/expiration/csv')
  async exportMetricsCSVByExpiration(
    @Query('clienteCodigo') clienteCodigo?: string,
    @Query('codigoProduto') codigoProduto?: string,
    @Query('descricaoProduto') descricaoProduto?: string,
    @Query('uf') uf?: string,
    @Query('status') status?: 'green' | 'yellow' | 'red',
    @Query('documentoArmazem') documentoArmazem?: string,
    @Query('tipoRemessa') tipoRemessa?: string,
    @Query('dataVencimento') dataVencimento?: string,

    @Res() res?: Response,
  ) {
    const csvContent = await this.productMetricsService.generateMetricsCSVByExpiration({
      clienteCodigo,
      codigoProduto,
      descricaoProduto,
      uf,
      status,
      documentoArmazem,
      tipoRemessa,
      dataVencimento,
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=metrics-expiration.csv');
    res.send(csvContent);
  }
}
