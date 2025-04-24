import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MovementBillingDto } from './update-movements-products.dto';

export class AddMovementBillingDateDto {
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => MovementBillingDto)
  products: MovementBillingDto[];
}
