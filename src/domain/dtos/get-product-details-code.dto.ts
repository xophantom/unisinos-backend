import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetProductDetailsByBarcodeDTO {
  @ApiProperty({ description: 'Id do produto' })
  id: number;

  @ApiProperty({ description: 'Código do produto' })
  code: number;

  @ApiProperty({ description: 'Descrição do produto' })
  description: string;

  @ApiPropertyOptional({ description: 'Lote do produto' })
  lote?: string;

  @ApiPropertyOptional({ description: 'Data de validade' })
  exp?: string;

  @ApiPropertyOptional({ description: 'Data de validade' })
  epc?: string;
}
