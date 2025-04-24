import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ReverseProductDTO {
  @IsOptional()
  @IsNumber()
  remessa: number;

  @IsNotEmpty()
  @IsString()
  lojaDocumento: string;

  @IsOptional()
  @IsString()
  epc?: string;

  @IsOptional()
  @IsNumber()
  quantidade?: number;

  @IsOptional()
  @IsNumber()
  produtoId?: number;

  @IsOptional()
  @IsString()
  lote?: string;
}
