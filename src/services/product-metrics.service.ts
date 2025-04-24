/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ProductItemDetailView } from '../entities/product-item-detail-view.entity';
import { createObjectCsvStringifier } from 'csv-writer';
import { flattenMetricsData } from 'src/tools/csv-flattener';
import { MetricsQueryParams } from 'src/domain/interfaces/metrics-query.interface';
import { flattenExpirationMetricsData } from 'src/tools/csv-flattener-expiration';
import { MetricsQueryParamsNotFound } from 'src/errors';

@Injectable()
export class ProductMetricsService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async getProductMetrics(filters: MetricsQueryParams) {
    const query = this.dataSource.createQueryBuilder(ProductItemDetailView, 'productItemDetail');

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        if ((key === 'dataEmissao' || key === 'dataProcedimento') && value.includes('_')) {
          const [start, end] = value.split('_');
          query.andWhere(`productItemDetail.${this.mapFilterToColumn(key)} BETWEEN :start AND :end`, { start, end });
        } else if (key === 'descricaoProduto') {
          query.andWhere(`LOWER(productItemDetail.${this.mapFilterToColumn(key)}) LIKE LOWER(:descricaoProduto)`, {
            descricaoProduto: `%${value}%`,
          });
        } else {
          query.andWhere(`productItemDetail.${this.mapFilterToColumn(key)} = :${key}`, { [key]: value });
        }
      }
    });

    const result = await query.getMany();

    if (result.length === 0) {
      throw new NotFoundException('Nenhum dado encontrado para os filtros aplicados.');
    }

    return this.formatMetrics(result);
  }

  async generateMetricsCSV(filters: any): Promise<string> {
    const data = await this.getProductMetrics(filters);

    if (!data || Object.keys(data).length === 0) {
      throw new NotFoundException('Nenhum dado encontrado para exportação.');
    }

    const flattenedData = flattenMetricsData(data);

    const groupedData = flattenedData.reduce((acc: Record<string, any[]>, item) => {
      const section = item.Section || 'Other';
      if (!acc[section]) acc[section] = [];
      acc[section].push(item);
      return acc;
    }, {});

    let csvContent = '';

    for (const [section, rows] of Object.entries(groupedData) as [string, any[]][]) {
      const csvHeaders = Array.from(new Set((rows as any[]).flatMap((row) => Object.keys(row)))).map((key) => ({
        id: key,
        title: key.charAt(0).toUpperCase() + key.slice(1),
      }));

      const csvWriterInstance = createObjectCsvStringifier({
        header: csvHeaders,
      });

      csvContent += `\n[Section: ${section}]\n`;
      csvContent += csvWriterInstance.getHeaderString();
      csvContent += csvWriterInstance.stringifyRecords(
        rows.map((row: any) =>
          csvHeaders.reduce((record: Record<string, any>, { id }) => {
            record[id] = row[id] ?? '';
            return record;
          }, {}),
        ),
      );
    }

    return csvContent;
  }

  async getProductMetricsByExpiration(filters: MetricsQueryParams & { status?: 'green' | 'red' | 'yellow' }) {
    const { status, ...dbFilters } = filters;

    const items = await this.fetchExpirationItems(dbFilters);

    if (items.length === 0) {
      throw new MetricsQueryParamsNotFound();
    }

    const now = new Date();

    let filteredItems = items;
    if (status) {
      filteredItems = items.filter((item) => this.classifyItemByExpiration(item, now) === status);
      if (filteredItems.length === 0) {
        throw new Error(`Nenhum item com status "${status}" encontrado.`);
      }
    }

    const totals = {
      green: { quantidade: 0, valor: 0 },
      yellow: { quantidade: 0, valor: 0 },
      red: { quantidade: 0, valor: 0 },
    };

    const clientsMap: Record<
      string,
      {
        uf: string;
        cliente: string;
        clienteCodigo: string;
        lojaCodigo: string;
        green: number;
        yellow: number;
        red: number;
      }
    > = {};
    const analyticalMap: Record<
      string,
      {
        codigo: string;
        descricao: string;
        cliente: string;
        clienteCodigo: string;
        lojaCodigo: string;
        dataValidade: Date;
        green: number;
        yellow: number;
        red: number;
      }
    > = {};

    filteredItems.forEach((item) => {
      const category = this.classifyItemByExpiration(item, now);
      const valor = Number(item.unitCost) || 0;

      totals[category].quantidade += 1;
      totals[category].valor += valor;

      const uf = String(item.storeUF || '');
      const cliente = item.storeName || '';
      const clienteCodigo = item.clientCode || '';
      const lojaCodigo = item.storeCode || '';
      const dataValidade = item.expiresAt;

      const clientKey = `${uf}-${cliente}`;
      if (!clientsMap[clientKey]) {
        clientsMap[clientKey] = { uf, cliente, clienteCodigo, lojaCodigo, green: 0, yellow: 0, red: 0 };
      }
      clientsMap[clientKey][category] += 1;

      const codigo = String(item.productCode);
      const descricao = String(item.productDescription);
      const analyticalKey = `${codigo}-${cliente}`;
      if (!analyticalMap[analyticalKey]) {
        analyticalMap[analyticalKey] = {
          codigo,
          descricao,
          cliente,
          clienteCodigo,
          lojaCodigo,
          dataValidade,
          green: 0,
          yellow: 0,
          red: 0,
        };
      }
      analyticalMap[analyticalKey][category] += 1;
    });

    const totalItems = filteredItems.length;
    const greenPercentage = this.calculatePercentage(totalItems, totals.green.quantidade);
    const yellowPercentage = this.calculatePercentage(totalItems, totals.yellow.quantidade);
    const redPercentage = this.calculatePercentage(totalItems, totals.red.quantidade);

    const clients = Object.values(clientsMap).map((group) => {
      const risco = group.green > 0 ? this.calculatePercentage(group.green, group.red + group.yellow) : 0;
      return {
        uf: group.uf,
        cliente: group.cliente,
        clienteCodigo: group.clienteCodigo,
        lojaCodigo: group.lojaCodigo,
        quantidadeNoPrazo: group.green,
        quantidadeEmAlerta: group.yellow,
        quantidadeVencido: group.red,
        risco,
      };
    });

    const analytical = Object.values(analyticalMap);

    return {
      Green: {
        quantidade: totals.green.quantidade,
        valor: totals.green.valor,
        porcentagem: greenPercentage,
      },
      Yellow: {
        quantidade: totals.yellow.quantidade,
        valor: totals.yellow.valor,
        porcentagem: yellowPercentage,
      },
      Red: {
        quantidade: totals.red.quantidade,
        valor: totals.red.valor,
        porcentagem: redPercentage,
      },
      Clients: clients,
      Analytical: analytical,
    };
  }

  async generateMetricsCSVByExpiration(
    filters: MetricsQueryParams & { status?: 'green' | 'yellow' | 'red' },
  ): Promise<string> {
    const { status, ...dbFilters } = filters;

    let items = await this.fetchExpirationItems(dbFilters);

    if (items.length === 0) {
      throw new NotFoundException('Nenhum dado encontrado para os filtros aplicados.');
    }

    const now = new Date();

    if (status) {
      items = items.filter((item) => this.classifyItemByExpiration(item, now) === status);
      if (items.length === 0) {
        throw new NotFoundException(`Nenhum item com status "${status}" encontrado.`);
      }
    }

    const flattenedData = flattenExpirationMetricsData(items, (item) => {
      const classification = this.classifyItemByExpiration(item, now);
      switch (classification) {
        case 'green':
          return 'Prazo';
        case 'yellow':
          return 'Alerta';
        case 'red':
          return 'Vencido';
      }
    });

    const csvHeaders = Object.keys(flattenedData[0]).map((key) => ({
      id: key,
      title: key,
    }));

    const csvWriterInstance = createObjectCsvStringifier({
      header: csvHeaders,
      alwaysQuote: true,
    });

    let csvContent = csvWriterInstance.getHeaderString();
    csvContent += csvWriterInstance.stringifyRecords(flattenedData);

    return csvContent;
  }

  /* -------------------------------- Privates -------------------------------- */

  private async fetchExpirationItems(filters: MetricsQueryParams): Promise<ProductItemDetailView[]> {
    const query = this.dataSource.createQueryBuilder(ProductItemDetailView, 'productItemDetail');

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        if ((key === 'dataEmissao' || key === 'dataProcedimento') && value.includes('_')) {
          const [start, end] = value.split('_');
          query.andWhere(`productItemDetail.${this.mapFilterToColumn(key)} BETWEEN :start AND :end`, { start, end });
        } else if (key === 'dataVencimento' && value.includes('_')) {
          const [start, end] = value.split('_');
          query.andWhere(`productItemDetail.expiresAt BETWEEN :start AND :end`, { start, end });
        } else if (key === 'descricaoProduto') {
          query.andWhere(`LOWER(productItemDetail.${this.mapFilterToColumn(key)}) LIKE LOWER(:descricaoProduto)`, {
            descricaoProduto: `%${value}%`,
          });
        } else {
          query.andWhere(`productItemDetail.${this.mapFilterToColumn(key)} = :${key}`, { [key]: value });
        }
      }
    });

    query.andWhere(`productItemDetail.status IN (:...statuses)`, {
      statuses: ['ESTOQUE_CLIENTE', 'DIVERGENCIA_ESTOQUE'],
    });

    return await query.getMany();
  }

  private classifyItemByExpiration(item: ProductItemDetailView, now: Date): 'green' | 'yellow' | 'red' {
    const expiration = new Date(item.expiresAt);
    const diffDays = (expiration.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays > 90) {
      return 'green';
    } else if (diffDays > 30 && diffDays < 91) {
      return 'yellow';
    } else {
      return 'red';
    }
  }

  private calculatePercentage(total: number, part: number): number {
    return total > 0 ? (part / total) * 100 : 0;
  }

  private mapFilterToColumn(filter: string): string {
    const filterMappings: { [key: string]: string } = {
      dataEmissao: 'DataSolicitacao',
      representante: 'Representante',
      documentoArmazem: 'armazemCNPJ',
      filial: 'armazemCodigo',
      documentoCliente: 'LojaDocumento',
      cliente: 'LojaNome',
      codigoProduto: 'Codigo',
      descricaoProduto: 'Descricao',
      lote: 'Lote',
      notaFiscal: 'FaturaRemessa',
      paciente: 'Paciente',
      dataProcedimento: 'DataProcedimento',
      tipoRemessa: 'StatusRemessa',
      remessa: 'Remessa',
      uf: 'LojaUF',
    };

    return filterMappings[filter] || filter;
  }

  private formatMetrics(items: ProductItemDetailView[]) {
    const estoqueClienteItems = items.filter((item) => item.status === 'ESTOQUE_CLIENTE');
    const fixoItems = estoqueClienteItems.filter((item) => item.orderStatus === 'FIXO');
    const eletivoItems = estoqueClienteItems.filter((item) => item.orderStatus === 'ELETIVO');

    const consumidoItems = items.filter((item) => item.status === 'CONSUMIDO');
    const preFaturadoItems = items.filter((item) => item.status === 'PRE_FATURADO');
    const faturadoItems = items.filter((item) => item.status === 'FATURADO');

    const totalEstoqueCliente = fixoItems.length + eletivoItems.length;
    const totalGreenItems = consumidoItems.length + preFaturadoItems.length + faturadoItems.length;

    const branchData = estoqueClienteItems.reduce((acc, item) => {
      const key = item.armazemCodigo;
      if (!acc[key]) {
        acc[key] = {
          armazemCodigo: item.armazemCodigo,
          armazemNome: item.armazemNome,
          valorEstoqueCliente: 0,
          quantidadeEstoqueCliente: 0,
        };
      }
      acc[key].valorEstoqueCliente += item.unitCost || 0;
      acc[key].quantidadeEstoqueCliente += 1;
      return acc;
    }, {});
    const totalArmazemQuantidade = Number(
      Object.values(branchData).reduce((sum: number, branch: any) => sum + Number(branch.quantidadeEstoqueCliente), 0),
    );
    const branch = Object.values(branchData).map((branch: any) => ({
      armazemCodigo: branch.armazemCodigo,
      armazemNome: branch.armazemNome,
      valorEstoqueCliente: Number(branch.valorEstoqueCliente),
      quantidadeEstoqueCliente: Number(branch.quantidadeEstoqueCliente),
      porcentagem:
        totalArmazemQuantidade > 0 ? (Number(branch.quantidadeEstoqueCliente) / totalArmazemQuantidade) * 100 : 0,
    }));

    const sellerData = items.reduce((acc: Record<string, any>, item) => {
      const key = item.sellerName;
      if (!acc[key]) {
        acc[key] = {
          sellerName: item.sellerName,
          uniqueInvoices: new Set(),
          uniqueClients: new Set(),
          totalValue: 0,
        };
      }
      acc[key].uniqueInvoices.add(item.invoiceNumber);
      acc[key].uniqueClients.add(item.clientId);
      acc[key].totalValue += Number(item.unitCost);
      return acc;
    }, {});
    const seller = Object.values(sellerData).map((seller: any) => {
      const totalInvoices = seller.uniqueInvoices.size;
      const totalClients = seller.uniqueClients.size;
      const ticketMedio = totalInvoices > 0 ? seller.totalValue / totalInvoices : 0;
      return {
        representante: seller.sellerName,
        quantidadeFaturas: totalInvoices,
        quantidadeClientes: totalClients,
        valorTotalPedidos: seller.totalValue,
        ticketMedio,
      };
    });

    const analyticalData = items.reduce((acc: Record<string, any>, item) => {
      const key = `${item.productCode}-${item.lot}`;
      if (!acc[key]) {
        acc[key] = {
          codigo: item.productCode,
          descricao: item.productDescription,
          armazemCodigo: item.armazemCodigo,
          armazemNome: item.armazemNome,
          lote: item.lot,
          dataValidade: item.expiresAt,
          valorUnitario: Number(item.unitCost),
          quantidade: 0,
          valorTotal: 0,
        };
      }
      acc[key].quantidade += 1;
      acc[key].valorTotal = acc[key].quantidade * acc[key].valorUnitario;
      return acc;
    }, {});
    const analytical = Object.values(analyticalData).map((analytical: any) => ({
      codigo: analytical.codigo,
      descricao: analytical.descricao,
      armazemCodigo: analytical.armazemCodigo,
      armazemNome: analytical.armazemNome,
      lote: analytical.lote,
      dataValidade: analytical.dataValidade,
      valorUnitario: analytical.valorUnitario,
      quantidade: analytical.quantidade,
      valorTotal: analytical.valorTotal,
    }));

    return {
      Orange: {
        valorTotalEstoqueCliente: estoqueClienteItems.reduce((sum, item) => sum + (item.unitCost || 0), 0),
        quantidadeTotalEstoqueCliente: estoqueClienteItems.length,
        porcentagem: estoqueClienteItems.length > 0 ? (estoqueClienteItems.length / items.length) * 100 : 0,
      },
      Blue: {
        valorTotalEstoqueClienteFixo: fixoItems.reduce((sum, item) => sum + (item.unitCost || 0), 0),
        quantidadeTotalEstoqueClienteFixo: fixoItems.length,
        porcentagemFixo: totalEstoqueCliente > 0 ? (fixoItems.length / totalEstoqueCliente) * 100 : 0,

        valorTotalEstoqueClienteEletivo: eletivoItems.reduce((sum, item) => sum + (item.unitCost || 0), 0),
        quantidadeTotalEstoqueClienteEletivo: eletivoItems.length,
        porcentagemEletivo: totalEstoqueCliente > 0 ? (eletivoItems.length / totalEstoqueCliente) * 100 : 0,
      },
      Green: {
        valorTotalConsumido: consumidoItems.reduce((sum, item) => sum + (item.unitCost || 0), 0),
        quantidadeTotalConsumido: consumidoItems.length,
        porcentagemConsumido: totalGreenItems > 0 ? (consumidoItems.length / totalGreenItems) * 100 : 0,

        valorTotalPreFaturado: preFaturadoItems.reduce((sum, item) => sum + (item.unitCost || 0), 0),
        quantidadeTotalPreFaturado: preFaturadoItems.length,
        porcentagemPreFaturado: totalGreenItems > 0 ? (preFaturadoItems.length / totalGreenItems) * 100 : 0,

        valorTotalFaturado: faturadoItems.reduce((sum, item) => sum + (item.unitCost || 0), 0),
        quantidadeTotalFaturado: faturadoItems.length,
        porcentagemFaturado: totalGreenItems > 0 ? (faturadoItems.length / totalGreenItems) * 100 : 0,
      },
      Branch: branch,
      Seller: seller,
      Analytical: analytical,
    };
  }
}
