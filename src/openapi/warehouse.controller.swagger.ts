import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';

const createOkResponseDecorator = (description: string, schema: any) => ApiOkResponse({ description, schema });

export const ListWarehouseSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Listar os armazéns' }),
    createOkResponseDecorator('Success', {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          code: { type: 'number', example: 1001 },
          name: { type: 'string', example: 'NACIONAL - RIBEIRAO PRETO (MATRIZ)' },
        },
      },
    }),
  );

export const ListWarehousePrintersSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Listar as impressoras de um armazém' }),
    createOkResponseDecorator('Success', {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          description: { type: 'string', example: 'IMPRESSORA 01 - TÉRREO' },
        },
      },
    }),
  );

export const ListWarehouseProductStocksSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Listar os estoques de um armazém pelo QR Code, código de barras ou código do produto' }),
    ApiParam({ name: 'warehouseId', description: 'Id do armazém', type: 'number', format: 'integer' }),
    ApiParam({
      name: 'code',
      description: 'QR Code, código de barras ou código do produto',
      type: 'string',
      format: 'string',
    }),
    ApiOkResponse({
      schema: {
        type: 'object',
        properties: {
          product: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              code: { type: 'number', example: 3 },
              technicalName: {
                type: 'string',
                example: 'CAMPO OPERATORIO 23X25CM 8G RX C 50 VALENTINNA PREMIUM B22 - AMED',
              },
            },
          },
          stocks: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                lot: { type: 'string', example: '584A44' },
                expirationDate: { type: 'string', format: 'date' },
              },
            },
          },
        },
      },
    }),
  );

export const GetWarehouseOrderDetailsSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Buscar detalhes da solicitação de um armazém com base no código da solicitação' }),
    ApiParam({ name: 'warehouseId', description: 'Id do armazém', type: 'number', format: 'integer' }),
    ApiParam({
      name: 'orderCode',
      description: 'Código da solicitação',
      type: 'number',
      format: 'integer',
    }),
    ApiOkResponse({
      schema: {
        type: 'object',
        properties: {
          code: { type: 'number', example: 1 },
          invoiceNumber: { type: 'string', example: '000000001' },
          invoiceSeries: { type: 'string', example: '1' },
          totalValue: { type: 'number', example: 203.7 },
          totalAmount: { type: 'number', example: 10 },
          store: {
            type: 'object',
            properties: {
              code: { type: 'number', example: 1 },
              document: { type: 'string', example: '7045325000130' },
              documentType: { type: 'string', example: 'CNPJ' },
              city: { type: 'string', example: 'SAO PAULO' },
              state: { type: 'string', example: 'SP' },
              client: {
                type: 'object',
                properties: {
                  code: { type: 'number', example: 1 },
                  tradingName: { type: 'string', example: 'SAHA SERVICOS MEDICO' },
                },
              },
            },
          },
          products: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                code: { type: 'number', example: 1 },
                lot: { type: 'string', example: 'A12' },
                name: { type: 'string', example: 'AGULHA' },
                amount: { type: 'number', example: 10 },
                unitCost: { type: 'number', example: 20.37 },
              },
            },
          },
        },
      },
    }),
  );

export const ImportWarehouseOrderDetailsSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Importar solicitação de um armazém com base no código da solicitação' }),
    ApiParam({ name: 'warehouseId', description: 'Id do armazém', type: 'number', format: 'integer' }),
    ApiParam({
      name: 'orderCode',
      description: 'Código da solicitação',
      type: 'number',
      format: 'integer',
    }),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          products: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                code: { type: 'number', format: 'integer', example: 1552 },
                identifications: { type: 'array', items: { type: 'string', example: 'XYZ1552' } },
              },
            },
          },
        },
      },
    }),
    HttpCode(HttpStatus.CREATED),
  );
