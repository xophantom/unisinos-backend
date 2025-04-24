import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductsStockClientOrderDetals } from 'src/domain/dtos/get-product-stock-client';

export const ListClientStockSwagger = () =>
  applyDecorators(
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Sistagem de Produtos consumidos da Solicitação',
      type: ProductsStockClientOrderDetals,
      isArray: true,
    }),
    ApiOperation({
      summary: 'Lista produtos consumidos no estoque do cliente',
    }),
  );
