import { Module } from '@nestjs/common';
import { OrderProductService } from 'src/services/order-product.service';

@Module({
  imports: [],
  providers: [OrderProductService],
  exports: [OrderProductService],
})
export class OrderProductModule {}
