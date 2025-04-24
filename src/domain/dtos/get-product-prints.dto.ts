import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductPrintsFilterDto {
  @IsNumber()
  armazemId: number;

  @IsOptional()
  @IsString()
  nomeLoteImpressao?: string;

  @IsOptional()
  @IsString()
  produtoLote?: string;

  @IsOptional()
  @IsString()
  epc?: string;
}
