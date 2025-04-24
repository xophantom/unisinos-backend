import { ArrayMinSize, IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class ProductDto {
  @ApiProperty({ description: 'Código do produto' })
  @IsNumber()
  code: number;

  @ApiProperty({ description: 'Lote do produto' })
  @IsString()
  lot: string;

  @ApiProperty({ description: 'Identificações do produto' })
  @IsArray()
  @ArrayMinSize(1, { message: 'Deve haver pelo menos uma identificação.' })
  identifications: string[];
}

export class ImportWarehouseOrderDetailsDto {
  @IsArray()
  @ArrayMinSize(1, { message: 'Deve haver pelo menos um produto.' })
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: ProductDto[];
}
