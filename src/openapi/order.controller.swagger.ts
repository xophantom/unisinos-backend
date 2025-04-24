import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam, getSchemaPath } from '@nestjs/swagger';
import { Order } from '../entities';

export const ListOrderDetailsSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Listar os dados de uma solicitação',
    }),
    ApiParam({
      name: 'orderId',
      description: 'Id da solicitação',
      type: 'number',
      format: 'integer',
    }),
    ApiOkResponse({
      schema: {
        type: 'object',
        required: ['id'],
        allOf: [
          {
            $ref: getSchemaPath(Order),
          },
          {
            required: ['code', 'cnpj', 'city', 'state', 'storeCode', 'clientCode'],
            properties: {
              cnpj: {
                type: 'string',
                example: '00000000000000',
                pattern: '/\\d{14}/',
                description: 'CNPJ da loja',
              },
              city: {
                type: 'string',
                example: 'São Paulo',
                maxLength: 100,
                description: 'Município da loja',
              },
              state: {
                type: 'string',
                example: 'SP',
                maxLength: 2,
                description: 'UF da loja',
              },
              storeCode: {
                type: 'number',
                format: 'integer',
                example: 1,
                description: 'Código da loja',
              },
              clientCode: {
                type: 'number',
                format: 'integer',
                example: 1,
                description: 'Código do cliente',
              },
            },
          },
        ],
      },
    }),
  );

export const GetOrderShippingStatusSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Listar o status de uma solicitação',
    }),
    ApiParam({
      name: 'orderId',
      description: 'Id da solicitação',
      type: 'number',
      format: 'integer',
    }),
    ApiOkResponse({
      schema: {
        type: 'object',
        required: ['requestedAt'],
        properties: {
          requestedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Data da solicitação',
          },
          shippedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Data de envio',
          },
          receivedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Data de recebimento',
          },
          closedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Data de finalização',
          },
        },
      },
    }),
  );
