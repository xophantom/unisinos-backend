import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export const PaginationFilterQuery = () =>
  applyDecorators(
    ApiQuery({
      name: 'page',
      type: 'number',
      required: false,
      description: 'Página, o valor padrão é 1',
      example: 1,
    }),
    ApiQuery({
      name: 'pageSize',
      type: 'number',
      required: false,
      description: 'Tamanho da página, o valor padrão é 10',
      example: 10,
    }),
  );
