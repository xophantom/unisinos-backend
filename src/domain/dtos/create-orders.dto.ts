import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderProductDto } from './create-order-product.dto';

export class CreateOrdersDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderProductDto)
  products: CreateOrderProductDto[];
}
