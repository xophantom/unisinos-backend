import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam } from '@nestjs/swagger';

export const GetProductDetailsByIdSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Obter detalhes de um produto por identificador',
    }),
    ApiParam({
      name: 'productId',
      description: 'Id do produto',
      type: 'number',
      format: 'integer',
    }),
  );

export const GetProductDetailsByCodeSwagger = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Obter detalhes de um produto pelo código de barra',
    }),
    ApiParam({
      name: 'code',
      description: 'Código de barra do produto',
      type: 'string',
      format: 'text',
    }),
  );
