import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export const SortQuerySwagger = (name: string) =>
  applyDecorators(
    ApiQuery({
      name,
      type: 'string',
      enum: ['asc', 'desc'],
      required: false,
      example: 'asc',
    }),
  );
