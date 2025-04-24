import { OrderProduct } from '@/entities/order-product.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsNumber, IsString, Max } from 'class-validator';

export class CreateInventoryOrderDTO {
  @ApiProperty({ description: 'Identificador da loja' })
  @IsNumber()
  storeId: number;
}

export class CreateReversalOrderDTO {
  @ApiProperty({ description: 'Identificador da loja' })
  @IsNumber()
  storeId: number;
}

export class CreateInventoryIdentifierDTO extends CreateInventoryOrderDTO {}

export class ProductInventoryOrder {
  @ApiProperty({ description: 'id do produto' })
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'Lote do produto' })
  @IsString()
  lot: string;

  @ApiProperty({ description: 'Data de validade do produto' })
  @IsDate()
  @Transform(({ value }) => new Date(value))
  expirationDate: Date;

  // @Max(100)
  @ApiProperty({ description: 'Quantidade de etiquetas solicitadas' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ description: 'Custo unitário do produto' })
  @IsNumber()
  unitCost: number;
}

export class AddProductInventoryOrderDTO {
  orderId: number;
  orderCode: number;
  orderType: string;
  product: ProductInventoryOrder;
}

export class AddProductInventoryOrderResponse {
  @ApiProperty({ description: 'Producto solicitacao' })
  orderProduct: OrderProduct;

  @ApiProperty({ description: 'Rótulos de produtos' })
  productLabel: string[];
}
