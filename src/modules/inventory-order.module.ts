import { Module } from '@nestjs/common';
import { InventoryOrderService } from '../services';
import { StoreModule } from './store.module';
import { OrderProductModule } from './order-product.module';
import { PrintLabelsModule } from './print-labels.module';
import { ElfaApiModule } from './elfa-api.module';
import { ProductModule } from './product.module';

@Module({
  imports: [StoreModule, PrintLabelsModule, OrderProductModule, ElfaApiModule, ProductModule],
  providers: [InventoryOrderService],
  exports: [InventoryOrderService],
})
export class InventoryOrderModule {}
