import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsDate, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsGreaterOrEqualThan } from 'src/decorators';

export class GeneratePreInvoiceDto {
  @ApiProperty({ description: 'Identificador da loja' })
  @IsNumber()
  storeId: number;

  @ApiProperty({ description: 'Identificadores dos produtos itens' })
  @IsArray()
  productItemIds: number[];

  @ApiProperty({ description: 'Nota fiscal de devolução' })
  @IsNumber()
  invoiceRef: number;

  @ApiProperty({ description: 'Código do pedido de venda' })
  @IsNumber()
  saleOrderCode: number;

  @ApiProperty({ description: 'Data de devolução da resposta do cliente' })
  @IsDate()
  @Transform(({ value }) => new Date(value))
  returnDate: Date;

  @ApiProperty({ description: 'Data da venda' })
  @IsDate()
  @IsGreaterOrEqualThan('returnDate', {
    message: 'A data da venda deve ser posterior à data de devolução da resposta do cliente.',
  })
  @Transform(({ value }) => new Date(value))
  saleDate: Date;
}
