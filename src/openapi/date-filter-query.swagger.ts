import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import dayjs from 'dayjs';

export const DateFilterQuery = () =>
  applyDecorators(
    ApiQuery({
      name: 'startDate',
      required: false,
      description: 'Período inicial do filtro',
      example: new Date(),
    }),
    ApiQuery({
      name: 'stopDate',
      required: false,
      description: 'Período final do filtro',
      example: dayjs().add(1, 'day').toDate(),
    }),
  );
