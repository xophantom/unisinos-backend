import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { PrintProductLabelDto } from '../domain';

export const PrintProductLabelSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Imprimir etiqueta RFID para produto' }),
    ApiBody({ type: PrintProductLabelDto }),
  );
