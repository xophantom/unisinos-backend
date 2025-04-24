import { ApiProperty } from '@nestjs/swagger';

export class StoreOrdersSchema {
  @ApiProperty({
    format: 'integer',
    example: 1,
    description: 'Id da loja',
  })
  storeId: number;

  @ApiProperty({
    format: 'integer',
    example: 1,
    description: 'Id da solicitação',
  })
  orderId: number;

  @ApiProperty({
    format: 'integer',
    example: 1,
    description: 'Código da solicitação',
  })
  orderCode: number;

  @ApiProperty({
    description: 'Data da solicitação',
  })
  requestedAt: Date;

  @ApiProperty({
    format: 'float',
    example: 1,
    description: 'Valor total dos produtos solicitados',
  })
  totalValue: number;

  @ApiProperty({
    format: 'integer',
    example: 15,
    description: 'Quantidade total de produtos solicitados',
  })
  requestedAmount: number;

  @ApiProperty({
    format: 'integer',
    example: 7,
    description: 'Quantidade total de produtos consumidos',
  })
  consumedAmount: number;

  @ApiProperty({
    format: 'integer',
    example: 3,
    description: 'Quantidade total de produtos divergentes',
  })
  divergentAmount: number;

  @ApiProperty({
    format: 'integer',
    example: 1,
    description: 'Quantidade total de produtos enviados',
  })
  shippedAmount: number;

  @ApiProperty({
    format: 'integer',
    example: 1,
    description: 'Quantidade de produtos a serem confirmados',
  })
  confirmedBalance: number;

  @ApiProperty({
    format: 'integer',
    example: 1,
    description: 'Quantidade de produtos a entrarem em divergência',
  })
  divergentBalance: number;
}
