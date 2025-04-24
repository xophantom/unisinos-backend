import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { EOrderType } from '../enums';

export class CreateOrderProductDto {
  @ApiProperty({ description: 'Código da solicitação' })
  @IsNumber()
  orderCode: number;

  @ApiProperty({ description: 'Tipo da solicitação' })
  @IsEnum(EOrderType)
  @Transform(({ value }) => value.toUpperCase())
  type: EOrderType;

  @ApiProperty({ description: 'Código do cliente' })
  @IsNumber()
  clientCode: number;

  @ApiProperty({ description: 'Código da loja' })
  @IsNumber()
  storeCode: number;

  @ApiProperty({ description: 'Data da solicitação' })
  @IsDate()
  @Transform(({ value }) => new Date(value))
  requestedAt: Date;

  @ApiProperty({ description: 'Data de envio dos produtos' })
  @IsDate()
  @Transform(({ value }) => new Date(value))
  shippedAt: Date;

  @ApiProperty({ description: 'Código do produto' })
  @IsNumber()
  productCode: number;

  @ApiProperty({ description: 'Lote do produto' })
  @IsNotEmpty()
  @IsString()
  lot: string;

  @ApiProperty({ description: 'Data de validade' })
  @IsDate()
  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  expiresAt?: Date;

  @ApiProperty({
    description: 'Tag RFID associada ao produto',
  })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => {
    if (value.endsWith(';') || value.toUpperCase().endsWith('Ç')) {
      return value.slice(0, -1).toUpperCase();
    }

    return value.toUpperCase();
  })
  tag: string;

  @ApiProperty({ description: 'Código da solicitação' })
  @IsNumber()
  value: number;
}

export class SaveOrderProductsDTO {
  id: number;

  amount: number;

  unitCost: number;
}
