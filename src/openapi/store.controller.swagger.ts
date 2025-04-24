import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { Client, Store } from '../entities';

export const GetStoreProductMetricsSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Obter métricas dos produtos para uma loja específica' }),
    ApiParam({ name: 'storeId', description: 'O ID da loja' }),
    ApiResponse({
      status: 200,
      description: 'Métricas dos produtos para a loja específica',
      content: {
        'application/json': {
          example: {
            awaitingDeliveryAmount: 0,
            awaitingDeliveryValue: 0,
            inClientStockAmount: 317,
            inClientStockValue: 95004.5,
            stockDiscrepancyAmount: 10,
            stockDiscrepancyValue: 956.24,
            consumedAmount: 1238,
            consumedValue: 205698.37,
            totalAmount: 1565,
            totalValue: 301659.11,
          },
        },
      },
    }),
  );

export const GetStoreProductsFinanceMetricsSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Obter métricas financeiras dos produtos para uma loja específica' }),
    ApiParam({ name: 'storeId', description: 'O ID da loja' }),
    ApiResponse({
      status: 200,
      description: 'Métricas financeiras dos produtos para a loja específica',
      content: {
        'application/json': {
          example: {
            consumedAmount: 1238,
            consumedValue: 205698.37,
            preInvoicedAmount: 0,
            preInvoicedValue: 0,
            invoicedAmount: 0,
            invoicedValue: 0,
            totalAmount: 1238,
            totalValue: 205698.37,
          },
        },
      },
    }),
  );

export const ListStoreProductsSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Listar os produtos de uma loja específica' }),
    ApiParam({ name: 'storeId', description: 'O ID da loja' }),
    ApiQuery({ name: 'page', description: 'Número da página', required: false }),
    ApiQuery({ name: 'pageSize', description: 'Tamanho da página', required: false }),
    ApiQuery({ name: 'search', description: 'Termo de pesquisa', required: false }),
    ApiQuery({ name: 'productCode', required: false, enum: ['asc', 'desc'] }),
    ApiQuery({ name: 'productDescription', required: false, enum: ['asc', 'desc'] }),
    ApiQuery({ name: 'awaitingDeliveryAmount', required: false, enum: ['asc', 'desc'] }),
    ApiQuery({ name: 'awaitingDeliveryValue', required: false, enum: ['asc', 'desc'] }),
    ApiQuery({ name: 'inClientStockAmount', required: false, enum: ['asc', 'desc'] }),
    ApiQuery({ name: 'inClientStockValue', required: false, enum: ['asc', 'desc'] }),
    ApiQuery({ name: 'stockDiscrepancyAmount', required: false, enum: ['asc', 'desc'] }),
    ApiQuery({ name: 'stockDiscrepancyValue', required: false, enum: ['asc', 'desc'] }),
    ApiQuery({ name: 'consumedAmount', required: false, enum: ['asc', 'desc'] }),
    ApiQuery({ name: 'consumedValue', required: false, enum: ['asc', 'desc'] }),
    ApiResponse({
      status: 200,
      description: 'Lista de produtos da loja específica',
      content: {
        'application/json': {
          example: {
            products: [
              {
                productId: 290,
                productCode: 599,
                productDescription: 'ADESIVO DERMABOND ADV ALTA VISC 0,5ML AHV12 - ETHICON',
                awaitingDeliveryAmount: 0,
                awaitingDeliveryValue: 0,
                inClientStockAmount: 7,
                inClientStockValue: 1147.09,
                stockDiscrepancyAmount: 0,
                stockDiscrepancyValue: 0,
                consumedAmount: 88,
                consumedValue: 14420.56,
              },
            ],
            totalItems: 1,
          },
        },
      },
    }),
  );

export const ListStoreProductsFinanceSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Listar as informações financeiras dos produtos de uma loja específica' }),
    ApiParam({ name: 'storeId', description: 'O ID da loja' }),
    ApiQuery({ name: 'page', description: 'Número da página', required: false }),
    ApiQuery({ name: 'pageSize', description: 'Tamanho da página', required: false }),
    ApiQuery({ name: 'startDate', description: 'Data de início', required: false }),
    ApiQuery({ name: 'stopDate', description: 'Data de término', required: false }),
    ApiQuery({ name: 'search', description: 'Termo de pesquisa', required: false }),
    ApiQuery({ name: 'productCode', required: false, enum: ['asc', 'desc'] }),
    ApiQuery({ name: 'productDescription', required: false, enum: ['asc', 'desc'] }),
    ApiQuery({ name: 'consumedAmount', required: false, enum: ['asc', 'desc'] }),
    ApiQuery({ name: 'consumedValue', required: false, enum: ['asc', 'desc'] }),
    ApiQuery({ name: 'preInvoicedAmount', required: false, enum: ['asc', 'desc'] }),
    ApiQuery({ name: 'preInvoicedValue', required: false, enum: ['asc', 'desc'] }),
    ApiQuery({ name: 'invoicedAmount', required: false, enum: ['asc', 'desc'] }),
    ApiQuery({ name: 'invoicedValue', required: false, enum: ['asc', 'desc'] }),
    ApiResponse({
      status: 200,
      description: 'Informações financeiras dos produtos da loja específica',
      content: {
        'application/json': {
          example: {
            products: [
              {
                productId: 111,
                productCode: 420,
                productDescription: 'HARMONIC ACEA 7 SHEART HARH36 - ETHICON',
                consumedAmount: 0,
                consumedValue: 0,
                preInvoicedAmount: 0,
                preInvoicedValue: 0,
                invoicedAmount: 0,
                invoicedValue: 0,
              },
            ],
            totalItems: 1,
          },
        },
      },
    }),
  );

export const ListStoreProductsDetailsSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Listar os detalhes dos produtos de uma loja específica' }),
    ApiParam({ name: 'storeId', description: 'O ID da loja' }),
    ApiParam({ name: 'productId', description: 'O ID do produto' }),
    ApiQuery({ name: 'page', description: 'Número da página', required: false }),
    ApiQuery({ name: 'pageSize', description: 'Tamanho da página', required: false }),
    ApiResponse({
      status: 200,
      description: 'Detalhes dos produtos da loja específica',
      content: {
        'application/json': {
          example: {
            productDetails: [
              {
                productItemId: 580,
                receivedAt: '2023-06-14T03:00:00.000Z',
                orderCode: 36429,
                epc: '3035E2220020DED659663D5CÇ',
                lot: '171C15',
                expiresAt: '2027-10-31T03:00:00.000Z',
                status: 'CONSUMIDO',
              },
            ],
            totalItems: 1,
          },
        },
      },
    }),
  );

export const GetStoreDetailsSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Detalhes de uma loja' }),
    ApiParam({
      name: 'storeId',
      description: 'Id da loja',
      type: 'number',
      format: 'integer',
    }),
    ApiOkResponse({
      schema: {
        type: 'object',
        required: ['id', 'code', 'cnpj', 'city', 'state'],
        allOf: [
          {
            $ref: getSchemaPath(Store),
          },
          {
            required: ['id', 'code', 'name', 'tradingName', 'client'],
            properties: {
              client: {
                $ref: getSchemaPath(Client),
              },
            },
          },
        ],
      },
    }),
  );

export const GetStoreAntennaStatusSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Obter status das antenas de uma loja' }),
    ApiParam({
      name: 'storeId',
      description: 'Id da loja',
      type: 'number',
      format: 'integer',
    }),
    ApiOkResponse({
      schema: {
        type: 'object',
        required: ['id'],
        properties: {
          id: {
            type: 'number',
            format: 'integer',
            description: 'Id da antena',
          },
          lastReading: {
            type: 'string',
            format: 'date-time',
            description: 'Data da última leitura da antena',
          },
        },
      },
    }),
  );

export const UpdateStoreProductInventorySwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Atualizar inventário dos produtos de uma loja via CSV' }),
    ApiParam({
      name: 'storeId',
      description: 'Id da loja',
      type: 'number',
      format: 'integer',
    }),
    ApiBody({
      description: 'Arquivo CSV contendo o inventário de produtos',
      type: 'multipart/form-data',
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
  );

export const ListPendingInvoicingProductsSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Listar os produtos pendentes de faturamento de uma loja' }),
    ApiParam({ name: 'storeId', description: 'O ID da loja' }),
    ApiQuery({ name: 'page', description: 'Número da página', required: false }),
    ApiQuery({ name: 'pageSize', description: 'Tamanho da página', required: false }),
    ApiQuery({ name: 'productCode', required: false, enum: ['asc', 'desc'] }),
    ApiQuery({ name: 'productDescription', required: false, enum: ['asc', 'desc'] }),
    ApiQuery({ name: 'lot', required: false, enum: ['asc', 'desc'] }),
    ApiQuery({ name: 'expiresAt', required: false, enum: ['asc', 'desc'] }),
    ApiQuery({ name: 'consumedAmount', required: false, enum: ['asc', 'desc'] }),
    ApiQuery({ name: 'consumedValue', required: false, enum: ['asc', 'desc'] }),
    ApiResponse({
      status: 200,
      description: 'Detalhes dos produtos da loja específica',
      content: {
        'application/json': {
          example: {
            products: [
              {
                productCode: 449,
                productDescription: 'AGULHA ULTRA VERESS UV120MM - ETHICON',
                lot: '171C09',
                expiresAt: '2027-10-31T03:00:00.000Z',
                consumedAmount: 5,
                consumedValue: 941.4,
                productItemIds: [2141, 1954, 2148, 2151, 2155],
              },
            ],
            totalItems: 189,
          },
        },
      },
    }),
  );

export const ExportPendingInvoicingProductsListSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Exportar lista de produtos consumidos para faturamento' }),
    ApiParam({ name: 'storeId', description: 'ID da loja' }),
  );
