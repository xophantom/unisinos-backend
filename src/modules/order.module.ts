import { Module, forwardRef } from '@nestjs/common';

import { DevolutionModule } from './devolution.module';
import { OrderService } from 'src/services/order.service';
import { OrderController } from 'src/controllers/order.controller';
import { ProductModule } from './product.module';
import { MovementModule } from './movement.module';
import { InventoryOrderModule } from './inventory-order.module';
import { ElfaApiModule } from './elfa-api.module';

@Module({
  imports: [forwardRef(() => DevolutionModule), ProductModule, MovementModule, InventoryOrderModule, ElfaApiModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
