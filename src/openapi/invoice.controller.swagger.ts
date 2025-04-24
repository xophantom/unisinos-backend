import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { GeneratePreInvoiceDto } from '../domain';

export const GeneratePreInvoicePrintSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Gerar pré-fatura' }),

    ApiBody({ type: GeneratePreInvoiceDto }),
  );

export const UpdateToInvoicedSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Atualizar pré-fatura para faturada' }),
    ApiParam({
      name: 'saleOrderCode',
      description: 'Código do pedido de venda',
      type: 'string',
      format: 'string',
    }),
  );

export const GetPaymentConditionsSwagger = () =>
  applyDecorators(
    ApiOperation({ summary: 'Obter condições de pagamento' }),
    ApiOkResponse({
      schema: {
        type: 'object',
        properties: {
          teste: {
            type: 'string',
            nullable: true,
            example: 'Brazil',
          },
        },
      },
    }),
  );
