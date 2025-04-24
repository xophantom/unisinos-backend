import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsDate, IsNumber, IsOptional, IsString, Max, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ProductItem } from '@/entities/product-item.entity';

export class PrintProductLabelDto {
  @ApiProperty({ description: 'ID do armazém' })
  @IsNumber()
  warehouseId: number;

  @ApiProperty({ description: 'ID do produto' })
  @IsNumber()
  productId: number;

  @ApiProperty({ description: 'ID da impressora' })
  @IsOptional()
  @IsNumber()
  printerId?: number;

  @ApiProperty({ description: 'Lote do produto' })
  @IsString()
  lot: string;

  @ApiProperty({ description: 'Data de validade do produto' })
  @IsDate()
  @Transform(({ value }) => new Date(value))
  expirationDate: Date;

  // @Max(100)
  @ApiProperty({ description: 'Quantidade de etiquetas solicitadas' })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @MaxLength(500)
  @ApiProperty({ description: 'Endereco Completo' })
  @IsOptional()
  @IsString()
  address?: string;
}

export class ReprintProductLabelDto extends PartialType(PrintProductLabelDto) {
  @ApiProperty({ description: 'Lista de EPCs existentes para reimpressão' })
  @IsArray()
  @IsString({ each: true })
  existingEpcs: string[];
}

export class printProductLabelDTO {
  @ApiProperty({ description: 'Produtos solicitados' })
  productItems: ProductItem[];

  @ApiProperty({ description: 'Rótulos de produtos' })
  productLabel: string[];
}
